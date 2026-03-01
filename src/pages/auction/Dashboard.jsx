import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getAuctions } from "../../services/auctionservice.js";
import AuctionCard from "../../components/AuctionCard.jsx";
import useAuth from "../../hooks/useAuth";

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
      if (showLoading) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError("");
      const res = await getAuctions();
      setAuctions(res.data.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load auctions");
      console.error("Error fetching auctions:", err);
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
    if (!socketUrl) {
      setRealtimeStatus("disconnected");
      return undefined;
    }

    const socket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true
    });

    setRealtimeStatus("connecting");

    socket.on("connect", () => setRealtimeStatus("connected"));
    socket.on("disconnect", () => setRealtimeStatus("disconnected"));
    socket.on("connect_error", () => setRealtimeStatus("disconnected"));

    const handleAuctionEvent = () => {
      if (!pauseRef.current) {
        fetchAuctions(false);
      }
    };

    socket.on("auctionCreated", handleAuctionEvent);
    socket.on("auctionUpdated", handleAuctionEvent);
    socket.on("bidPlaced", handleAuctionEvent);
    socket.on("auctionEnded", handleAuctionEvent);

    return () => {
      socket.off("auctionCreated", handleAuctionEvent);
      socket.off("auctionUpdated", handleAuctionEvent);
      socket.off("bidPlaced", handleAuctionEvent);
      socket.off("auctionEnded", handleAuctionEvent);
      socket.disconnect();
    };
  }, [fetchAuctions, socketUrl]);

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }
    const intervalId = setInterval(() => fetchAuctions(false), pollingIntervalMs);
    return () => clearInterval(intervalId);
  }, [fetchAuctions, isPaused, pollingIntervalMs]);

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (auction.description && auction.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === "active") {
      return matchesSearch && new Date(auction.endTime) > new Date();
    } else if (filterStatus === "ended") {
      return matchesSearch && new Date(auction.endTime) <= new Date();
    }
    return matchesSearch;
  });

  const totalCount = auctions.length;
  const activeCount = auctions.filter(auction => new Date(auction.endTime) > new Date()).length;
  const endedCount = totalCount - activeCount;
  const userId = user?._id || user?.id || user?.userId || user?.email;

  const getAuctionOwnerId = (auction) =>
    auction?.seller?._id ||
    auction?.sellerId ||
    auction?.owner?._id ||
    auction?.ownerId ||
    auction?.createdBy?._id ||
    auction?.createdBy ||
    auction?.userId ||
    auction?.createdById ||
    null;

  const hasOwnerInfo = auctions.some((auction) => getAuctionOwnerId(auction));
  const hasBidInfo = auctions.some(
    (auction) => Array.isArray(auction?.bids) || Array.isArray(auction?.bidHistory)
  );

  const myAuctions = userId
    ? auctions.filter((auction) => {
        const ownerId = getAuctionOwnerId(auction);
        return ownerId && String(ownerId) === String(userId);
      })
    : [];
  const myActiveAuctions = myAuctions.filter(
    (auction) => new Date(auction.endTime) > new Date()
  );
  const myEndedAuctions = myAuctions.length - myActiveAuctions.length;

  const myBidsCount = userId
    ? auctions.reduce((count, auction) => {
        const bids = auction?.bids || auction?.bidHistory || [];
        if (!Array.isArray(bids)) {
          return count;
        }
        const hasBid = bids.some((bid) => {
          const bidderId =
            bid?.bidder?._id ||
            bid?.bidder?.id ||
            bid?.bidderId ||
            bid?.userId ||
            bid?.email ||
            bid?.bidderEmail;
          return bidderId && String(bidderId) === String(userId);
        });
        return hasBid ? count + 1 : count;
      }, 0)
    : 0;

  const isLive = realtimeStatus === "connected" && !isPaused;
  const statusText = isPaused
    ? "Paused"
    : realtimeStatus === "connected"
    ? "Live"
    : "Reconnecting";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading auctions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-white border-r border-gray-200 fixed md:relative h-screen md:h-auto z-20`}>
          <div className="p-6">
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden mb-4 text-gray-700 hover:text-gray-900"
            >
              ✕
            </button>
            
            <h3 className="text-lg font-bold mb-6 text-gray-900">Categories</h3>
            
            <nav className="space-y-2 mb-8">
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                  filterStatus === "all" 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                All Auctions
              </button>
              <button
                onClick={() => {
                  setFilterStatus("active");
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                  filterStatus === "active" 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Active
              </button>
              <button
                onClick={() => {
                  setFilterStatus("ended");
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                  filterStatus === "ended" 
                    ? "bg-gray-100 text-gray-700 border border-gray-300" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ended
              </button>
            </nav>

            {user && (
              <button
                onClick={() => {
                  navigate("/create-auction");
                  setSidebarOpen(false);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Auction
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden text-gray-700 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div className="flex-1 relative">
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search auctions, titles, creators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
                <button
                  onClick={() => fetchAuctions(false)}
                  className="px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
                >
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-700">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="text-sm font-medium">{statusText}</span>
                </div>
                <button
                  onClick={() => setIsPaused((prev) => !prev)}
                  className="px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                {filteredAuctions.length > 0 && (
                  <span className="font-medium">{filteredAuctions.length} auction{filteredAuctions.length !== 1 ? 's' : ''} found</span>
                )}
                <span className="text-gray-500">
                  {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Updating..."}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {!user ? (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Guest Preview Mode</h3>
                    <p className="text-gray-600">Sign in to bid, save favorites, and create auctions.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/login"
                      className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-center"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Welcome back, {user.name}</h3>
                    <p className="text-gray-600">
                      Live auctions refresh every {pollingIntervalMs / 1000} seconds when needed.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/create-auction")}
                    className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                  >
                    Create Auction
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total Auctions</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Ended</p>
                <p className="text-2xl font-bold text-gray-600">{endedCount}</p>
              </div>
            </div>

            {user && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">My Activity</h3>
                  <button
                    onClick={() => fetchAuctions(false)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Refresh activity
                  </button>
                </div>

                {hasOwnerInfo || hasBidInfo ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border border-gray-100 rounded-xl p-4">
                      <p className="text-sm text-gray-500">My Active Auctions</p>
                      <p className="text-2xl font-bold text-green-600">{myActiveAuctions.length}</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4">
                      <p className="text-sm text-gray-500">My Ended Auctions</p>
                      <p className="text-2xl font-bold text-gray-700">{myEndedAuctions}</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Auctions I Bid On</p>
                      <p className="text-2xl font-bold text-blue-600">{myBidsCount}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    Your activity will appear here once the backend provides auction ownership and bid data.
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="alert-error mb-6">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {filteredAuctions.length === 0 ? (
              <div className="text-center py-16">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {searchTerm ? "No auctions match your search" : "No auctions available"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? "Try different search terms or remove filters" 
                    : "Be the first to create an auction!"}
                </p>
                {user && !searchTerm && (
                  <button
                    onClick={() => navigate("/create-auction")}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-semibold inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Auction
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {filterStatus === "active" ? "Active Auctions" : filterStatus === "ended" ? "Ended Auctions" : "All Auctions"}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {filterStatus === "active" 
                      ? "Currently active auctions you can bid on" 
                      : filterStatus === "ended" 
                      ? "Auctions that have ended" 
                      : "Browse all auctions"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredAuctions.map(auction => (
                    <AuctionCard key={auction._id} auction={auction} />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;