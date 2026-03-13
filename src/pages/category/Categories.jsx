import React, { useState, useEffect } from "react";
import { getCategories } from "../../services/categoryservice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      // Backend returns nesting under .data
      const categoryData = res.data || res.categories || res;
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?category=${categoryId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0B0D] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#B2546A] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0B0D] text-white">
      {/* Background Decorative Polish */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-[#B2546A]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-[#D8A9B0]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
              Explore <span className="text-[#B2546A]">Categories</span>
            </h1>
            <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">
              Find your next masterpiece by browsing curated collections
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl"
          >
            <span className="text-2xl font-black text-[#B2546A]">{categories.length}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Genres</span>
          </motion.div>
        </div>
        
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center">
            <p className="text-red-400 font-bold uppercase tracking-widest text-sm">{error}</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                onClick={() => handleCategoryClick(category._id)}
                className="group cursor-pointer bg-[#1B1A1F] border border-[#B2546A]/10 rounded-2xl p-8 hover:border-[#B2546A]/40 transition-all duration-500 shadow-xl relative overflow-hidden"
              >
                {/* Background Glow */}
                <div 
                  className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: category.color || "#B2546A" }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/5 border border-white/10 group-hover:bg-[#B2546A]/10 group-hover:border-[#B2546A]/20 transition-all"
                    >
                      {category.icon || "💎"}
                    </div>
                    <svg className="w-5 h-5 text-white/10 group-hover:text-[#B2546A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-black text-white group-hover:text-[#D8A9B0] transition-colors mb-4 tracking-tight">
                    {category.name}
                  </h2>
                  
                  {category.description && (
                    <p className="text-white/40 text-sm leading-relaxed mb-8 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <div className="h-[2px] w-8 bg-[#B2546A]/20 group-hover:w-16 group-hover:bg-[#B2546A] transition-all duration-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#B2546A]">
                      {category.auctionCount || 0} Auctions
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl">
            <svg className="w-16 h-16 mx-auto mb-6 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No categories found at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
