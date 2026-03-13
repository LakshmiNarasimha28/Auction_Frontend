import React, { useState, useEffect } from "react";
import { searchAuctions } from "../../services/searchservice";
import { getCategories } from "../../services/categoryservice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    status: "active",
    sortBy: "endTime"
  });

  useEffect(() => {
    fetchCategories();
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const catData = res.data || res.categories || res;
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchQuery = {
        q: filters.query,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        status: filters.status,
        sortBy: filters.sortBy
      };
      
      const res = await searchAuctions(searchQuery);
      // Backend returns nesting under .data or results key
      const auctionData = res.data?.auctions || res.auctions || res.data || res;
      setAuctions(Array.isArray(auctionData) ? auctionData : []);
    } catch (err) {
      setError(err.message || "Failed to search auctions");
      console.error("Error searching auctions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleReset = () => {
    setFilters({
      query: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      status: "active",
      sortBy: "endTime"
    });
  };

  const handleViewAuction = (auctionId) => {
    navigate(`/auction/${auctionId}`);
  };

  return (
    <div className="min-h-screen bg-[#0E0B0D] text-white">
      {/* Background Decorative Polish */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#B2546A]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-[#D8A9B0]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black uppercase tracking-tighter mb-4"
          >
            Find <span className="text-[#B2546A]">Treasures</span>
          </motion.h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">
            Search across thousands of active auctions
          </p>
        </div>
        
        {/* Search Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1B1A1F] border border-[#B2546A]/20 rounded-3xl p-8 mb-16 shadow-2xl backdrop-blur-xl"
        >
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Keywords</label>
                <input
                  type="text"
                  name="query"
                  value={filters.query}
                  onChange={handleFilterChange}
                  placeholder="Search by title..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#B2546A] transition-all placeholder:text-white/10 text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#B2546A] transition-all text-sm appearance-none"
                >
                  <option value="" className="bg-[#1B1A1F]">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id} className="bg-[#1B1A1F]">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Sort By</label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#B2546A] transition-all text-sm appearance-none"
                >
                  <option value="endTime" className="bg-[#1B1A1F]">Ending Soon</option>
                  <option value="currentPrice" className="bg-[#1B1A1F]">Price: Low to High</option>
                  <option value="-currentPrice" className="bg-[#1B1A1F]">Price: High to Low</option>
                  <option value="-createdAt" className="bg-[#1B1A1F]">Newest First</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Price Range (₹)</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#B2546A] transition-all text-sm"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#B2546A] transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Status</label>
                <div className="flex gap-2">
                  {['active', 'upcoming', 'ended'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFilters({...filters, status})}
                      className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        filters.status === status 
                        ? "bg-[#B2546A] border-[#B2546A] text-white" 
                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-[2] bg-gradient-to-r from-[#B2546A] to-[#D8A9B0] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl"
              >
                Refine Search
              </motion.button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-4 rounded-2xl border-2 border-white/10 text-white/60 font-black text-xs uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-center"
              >
                Reset
              </button>
            </div>
          </form>
        </motion.div>

        {/* Results Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#B2546A] border-t-transparent rounded-full"
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#B2546A]">Syncing Database...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center">
            <p className="text-red-400 font-bold uppercase tracking-widest text-sm">{error}</p>
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl">
            <p className="text-white/20 font-black uppercase tracking-widest text-sm">No results match your criteria</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                Found {auctions.length} listing{auctions.length !== 1 ? 's' : ''}
              </span>
              <span className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {auctions.map((auction, index) => (
                <motion.div
                  key={auction._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  className="group bg-[#1B1A1F] border border-[#B2546A]/10 rounded-3xl overflow-hidden hover:border-[#B2546A]/40 transition-all duration-500 shadow-2xl relative"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={auction.images?.[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400'}
                      alt={auction.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                      <span className="text-[10px] font-black text-white/90 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B2546A] animate-pulse" />
                        {filters.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-[#D8A9B0] transition-colors line-clamp-1 mb-2 tracking-tight">
                        {auction.title}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed line-clamp-2 font-medium">
                        {auction.description}
                      </p>
                    </div>
                    
                    <div className="flex items-end justify-between pt-6 border-t border-white/5">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-white/20 tracking-[0.2em] mb-1">Current Bid</p>
                        <p className="text-2xl font-black text-white">₹{(auction.currentPrice || auction.startingPrice)?.toLocaleString()}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewAuction(auction._id)}
                        className="bg-white/5 border border-white/10 hover:bg-[#B2546A] hover:border-[#B2546A] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
