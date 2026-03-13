import React, { useState, useEffect } from "react";
import { getUserReviews, getReviewStats } from "../../services/reviewservice";
import useAuth from "../../hooks/useAuth";

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("received");

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        await fetchReviews();
        await fetchStats();
      };
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeTab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getUserReviews(user._id);
      setReviews(data.reviews || data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load reviews");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getReviewStats(user._id);
      setStats(data);
    } catch (err) {
      console.error("Error fetching review stats:", err);
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
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
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600 mt-1">Monitor reputation and feedback from auction activity.</p>
        </div>
        <span className="badge badge-primary w-fit">{reviews.length} reviews</span>
      </div>
      
      {stats && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Review Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-compact">
              <p className="text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold">{stats.totalReviews || 0}</p>
            </div>
            <div className="card-compact">
              <p className="text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold">{stats.averageRating?.toFixed(1) || "N/A"}</p>
            </div>
            <div className="card-compact">
              <p className="text-gray-600">Rating</p>
              <p className="text-2xl">{stats.averageRating ? renderStars(Math.round(stats.averageRating)) : "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="card-compact inline-flex gap-2">
          <button
            onClick={() => setActiveTab("received")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${activeTab === "received" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Reviews Received
          </button>
          <button
            onClick={() => setActiveTab("given")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${activeTab === "given" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Reviews Given
          </button>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold">{review.fromUser?.name || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-xl">{renderStars(review.rating)}</div>
              </div>
              
              {review.comment && (
                <p className="text-gray-700">{review.comment}</p>
              )}
              
              {review.reviewType && (
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {review.reviewType}
                </span>
              )}
              
              {review.response && (
                <div className="mt-4 pl-4 border-l-4 border-gray-200">
                  <p className="text-sm font-semibold text-gray-600">Response:</p>
                  <p className="text-gray-700">{review.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
