import React from 'react';
import { motion } from 'framer-motion';

const SellerCard = ({ seller }) => {
  if (!seller) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1B1A1F] border border-[#B2546A]/20 rounded-2xl p-6 shadow-xl relative group overflow-hidden"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D8A9B0]/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-[#D8A9B0]/10 transition-colors" />

      <h3 className="text-white/40 font-bold uppercase tracking-widest text-[10px] mb-6">Listed By</h3>
      
      <div className="flex items-center gap-5 mb-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B2546A] to-[#D8A9B0] p-[2px]">
            <div className="w-full h-full rounded-[14px] bg-[#1B1A1F] flex items-center justify-center overflow-hidden">
              <span className="text-2xl font-black text-[#D8A9B0]">
                {seller.name?.[0].toUpperCase() || 'S'}
              </span>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#1B1A1F] rounded-full" />
        </div>
        
        <div>
          <h4 className="text-xl font-black text-white group-hover:text-[#D8A9B0] transition-colors">
            {seller.name || 'Anonymous Seller'}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-[#B2546A]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.05 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                </svg>
              ))}
            </div>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-tighter">4.9 (124 sales)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
        >
          View Profile
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="py-3 px-4 rounded-xl bg-[#B2546A]/10 border border-[#B2546A]/30 text-[#D8A9B0] font-bold text-xs uppercase tracking-widest hover:bg-[#B2546A]/20 transition-colors"
        >
          Contact
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SellerCard;
