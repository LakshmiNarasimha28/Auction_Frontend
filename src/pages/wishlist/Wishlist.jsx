import React, { useState, useEffect } from "react";
import { getUserWishlist, removeFromWishlist } from "../../services/wishlistservice";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getUserWishlist();
      setWishlist(data.wishlist || data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load wishlist");
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (auctionId) => {
    try {
      await removeFromWishlist(auctionId);
      setWishlist((prev) => prev.filter((item) => (item.auction?._id || item._id) !== auctionId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError(err.message || "Failed to remove from wishlist");
    }
  };

  const handleViewAuction = (auctionId) => {
    navigate(`/auction/${auctionId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">Saved auctions you can revisit and bid on any time.</p>
        </div>
        <span className="badge badge-primary w-fit">{wishlist.length} saved</span>
      </div>
      
      {wishlist.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
          <button
            onClick={() => navigate("/search")}
            className="btn-primary"
          >
            Browse Auctions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const auction = item.auction || item;
            return (
              <div key={item._id} className="card p-0 overflow-hidden">
                {auction.images && auction.images[0] && (
                  <img
                    src={auction.images[0]}
                    alt={auction.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{auction.title}</h3>
                  
                  <div className="mb-4">
                    <p className="text-gray-600">
                      Current Bid: <span className="font-bold">${auction.currentPrice || auction.startingPrice}</span>
                    </p>
                    {auction.endTime && (
                      <p className="text-gray-500 text-sm">
                        Ends: {new Date(auction.endTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewAuction(auction._id)}
                      className="flex-1 btn-primary px-4 py-2"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(auction._id)}
                      className="btn-danger px-4 py-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
