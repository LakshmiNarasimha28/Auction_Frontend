import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuctionById, placeBid } from "../../services/auctionservice.js";
import useAuth from "../../hooks/useAuth";

const AuctionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getAuctionById(id);
        setAuction(res.data.data);
        setBidAmount(res.data.data.currentHighestBid + 1 || res.data.data.startingPrice);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load auction");
        console.error("Error fetching auction:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError("");
    setBidSuccess("");

    if (!user) {
      navigate("/login");
      return;
    }

    const minBid = (auction.currentHighestBid || auction.startingPrice) + 1;
    if (bidAmount < minBid) {
      setBidError(`Bid must be at least ₹${minBid}`);
      return;
    }

    try {
      setSubmittingBid(true);
      const res = await placeBid(id, bidAmount);
      setAuction(res.data.data);
      setBidSuccess("Bid placed successfully!");
      setBidAmount(res.data.data.currentHighestBid + 1);
    } catch (err) {
      setBidError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setSubmittingBid(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  if (!auction) return null;

  const isAuctionEnded = new Date(auction.endTime) < new Date();
  const timeRemaining = new Date(auction.endTime) - new Date();
  const hoursLeft = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 text-blue-600 hover:underline flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <div>
          <div className="bg-gray-200 rounded-lg overflow-hidden mb-4">
            {auction.images?.length > 0 ? (
              <img
                src={auction.images[selectedImage]}
                alt={auction.title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-400">
                No Images Available
              </div>
            )}
          </div>
          {auction.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {auction.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${auction.title} ${index + 1}`}
                  className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === index ? "border-blue-600" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{auction.title}</h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Current Highest Bid:</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{auction.currentHighestBid || auction.startingPrice}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Starting Price:</span>
              <span className="font-semibold">₹{auction.startingPrice}</span>
            </div>
          </div>

          {!isAuctionEnded ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="font-semibold text-gray-800">Time Remaining:</p>
                  <p className="text-lg text-yellow-700">
                    {hoursLeft}h {minutesLeft}m
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 font-semibold">⚠️ Auction Ended</p>
            </div>
          )}

          <div className="bg-white border rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Description:</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{auction.description}</p>
          </div>

          {auction.condition && (
            <div className="mb-4">
              <span className="font-semibold text-gray-800">Condition: </span>
              <span className="text-gray-600">{auction.condition}</span>
            </div>
          )}

          {auction.location && (
            <div className="mb-4">
              <span className="font-semibold text-gray-800">Location: </span>
              <span className="text-gray-600">{auction.location}</span>
            </div>
          )}

          {/* Bidding Section */}
          {!isAuctionEnded && user && (
            <form onSubmit={handlePlaceBid} className="bg-gray-50 border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Place Your Bid:</h3>
              
              {bidError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                  {bidError}
                </div>
              )}
              
              {bidSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 text-sm">
                  {bidSuccess}
                </div>
              )}

              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={(auction.currentHighestBid || auction.startingPrice) + 1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter bid amount"
                    disabled={submittingBid}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingBid}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold transition"
                >
                  {submittingBid ? "Placing..." : "Place Bid"}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Minimum bid: ₹{(auction.currentHighestBid || auction.startingPrice) + 1}
              </p>
            </form>
          )}

          {!isAuctionEnded && !user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 mb-3">Please login to place a bid</p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login to Bid
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;