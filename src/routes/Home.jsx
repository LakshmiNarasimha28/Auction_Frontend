import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.js";
import { motion } from "framer-motion";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#0E0B0D] text-white overflow-hidden selection:bg-[#B2546A] selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="bg-blob w-[50%] h-[50%] top-[-10%] left-[-10%] bg-[#B2546A]/20" />
        <div className="bg-blob w-[40%] h-[40%] bottom-[-10%] right-[-10%] bg-[#D8A9B0]/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(178,84,106,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-32">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-32"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-block mb-6">
            <span className="nft-badge nft-badge-active">
              The Future of Digital Ownership
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-7xl sm:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.9]"
          >
            Bid. Win. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B2546A] to-[#D8A9B0]">Collect.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-white/40 text-lg sm:text-xl font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto mb-12"
          >
            Enter the premier destination for high-stakes digital auctions and unique collectibles.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-premium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Explore Dashboard
                </button>
                <button
                  onClick={() => navigate("/create-auction")}
                  className="btn-outline-premium"
                >
                  List Masterpiece
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-premium">
                  Get Started
                </Link>
                <Link to="/register" className="btn-outline-premium">
                  Join Gallery
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="nft-card group">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#B2546A]/20 group-hover:border-[#B2546A]/40 transition-all duration-500">
              <svg className="w-8 h-8 text-[#B2546A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-[#D8A9B0] transition-colors">Real-Time Sync</h3>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              Experience the adrenaline of live bidding with millisecond-perfect synchronization across the globe.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="nft-card group">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#B2546A]/20 group-hover:border-[#B2546A]/40 transition-all duration-500">
              <svg className="w-8 h-8 text-[#B2546A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-[#D8A9B0] transition-colors">Elite Security</h3>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              Your assets and identity are shielded by industry-leading encryption and verified auction integrity.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="nft-card group">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#B2546A]/20 group-hover:border-[#B2546A]/40 transition-all duration-500">
              <svg className="w-8 h-8 text-[#B2546A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-[#D8A9B0] transition-colors">Global Curation</h3>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              Access an exclusive catalog of rare physical and digital items curated by specialized experts.
            </p>
          </motion.div>
        </motion.div>

        {/* CTA Banner */}
        {!user && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-32 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#B2546A] to-[#D8A9B0] blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="bg-[#1B1A1F] border border-[#B2546A]/20 rounded-[3rem] p-16 text-center relative z-10 overflow-hidden">
               <motion.h2 
                className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-6"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
               >
                Ready to Join <br /> 
                the <span className="text-[#B2546A]">Elite?</span>
               </motion.h2>
               <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-sm mb-12">Thousands of masterpieces are waiting for their next owner.</p>
               <Link to="/register" className="btn-premium inline-flex mx-auto">
                 Create Your Account
               </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
