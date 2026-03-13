import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BidPanel = ({ 
  auction, 
  user, 
  currentHighest, 
  isAuctionEnded, 
  onBidPlaced, 
  isSocketConnected 
}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ h: 0, m: 0, s: 0 });
      } else {
        setTimeLeft({
          h: Math.floor(diff / (1000 * 60 * 60)),
          m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  const minBid = Number(currentHighest || auction.startingPrice || 0) + 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(bidAmount) < minBid) return;
    onBidPlaced(Number(bidAmount));
    setBidAmount('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#1B1A1F] border border-[#B2546A]/20 rounded-2xl overflow-hidden shadow-2xl relative"
    >
      {/* Top Banner with Glow */}
      <div className="bg-gradient-to-r from-[#B2546A] to-[#D8A9B0] p-1 shadow-[0_4px_20px_rgba(178,84,106,0.3)]">
        <div className="bg-[#1B1A1F] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-[#B2546A] animate-pulse' : 'bg-gray-600'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8A9B0]">
              {isSocketConnected ? 'Live Auction' : 'Offline'}
            </span>
          </div>
          {!isAuctionEnded && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Ending In</span>
              <div className="flex gap-2 font-mono text-sm text-[#B2546A] py-1 px-3 rounded-lg bg-[#B2546A]/5 border border-[#B2546A]/20">
                <span className="w-6 text-center">{String(timeLeft.h).padStart(2, '0')}h</span>
                <span>:</span>
                <span className="w-6 text-center">{String(timeLeft.m).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="w-6 text-center">{String(timeLeft.s).padStart(2, '0')}s</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Pricing Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Current Bid</span>
            <motion.p 
              key={currentHighest}
              initial={{ scale: 1.1, color: '#B2546A' }}
              animate={{ scale: 1, color: '#fff' }}
              className="text-4xl font-black text-white"
            >
              ₹{currentHighest?.toLocaleString() || auction.startingPrice?.toLocaleString()}
            </motion.p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Starting At</span>
            <p className="text-xl font-bold text-white/80">₹{auction.startingPrice?.toLocaleString()}</p>
          </div>
        </div>

        {/* Bidding Action */}
        {!isAuctionEnded ? (
          user ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <input
                  type="number"
                  placeholder={`Min. bid ₹${minBid}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-12 py-5 text-white font-bold text-lg focus:outline-none focus:border-[#B2546A] transition-all placeholder:text-white/20"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B2546A] font-bold text-xl">₹</span>
                {/* Visual Feedback Line */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#B2546A] to-[#D8A9B0] w-0 group-focus-within:w-full transition-all duration-500" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(178,84,106,0.3)' }}
                whileTap={{ scale: 0.98 }}
                disabled={Number(bidAmount) < minBid}
                className="w-full bg-gradient-to-r from-[#B2546A] to-[#D8A9B0] text-white py-5 rounded-xl font-black text-lg uppercase tracking-widest shadow-xl disabled:opacity-50 disabled:grayscale transition-all"
              >
                Place Bid Now
              </motion.button>
              
              <p className="text-center text-[10px] text-white/40 font-bold uppercase tracking-wider">
                Minimum required bid is ₹{minBid.toLocaleString()}
              </p>
            </form>
          ) : (
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center space-y-4">
              <p className="text-white/80 font-bold">Sign in to join the auction</p>
              <button className="w-full py-4 rounded-xl border-2 border-[#B2546A] text-[#B2546A] font-black uppercase tracking-widest hover:bg-[#B2546A] hover:text-white transition-all">
                Login / Register
              </button>
            </div>
          )
        ) : (
          <div className="bg-[#B2546A]/10 border border-[#B2546A]/30 p-8 rounded-xl text-center">
            <h3 className="text-[#B2546A] text-2xl font-black uppercase tracking-widest mb-2">Auction Ended</h3>
            <p className="text-white/60 font-medium">This item is no longer available for bidding</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BidPanel;
