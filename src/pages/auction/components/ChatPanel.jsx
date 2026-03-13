import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPanel = ({ auctionId, user }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Welcome to the live auction chat!', type: 'system' },
    { id: 2, sender: 'Alex', text: 'Beautiful piece, good luck everyone!', type: 'user' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: user?.name || 'You',
      text: newMessage,
      type: 'user'
    }]);
    setNewMessage('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#1B1A1F] border border-[#B2546A]/20 rounded-2xl flex flex-col h-[500px] shadow-xl overflow-hidden"
    >
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="text-white font-bold uppercase tracking-widest text-[10px]">Live Chat</h3>
        </div>
        <span className="text-white/40 text-[10px] uppercase font-bold tracking-tight">24 Online</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex flex-col ${msg.type === 'system' ? 'items-center' : (msg.sender === (user?.name || 'You') ? 'items-end' : 'items-start')}`}
            >
              {msg.type === 'system' ? (
                <span className="text-[10px] font-bold text-[#B2546A]/60 uppercase tracking-widest bg-[#B2546A]/5 px-3 py-1 rounded-full border border-[#B2546A]/10">
                  {msg.text}
                </span>
              ) : (
                <div className={`max-w-[85%] space-y-1 ${msg.sender === (user?.name || 'You') ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter px-2">
                    {msg.sender}
                  </span>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === (user?.name || 'You') 
                      ? 'bg-gradient-to-br from-[#B2546A] to-[#D8A9B0] text-white rounded-tr-none shadow-lg shadow-[#B2546A]/10' 
                      : 'bg-white/5 text-white/80 rounded-tl-none border border-white/10'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white/[0.02] border-t border-white/5">
        <div className="relative group">
          <input
            type="text"
            placeholder="Send a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#B2546A] transition-all pr-12"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#B2546A] hover:text-[#D8A9B0] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatPanel;
