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
    <nav className="bg-white border-b border-gray-100 shadow-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => navigate("/")}
          >
            <svg className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
              Auction Hub
            </h2>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 transition font-medium text-sm"
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-blue-600 transition font-medium text-sm"
            >
              Browse Auctions
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/create-auction" 
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 px-4 py-2 rounded-lg transition font-semibold text-sm shadow-sm hover:shadow-md"
                >
                  + Create Auction
                </Link>
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <NotificationDropdown />
                  <span className="text-gray-700 font-medium">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 font-medium text-sm transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 px-4 py-2 rounded-lg transition font-semibold text-sm shadow-sm hover:shadow-md"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden focus:outline-none text-gray-700"
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
          <div className="md:hidden py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition font-medium"
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition font-medium"
              >
                Browse Auctions
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/notifications" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notifications
                  </Link>
                  <Link 
                    to="/create-auction" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 px-4 py-2 rounded transition font-semibold"
                  >
                    + Create Auction
                  </Link>
                  <div className="px-4 py-2 font-medium text-gray-700 border-t border-gray-200 mt-2">
                    {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 px-4 py-2 text-left font-medium transition"
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
                    className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition font-medium text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 px-4 py-2 rounded transition font-semibold"
                  >
                    Register
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
