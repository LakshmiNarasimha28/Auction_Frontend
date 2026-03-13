import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAuctionById } from "../../services/auctionservice.js";
import { getBids, placeBid } from "../../services/bidservice.js";
import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket.js";

// New Components
import ImageGallery from "./components/ImageGallery";
import AuctionInfoCard from "./components/AuctionInfoCard";
import BidPanel from "./components/BidPanel";
import BidHistory from "./components/BidHistory";
import SellerCard from "./components/SellerCard";
import ChatPanel from "./components/ChatPanel";
import RelatedAuctions from "./components/RelatedAuctions";

const AuctionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bids, setBids] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const fetchAuction = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAuctionById(id);
      setAuction(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load auction");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchBids = useCallback(async () => {
    try {
      const res = await getBids(id);
      setBids(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      setBids([]);
    }
  }, [id]);

  useEffect(() => {
    fetchAuction();
    fetchBids();
  }, [fetchAuction, fetchBids]);

  const handleIncomingBid = useCallback((newBid) => {
    if (!newBid) return;
    setIsSocketConnected(true);
    
    setBids((prev) => {
      const newBidId = newBid?._id;
      if (newBidId && prev.some((bid) => bid?._id === newBidId)) return prev;
      return [newBid, ...prev];
    });

    const newAmount = Number(newBid?.amount ?? newBid?.bidAmount);
    if (!Number.isNaN(newAmount)) {
      setAuction(prev => prev ? { ...prev, currentHighestBid: Math.max(prev.currentHighestBid || 0, newAmount) } : prev);
    }
  }, []);

  useSocket(id, handleIncomingBid);

  const handlePlaceBid = async (amount) => {
    try {
      const res = await placeBid(id, amount);
      if (res.data.success) {
        await Promise.all([fetchAuction(), fetchBids()]);
      }
    } catch (err) {
      console.error("Bid error:", err);
    }
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

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-[#0E0B0D] p-8">
        <div className="max-w-xl mx-auto bg-[#1B1A1F] p-8 rounded-2xl border border-red-500/20 text-center">
          <h2 className="text-2xl font-black text-white mb-4">Error Loading Auction</h2>
          <p className="text-white/60 mb-8">{error || "Auction not found"}</p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="bg-[#B2546A] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-[#D8A9B0] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0B0D] text-white pb-20 selection:bg-[#B2546A] selection:text-white">
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-[#B2546A]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-[#D8A9B0]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 relative z-10">
        {/* Navigation / Header Area */}
        <div className="flex items-center justify-between mb-12">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 text-white/40 hover:text-white transition-colors uppercase font-black text-[10px] tracking-[0.3em]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Dashboard
          </motion.button>
          
          <div className="flex items-center gap-8">
             <div className="hidden md:flex gap-12 font-black uppercase text-[10px] tracking-[0.3em] text-white/40">
                <span className="cursor-pointer hover:text-[#B2546A] transition-colors">Details</span>
                <span className="cursor-pointer hover:text-[#B2546A] transition-colors">Bids</span>
                <span className="cursor-pointer hover:text-[#B2546A] transition-colors">History</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: VISUALS (7/12) */}
          <div className="lg:col-span-7 space-y-12">
            <ImageGallery images={auction.images} title={auction.title} />
            
            <div className="hidden lg:block">
              <BidHistory bids={bids} />
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIONS & INFO (5/12) */}
          <div className="lg:col-span-5 space-y-8">
            <AuctionInfoCard auction={auction} />
            
            <BidPanel 
              auction={auction} 
              user={user} 
              currentHighest={auction.currentHighestBid || auction.startingPrice}
              isAuctionEnded={new Date(auction.endTime) < new Date()}
              onBidPlaced={handlePlaceBid}
              isSocketConnected={isSocketConnected}
            />

            <SellerCard seller={auction.seller} />

            <div className="block lg:hidden">
              <BidHistory bids={bids} />
            </div>

            {! (new Date(auction.endTime) < new Date()) && (
              <ChatPanel auctionId={id} user={user} />
            )}
          </div>
        </div>

        {/* Related Auctions */}
        <RelatedAuctions />

        {/* Winner Section for current user */}
        <AnimatePresence>
          {new Date(auction.endTime) < new Date() && user && auction.winner && 
           (String(auction.winner?._id || auction.winner) === String(user?._id || user?.id)) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 bg-gradient-to-r from-[#B2546A] to-[#D8A9B0] p-1 rounded-2xl shadow-[0_0_50px_rgba(178,84,106,0.4)]"
            >
              <div className="bg-[#1B1A1F] rounded-2xl p-8 text-center space-y-6">
                <h2 className="text-4xl font-black uppercase tracking-tighter">You Won This Auction!</h2>
                <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Final Bid: ₹{auction.currentHighestBid?.toLocaleString()}</p>
                <button
                  onClick={() => navigate(`/payment/${auction._id}`)}
                  className="bg-white text-black px-12 py-5 rounded-xl font-black uppercase tracking-widest hover:bg-[#B2546A] hover:text-white transition-all shadow-xl"
                >
                  Proceed to Payment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuctionDetails;