import React from 'react';
import { motion } from 'framer-motion';

const RelatedAuctions = ({ auctions }) => {
  // Fallback data if no real related auctions provided
  const displayAuctions = auctions?.length > 0 ? auctions : [
    { id: 1, title: 'Cyberpunk Katana', price: 12000, time: '2h 15m', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'Ethereal Soul NFT', price: 45000, time: '12h 45m', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'Neon Sneakers V4', price: 8500, time: '34m 12s', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="mt-24 space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black uppercase tracking-tighter">More Like This</h2>
        <button className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B2546A] hover:text-[#D8A9B0] transition-colors flex items-center gap-2">
          View All <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3}/></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayAuctions.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="group bg-[#1B1A1F] border border-[#B2546A]/10 rounded-2xl overflow-hidden hover:border-[#B2546A]/40 transition-all duration-500 shadow-xl"
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black text-white/90 uppercase tracking-widest">
                {item.time}
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-black text-white group-hover:text-[#D8A9B0] transition-colors line-clamp-1">{item.title}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Current Bid</p>
                  <p className="text-xl font-black text-[#D8A9B0]">₹{item.price.toLocaleString()}</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-[#B2546A]/10 border border-[#B2546A]/20 text-[#B2546A] text-[10px] font-black uppercase tracking-widest hover:bg-[#B2546A] hover:text-white transition-all">
                  Bid Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedAuctions;
