import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuctionById } from "../../services/auctionservice.js";
import useAuth from "../../hooks/useAuth";
import PlaceBid from "./placeBid.jsx";
import { getBids } from "../../services/bidservice.js";
import BidList from "../../components/BidList.jsx";
import useSocket from "../../hooks/useSocket.js";

const AuctionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [bids, setBids] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const fetchAuction = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAuctionById(id);
      setAuction(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load auction");
      console.error("Error fetching auction:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchBids = useCallback(async () => {
    try {
      const res = await getBids(id);
      setBids(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching bids:", err);
      setBids([]);
    }
  }, [id]);

  useEffect(() => {
    fetchAuction();
  }, [fetchAuction]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  const handleIncomingBid = useCallback((newBid) => {
    if (!newBid) {
      return;
    }

    setIsSocketConnected(true);

    setBids((prev) => {
      if (!Array.isArray(prev)) {
        return [newBid];
      }

      const newBidId = newBid?._id;
      if (newBidId && prev.some((bid) => bid?._id === newBidId)) {
        return prev;
      }

      return [newBid, ...prev];
    });

    const newAmount = Number(newBid?.amount ?? newBid?.bidAmount);
    if (Number.isNaN(newAmount)) {
      return;
    }

    setAuction((prevAuction) => {
      if (!prevAuction) {
        return prevAuction;
      }

      const currentHighest = Number(prevAuction.currentHighestBid || prevAuction.startingPrice || 0);
      return {
        ...prevAuction,
        currentHighestBid: Math.max(currentHighest, newAmount)
      };
    });
  }, []);

  useSocket(id, handleIncomingBid);

  const handleBidPlaced = async () => {
    await Promise.all([fetchAuction(), fetchBids()]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          {!isAuctionEnded && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-gray-200">
              <span
                className={`h-2 w-2 rounded-full ${
                  isSocketConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              ></span>
              <span className="text-sm font-medium text-gray-700">
                {isSocketConnected ? "Live Updates" : "Connecting..."}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 border border-gray-100">
              {auction.images?.length > 0 ? (
                <img
                  src={auction.images[selectedImage]}
                  alt={auction.title}
                  className="w-full h-96 object-cover transition-transform hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-100">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400 font-medium">No Images Available</p>
                  </div>
                </div>
              )}
            </div>
            {auction.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {auction.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${auction.title} ${index + 1}`}
                    className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 transition-all hover:shadow-md ${
                      selectedImage === index ? "border-blue-500 shadow-md" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{auction.title}</h1>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>ID: {auction._id?.slice(-8) || 'N/A'}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">Current Highest Bid</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-green-600">
                    ₹{(auction.currentHighestBid || auction.startingPrice).toLocaleString()}
                  </span>
                  {bids.length > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-blue-200 pt-3">
                <span className="text-gray-600">Starting Price</span>
                <span className="font-semibold text-gray-800">₹{auction.startingPrice?.toLocaleString()}</span>
              </div>
            </div>

            {!isAuctionEnded ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5 mb-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm mb-1">Time Remaining</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {hoursLeft}h {minutesLeft}m
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-5 mb-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-red-700 font-bold text-lg">Auction Ended</p>
                    <p className="text-red-600 text-sm">Bidding is now closed</p>
                  </div>
                </div>
              </div>
            )}

            {/* Winner Payment Section */}
            {isAuctionEnded && user && auction.winner && (
              (() => {
                const winnerId = auction.winner?._id || auction.winner;
                const userId = user?._id || user?.id;
                const isWinner = String(winnerId) === String(userId);

                if (isWinner) {
                  return (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 mb-4 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 rounded-full p-3">
                          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-green-800 font-bold text-xl">Congratulations! You Won!</p>
                          <p className="text-green-700 text-sm">Complete payment to finalize your purchase</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/payment/${auction._id}`)}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-bold text-lg shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Proceed to Payment
                      </button>
                    </div>
                  );
                }
              })()
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{auction.description}</p>
            </div>

            {(auction.condition || auction.location) && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm space-y-3">
                {auction.condition && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-gray-800">Condition:</span>
                      <span className="ml-2 text-gray-600">{auction.condition}</span>
                    </div>
                  </div>
                )}
                {auction.location && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-gray-800">Location:</span>
                      <span className="ml-2 text-gray-600">{auction.location}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bidding Section */}
            {!isAuctionEnded && user && (
              <PlaceBid
                auctionId={auction._id}
                currentHighest={auction.currentHighestBid || auction.startingPrice}
                onBidPlaced={handleBidPlaced}
              />
            )}

            <BidList bids={bids} />

            {!isAuctionEnded && !user && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className="font-bold text-gray-900">Authentication Required</p>
                    <p className="text-sm text-gray-600">Please login to place a bid on this auction</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  Login to Start Bidding
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;