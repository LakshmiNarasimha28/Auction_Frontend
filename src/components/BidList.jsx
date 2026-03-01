const BidList = ({ bids }) => {
  if (!Array.isArray(bids) || bids.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-bold text-gray-900 text-lg">Bid History</h4>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-100">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 font-medium">No bids yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to place a bid on this auction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-bold text-gray-900 text-lg">Bid History</h4>
        </div>
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
          {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
        </span>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {bids.map((bid, index) => {
          const isHighest = index === 0;
          return (
            <div 
              key={bid._id || `${bid.amount}-${bid.createdAt || index}`} 
              className={`p-4 rounded-lg border transition-all ${
                isHighest 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    isHighest ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {(bid?.bidder?.name || "Anonymous").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {bid?.bidder?.name || "Anonymous Bidder"}
                    </p>
                    {bid.createdAt && (
                      <p className="text-xs text-gray-500">
                        {new Date(bid.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    isHighest ? 'text-green-600' : 'text-gray-700'
                  }`}>
                    ₹{bid?.amount?.toLocaleString() ?? 0}
                  </p>
                  {isHighest && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Highest
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BidList;