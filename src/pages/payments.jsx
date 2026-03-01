import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getAuctionById } from "../services/auctionservice";
import {
  createOrder,
  verifyPayment,
  createDirectPayment,
  getPaymentDetails,
  confirmDirectPayment
} from "../services/paymentservice.js";
import PaymentStatus from "../components/paymentStatus";
import PaymentMethod from "../components/paymentMethod";

const PaymentPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch auction details
        const auctionRes = await getAuctionById(id);
        const auctionData = auctionRes.data.data || auctionRes.data;
        setAuction(auctionData);

        // Fetch payment details
        try {
          const paymentRes = await getPaymentDetails(id);
          setPayment(paymentRes.data.data || paymentRes.data);
        } catch {
          // Payment might not exist yet
          console.log("Payment not found, will create new");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load auction details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleOnlinePayment = async () => {
    try {
      setProcessing(true);
      setError("");
      const { data } = await createOrder(id);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        order_id: data.id,
        name: "Auction Hub",
        description: `Payment for ${auction.title}`,
        handler: async (response) => {
          try {
            await verifyPayment({
              auctionId: id,
              ...response
            });
            alert("Payment successful!");
            navigate(`/auction/${id}`);
          } catch {
            setError("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create order");
      setProcessing(false);
    }
  };

  const handleDirectPayment = async () => {
    try {
      setProcessing(true);
      setError("");
      await createDirectPayment(id);
      alert("Direct payment request sent to seller. Please wait for confirmation.");
      navigate(`/auction/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send payment request");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setProcessing(true);
      setError("");
      await confirmDirectPayment(payment._id);
      alert("Payment confirmed successfully!");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error && !auction) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Authorization checks
  const winnerId = auction?.winner?._id || auction?.winner;
  const sellerId = auction?.seller?._id || auction?.seller || auction?.createdBy;
  const userId = user?._id || user?.id;
  const isSeller = String(sellerId) === String(userId);
  const isWinner = String(winnerId) === String(userId);

  // Check if user is the winner
  if (!isWinner && !isSeller) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized Access</h3>
          <p className="text-gray-700 mb-6">You are not authorized to view this payment page. Only the auction winner can make payments.</p>
          <button
            onClick={() => navigate(`/auction/${id}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Back to Auction
          </button>
        </div>
      </div>
    );
  }

  // Seller view
  if (isSeller) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seller Payment View</h2>
          <p className="text-gray-600 mb-6">You are the seller of this auction. Here's the payment status:</p>
          
          {payment ? (
            <PaymentStatus payment={payment} isSeller={true} />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 font-medium">No payment initiated yet</p>
              <p className="text-gray-500 text-sm mt-2">The winner hasn't started the payment process</p>
            </div>
          )}

          {payment?.method === "direct" && payment?.status === "pending" && (
            <button
              onClick={handleConfirmPayment}
              disabled={processing}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold transition"
            >
              {processing ? "Confirming..." : "Confirm Payment Received"}
            </button>
          )}
        </div>

        <button
          onClick={() => navigate(`/auction/${id}`)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Auction
        </button>
      </div>
    );
  }

  // Winner view
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
        <p className="text-gray-600 mb-6">Congratulations on winning this auction! Please complete the payment to finalize your purchase.</p>

        {/* Auction Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Auction Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Item:</span>
              <span className="font-medium text-gray-900">{auction.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Winning Bid:</span>
              <span className="font-bold text-green-600 text-lg">₹{(auction.currentHighestBid || auction.startingPrice).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {payment ? (
          <PaymentStatus payment={payment} isSeller={false} />
        ) : (
          <PaymentMethod
            onOnlinePayment={handleOnlinePayment}
            onDirectPayment={handleDirectPayment}
            processing={processing}
          />
        )}
      </div>

      <button
        onClick={() => navigate(`/auction/${id}`)}
        className="text-blue-600 hover:text-blue-700 font-medium"
      >
        ← Back to Auction
      </button>
    </div>
  );
};

export default PaymentPage;