import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AuctionCard = ({ auction }) => {
  const isAuctionEnded = new Date(auction.endTime) < new Date();
  const timeRemaining = new Date(auction.endTime) - new Date();
  const hoursLeft = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)));

  return (
    <motion.div
      whileHover={{ y: -12 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="group"
    >
      <Link to={`/auction/${auction._id}`}>
        <div className="bg-[#1B1A1F] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#B2546A]/40 transition-all duration-500 shadow-2xl relative">
          {/* Image Section */}
          <div className="relative h-64 overflow-hidden">
            {auction.images?.[0] ? (
              <img 
                src={auction.images[0]} 
                alt={auction.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-white/5">
                <svg className="w-16 h-16 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Status Overlays */}
            <div className="absolute top-4 right-4 z-10">
              <span className={`nft-badge ${isAuctionEnded ? "nft-badge-ended" : "nft-badge-active"}`}>
                {isAuctionEnded ? "Archive" : "Live Now"}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1B1A1F] to-transparent">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#B2546A] animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                   {isAuctionEnded ? "Auction Closed" : `${hoursLeft}H remaining`}
                 </span>
               </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-xl font-black text-white group-hover:text-[#D8A9B0] transition-colors line-clamp-1 mb-2 tracking-tight uppercase">
                {auction.title}
              </h3>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {auction.location || "Digital Gallery"}
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Current Value</p>
                <p className="text-2xl font-black text-white">₹{(auction.currentHighestBid || auction.startingPrice).toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#B2546A]/10 flex items-center justify-center text-[#B2546A] group-hover:bg-[#B2546A] group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AuctionCard;