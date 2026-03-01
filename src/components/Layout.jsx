import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900">Auction Hub</h3>
              </div>
              <p className="text-gray-600 text-sm">A modern platform for buying and selling through auctions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Auctions</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/dashboard" className="hover:text-blue-600 transition">Browse</a></li>
                <li><a href="/create-auction" className="hover:text-blue-600 transition">Create</a></li>
                <li><a href="/" className="hover:text-blue-600 transition">How it Works</a></li>
              </ul>
            </div>
            {/* <div>
              <h4 className="font-semibold text-gray-900 mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/login" className="hover:text-blue-600 transition">Login</a></li>
                <li><a href="/register" className="hover:text-blue-600 transition">Register</a></li>
              </ul>
            </div> */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
              <p className="text-sm text-gray-600">Email: support@auctionhub.com</p>
              <p className="text-sm text-gray-600">Phone: +91-9876543210</p>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 Auction Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
