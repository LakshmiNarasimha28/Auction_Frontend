import { Link } from "react-router-dom";

const AuctionCard = ({ auction }) => {
  const isAuctionEnded = new Date(auction.endTime) < new Date();
  const timeRemaining = new Date(auction.endTime) - new Date();
  const hoursLeft = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)));

  return (
    <Link to={`/auction/${auction._id}`}>
      <div className="card group cursor-pointer overflow-hidden">
        {/* Image Container */}
        <div className="relative h-56 bg-gray-100 overflow-hidden rounded-lg mb-4">
          {auction.images?.[0] ? (
            <img 
              src={auction.images[0]} 
              alt={auction.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-5xl">📦</span>
            </div>
          )}
          
          {/* Status Badge */}
          {isAuctionEnded ? (
            <div className="absolute top-3 right-3 badge badge-danger">
              Ended
            </div>
          ) : (
            <div className="absolute top-3 right-3 badge badge-primary">
              Active
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
            {auction.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {auction.location && <span>{auction.location}</span>}
          </p>

          {/* Bid Info */}
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 font-medium">Current Bid</span>
              <span className="text-lg font-bold text-blue-600">
                ₹{(auction.currentHighestBid || auction.startingPrice).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Time Remaining */}
          {!isAuctionEnded && (
            <div className="text-xs text-gray-600 font-medium mb-3">
              ⏰ {hoursLeft > 0 ? `${hoursLeft}h left` : 'Ending soon'}
            </div>
          )}

          {/* CTA */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow-md group-hover:shadow-lg">
            View Details →
          </button>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;