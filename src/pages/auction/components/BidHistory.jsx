import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BidHistory = ({ bids }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1B1A1F] border border-[#B2546A]/20 rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-white font-bold uppercase tracking-widest text-sm">Bid History</h3>
        <span className="bg-[#B2546A]/10 text-[#D8A9B0] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
          {bids.length} Bids Total
        </span>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {bids.length > 0 ? (
          <div className="divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {bids.map((bid, index) => (
                <motion.div
                  key={bid._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 flex items-center justify-between group hover:bg-white/5 transition-colors ${index === 0 ? 'bg-[#B2546A]/5' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B2546A] to-[#D8A9B0] flex items-center justify-center text-white font-black text-xs shadow-lg">
                      {bid.bidder?.name?.[0].toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm group-hover:text-[#D8A9B0] transition-colors">
                        {bid.bidder?.name || 'Anonymous User'}
                      </p>
                      <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest">
                        {new Date(bid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg ${index === 0 ? 'text-[#D8A9B0]' : 'text-white/80'}`}>
                      ₹{bid.amount?.toLocaleString()}
                    </p>
                    {index === 0 && (
                      <span className="text-[8px] font-black uppercase text-[#B2546A] tracking-[0.2em]">Highest Bid</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No bids yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BidHistory;
