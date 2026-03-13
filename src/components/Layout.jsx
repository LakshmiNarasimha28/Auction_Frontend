import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { motion } from "framer-motion";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0E0B0D] text-white flex flex-col relative overflow-hidden">
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#B2546A]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#D8A9B0]/5 rounded-full blur-[100px]" />
      </div>

      <Navbar />
      
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-[#1B1A1F]/80 backdrop-blur-xl border-t border-white/5 mt-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#B2546A] to-[#D8A9B0] rounded-xl flex items-center justify-center shadow-lg shadow-[#B2546A]/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Token</h3>
              </div>
              <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em] leading-loose">
                The world's most exclusive <br />
                digital auction house.
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Navigation</h4>
              <ul className="space-y-4">
                <li><a href="/dashboard" className="text-xs font-bold text-white/60 hover:text-[#B2546A] transition-colors uppercase tracking-widest">Marketplace</a></li>
                <li><a href="/create-auction" className="text-xs font-bold text-white/60 hover:text-[#B2546A] transition-colors uppercase tracking-widest">List Item</a></li>
                <li><a href="/categories" className="text-xs font-bold text-white/60 hover:text-[#B2546A] transition-colors uppercase tracking-widest">Categories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Community</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-xs font-bold text-white/60 hover:text-[#B2546A] transition-colors uppercase tracking-widest">Discord</a></li>
                <li><a href="#" className="text-xs font-bold text-white/60 hover:text-[#B2546A] transition-colors uppercase tracking-widest">Twitter</a></li>
                <li><a href="#" className="text-xs font-bold text-white/60 hover:text-[#B2546A] transition-colors uppercase tracking-widest">Instagram</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Join the Pulse</h4>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#B2546A] transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#B2546A] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              &copy; 2026 TOKEN DIGITAL ASSETS. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
