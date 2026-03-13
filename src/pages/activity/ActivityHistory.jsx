import React, { useState, useEffect } from "react";
import { getUserActivity } from "../../services/activityservice";

const ActivityHistory = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await getUserActivity();
      setActivities(data.activities || data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load activity history");
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      bid: "💰",
      auction_created: "📝",
      auction_won: "🏆",
      auction_ended: "⏰",
      payment: "💳",
      review: "⭐",
      wishlist: "❤️"
    };
    return icons[type] || "📌";
  };

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(activity => activity.type === filter);

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
          <h1 className="text-3xl font-bold text-gray-900">Activity History</h1>
          <p className="text-gray-600 mt-1">Track your recent bids, wins, payments, and account actions.</p>
        </div>
        <span className="badge badge-primary w-fit">{filteredActivities.length} entries</span>
      </div>
      
      <div className="card mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field max-w-sm"
        >
          <option value="all">All Activities</option>
          <option value="bid">Bids</option>
          <option value="auction_created">Auctions Created</option>
          <option value="auction_won">Auctions Won</option>
          <option value="payment">Payments</option>
          <option value="review">Reviews</option>
          <option value="wishlist">Wishlist</option>
        </select>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No activities found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity._id} className="card">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{getActivityIcon(activity.type)}</span>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-900">{activity.description}</h3>
                    <span className="badge badge-primary text-xs">{activity.type}</span>
                  </div>
                  
                  {activity.metadata && (
                    <div className="mt-2 text-gray-600 text-sm">
                      {activity.metadata.auctionTitle && (
                        <p>Auction: {activity.metadata.auctionTitle}</p>
                      )}
                      {activity.metadata.amount && (
                        <p>Amount: ${activity.metadata.amount}</p>
                      )}
                    </div>
                  )}
                  
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityHistory;
