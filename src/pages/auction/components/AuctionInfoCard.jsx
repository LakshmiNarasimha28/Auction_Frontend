import React from 'react';
import { motion } from 'framer-motion';

const AuctionInfoCard = ({ auction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1B1A1F] border border-[#B2546A]/20 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden group shadow-2xl"
    >
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#B2546A]/10 rounded-full blur-[80px] group-hover:bg-[#B2546A]/20 transition-colors duration-700" />
      
      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-4 py-1.5 rounded-full bg-[#B2546A]/10 border border-[#B2546A]/30 text-[#D8A9B0] text-xs font-bold tracking-wider uppercase">
            {auction.category?.name || 'Category'}
          </span>
          {auction.condition && (
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-bold tracking-wider uppercase">
              {auction.condition}
            </span>
          )}
          <span className="ml-auto text-white/40 text-xs font-medium tracking-tight">
            ID: {auction._id?.slice(-8).toUpperCase()}
          </span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          {auction.title}
        </h1>

        <div className="space-y-6 pt-6 border-t border-white/5">
          <div>
            <h3 className="text-[#D8A9B0]/60 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Description
            </h3>
            <p className="text-white/70 leading-relaxed text-base font-light">
              {auction.description}
            </p>
          </div>

          {auction.location && (
            <div className="flex items-center gap-2 text-white/50">
              <svg className="w-5 h-5 text-[#B2546A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">{auction.location}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionInfoCard;
