import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.js";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:py-32">
        <div className="text-center mb-20">
          {user ? (
            <>
              <div className="mb-6">
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">Welcome Back</p>
                <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
                  Hello, {user.name}! 👋
                </h1>
                <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Ready to explore new auctions or list your own items?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Browse Auctions
                </button>
                <button
                  onClick={() => navigate("/create-auction")}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Create Auction
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-6xl sm:text-7xl font-bold text-gray-900 mb-6">
                  Welcome to Auction Hub
                </h1>
                <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
                  Your premier destination for online auctions. Buy, sell, and bid on unique items from around the world.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Register Now
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-xl mb-6 mx-auto">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 text-center">Real-Time Bidding</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Place bids in real-time and compete with other bidders to win amazing items from around the world.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl mb-6 mx-auto">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 text-center">Secure Transactions</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Your data is protected with industry-standard security measures and encrypted transactions.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl mb-6 mx-auto">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 text-center">Wide Selection</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Discover thousands of unique items across various categories curated for quality.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-16 text-center text-white shadow-xl">
            <h2 className="text-5xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-10 opacity-95">Join thousands of users already bidding and selling on Auction Hub</p>
            <Link
              to="/dashboard"
              className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl hover:bg-gray-50 font-semibold text-lg transition shadow-lg hover:shadow-xl"
            >
              Explore Auctions →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
