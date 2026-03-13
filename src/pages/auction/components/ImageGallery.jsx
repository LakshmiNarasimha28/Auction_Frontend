import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageGallery = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-square bg-[#1B1A1F] rounded-2xl border border-[#B2546A]/20">
        <div className="text-center text-[#D8A9B0]/40">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">No Images Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative aspect-square bg-[#1B1A1F] rounded-2xl border border-[#B2546A]/20 overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={images[selectedImage]}
            alt={title}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </AnimatePresence>
        
        {/* Subtle Overlay Glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0E0B0D]/40 to-transparent" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                selectedImage === index 
                  ? "border-[#B2546A] shadow-[0_0_15px_rgba(178,84,106,0.3)]" 
                  : "border-[#B2546A]/10 hover:border-[#B2546A]/40"
              }`}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${index + 1}`}
                className={`w-full h-full object-cover ${selectedImage === index ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
