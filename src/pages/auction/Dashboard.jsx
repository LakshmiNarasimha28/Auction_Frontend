import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getAuctions } from "../../services/auctionservice.js";
import AuctionCard from "../../components/AuctionCard.jsx";
import useAuth from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState("connecting");
  const [isPaused, setIsPaused] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const pauseRef = useRef(false);

  const socketUrl =
    import.meta.env.VITE_SOCKET_URL ||
    (import.meta.env.VITE_BACKEND_URL
      ? import.meta.env.VITE_BACKEND_URL.replace(/\/api\/?$/, "")
      : "");
  const pollingIntervalMs = 30000;

  const fetchAuctions = useCallback(async (showLoading) => {
    try {
      if (showLoading) setLoading(true);
      else setIsRefreshing(true);
      
      const res = await getAuctions();
      setAuctions(res.data.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load auctions");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    pauseRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    fetchAuctions(true);
  }, [fetchAuctions]);

  useEffect(() => {
    if (!socketUrl) return;
    const socket = io(socketUrl, { transports: ["websocket"], autoConnect: true });
    socket.on("connect", () => setRealtimeStatus("connected"));
    socket.on("disconnect", () => setRealtimeStatus("disconnected"));
    
    const handleEvent = () => { if (!pauseRef.current) fetchAuctions(false); };
    socket.on("auctionCreated", handleEvent);
    socket.on("auctionUpdated", handleEvent);
    socket.on("bidPlaced", handleEvent);
    socket.on("auctionEnded", handleEvent);

    return () => {
      socket.disconnect();
    };
  }, [fetchAuctions, socketUrl]);

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "active") return matchesSearch && new Date(auction.endTime) > new Date();
    if (filterStatus === "ended") return matchesSearch && new Date(auction.endTime) <= new Date();
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
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
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-[#1B1A1F] border-r border-white/5 p-8 space-y-12">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Navigation</h3>
            <div className="space-y-4">
              {[
                { id: 'all', label: 'All Items', icon: '💎' },
                { id: 'active', label: 'Live Now', icon: '🔥' },
                { id: 'ended', label: 'Archive', icon: '🏛️' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setFilterStatus(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${
                    filterStatus === item.id 
                    ? "bg-[#B2546A] shadow-lg shadow-[#B2546A]/20" 
                    : "bg-white/5 hover:bg-white/10 text-white/60"
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Market Stats</h3>
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Market Volume</p>
                <p className="text-xl font-black">₹{auctions.reduce((acc, curr) => acc + (curr.currentHighestBid || curr.startingPrice), 0).toLocaleString()}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Active Assets</p>
                <p className="text-xl font-black">{auctions.filter(a => new Date(a.endTime) > new Date()).length}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/create-auction")}
            className="w-full btn-premium"
          >
            Create New Batch
          </button>
        </aside>

        {/* Main Section */}
        <main className="flex-1 p-8 lg:p-16 space-y-16">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Market <span className="text-[#B2546A]">Dashboard</span></h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${realtimeStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/60">{realtimeStatus}</span>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">
                  Last Sync: {lastUpdated?.toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div className="relative group min-w-[300px]">
              <input 
                type="text"
                placeholder="SEARCH ASSETS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1B1A1F] border border-white/10 rounded-2xl px-12 py-4 text-[10px] font-black tracking-widest focus:outline-none focus:border-[#B2546A] transition-all"
              />
              <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </header>

          <AnimatePresence mode="popLayout">
            {filteredAuctions.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
              >
                {filteredAuctions.map((auction, idx) => (
                  <motion.div
                    key={auction._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <AuctionCard auction={auction} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center"
              >
                <div className="w-20 h-20 mx-auto bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10">
                  <svg className="w-10 h-10 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">No matching assets found in the current sector</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;