import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.js";
import NotificationDropdown from "./notificationDropdown.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#0E0B0D]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <svg className="w-8 h-8 text-[#B2546A] group-hover:text-[#D8A9B0] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-black text-white group-hover:text-[#D8A9B0] transition-colors tracking-tighter">
              TOKEN
            </h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-white/60 hover:text-white transition font-bold text-[10px] uppercase tracking-[0.2em]"
            >
              Explore
            </Link>
            <Link
              to="/dashboard"
              className="text-white/60 hover:text-white transition font-bold text-[10px] uppercase tracking-[0.2em]"
            >
              Auctions
            </Link>
            <Link
              to="/categories"
              className="text-white/60 hover:text-white transition font-bold text-[10px] uppercase tracking-[0.2em]"
            >
              Categories
            </Link>
            <Link
              to="/search"
              className="text-white/60 hover:text-white transition font-bold text-[10px] uppercase tracking-[0.2em]"
            >
              Search
            </Link>
            {user && (
              <>
                <Link
                  to="/wishlist"
                  className="text-white/60 hover:text-white transition font-bold text-[10px] uppercase tracking-[0.2em]"
                >
                  Wishlist
                </Link>
                <Link
                  to="/chat"
                  className="text-white/60 hover:text-white transition font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Messages
                </Link>
              </>
            )}

            {user ? (
              <>
                <Link
                  to="/create-auction"
                  className="bg-gradient-to-r from-[#B2546A] to-[#D8A9B0] text-white px-6 py-2 rounded-xl transition font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#B2546A]/20"
                >
                  Create
                </Link>
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <NotificationDropdown />
                  <div className="relative group">
                    <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:text-[#B2546A] transition-colors">
                      {user.name}
                    </span>
                    <div className="absolute right-0 mt-4 w-52 bg-[#1B1A1F] border border-white/5 rounded-xl shadow-2xl py-3 hidden group-hover:block backdrop-blur-3xl">
                      <Link
                        to="/activity"
                        className="block px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Activity
                      </Link>
                      <Link
                        to="/reviews"
                        className="block px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Reviews
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-[#B2546A]/60 hover:text-[#B2546A] font-black text-[10px] uppercase tracking-[0.2em] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* <button
                  onClick={() => navigate("/login")}
                  className="text-white/60 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-colors"
                >
                  Login
                </button> */}
                <button
                  onClick={() => navigate("/register")}
                  className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-6 py-2.5 rounded-xl transition font-black text-[10px] uppercase tracking-[0.2em]"
                >
                  Join
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden focus:outline-none text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/5 bg-[#0E0B0D]">
            <div className="flex flex-col space-y-4 px-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/60 hover:text-white px-4 py-2 rounded transition font-bold text-[10px] uppercase tracking-[0.2em]"
              >
                Explore
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/60 hover:text-white px-4 py-2 rounded transition font-bold text-[10px] uppercase tracking-[0.2em]"
              >
                Auctions
              </Link>
              <Link
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/60 hover:text-white px-4 py-2 rounded transition font-bold text-[10px] uppercase tracking-[0.2em]"
              >
                Categories
              </Link>
              <Link
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/60 hover:text-white px-4 py-2 rounded transition font-bold text-[10px] uppercase tracking-[0.2em]"
              >
                Search
              </Link>

              {user && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white/60 hover:text-white px-4 py-2 rounded transition font-bold text-[10px] uppercase tracking-[0.2em]"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/chat"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white/60 hover:text-white px-4 py-2 rounded transition font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Messages
                  </Link>
                </>
              )}

              {user ? (
                <>
                  <Link
                    to="/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white/60 hover:text-white px-4 py-2 rounded transition font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notifications
                  </Link>
                  <Link
                    to="/create-auction"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-[#B2546A] to-[#D8A9B0] text-white px-6 py-3 rounded-xl transition font-black text-[10px] uppercase tracking-[0.2em] text-center"
                  >
                    Create
                  </Link>
                  <div className="px-4 py-2 font-black text-white/40 text-[10px] uppercase tracking-[0.2em] border-t border-white/5 mt-2">
                    {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-[#B2546A]/60 hover:text-[#B2546A] px-4 py-2 text-left font-black text-[10px] uppercase tracking-[0.2em] transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="text-white/60 hover:text-white px-4 py-2 rounded transition font-bold text-[10px] uppercase tracking-[0.2em] text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-6 py-3 rounded-xl transition font-black text-[10px] uppercase tracking-[0.2em]"
                  >
                    Join
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
