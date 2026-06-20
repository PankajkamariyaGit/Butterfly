"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919876543210"; // +91 98765 43210
const DEFAULT_MESSAGE = "Hi! I'm interested in your jewellery collection. Can you help me?";

const QUICK_MESSAGES = [
  "I want to know about your bridal collection",
  "What are your bestselling necklaces?",
  "Do you offer customisation?",
  "What's the shipping time to my city?",
  "I need help tracking my order",
];

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const sendMessage = (msg?: string) => {
    const text = encodeURIComponent(msg || message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#25D366] px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-lg">🦋</div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Butterfly Jewellery</p>
                <p className="text-white/80 text-xs">Typically replies instantly</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Chat bubble */}
            <div className="bg-[#ECE5DD] px-4 py-4">
              <div className="bg-white rounded-lg rounded-tl-none p-3 text-sm text-gray-700 shadow-sm max-w-[90%]">
                <p>👋 Hello! Welcome to Butterfly Jewellery.</p>
                <p className="mt-1">How can we help you today?</p>
                <p className="text-[10px] text-gray-400 mt-2 text-right">10:00 AM ✓✓</p>
              </div>
            </div>

            {/* Quick replies */}
            <div className="bg-white px-4 py-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Quick Messages</p>
              <div className="space-y-1.5 mb-3">
                {QUICK_MESSAGES.map((msg) => (
                  <button
                    key={msg}
                    onClick={() => sendMessage(msg)}
                    className="w-full text-left text-xs text-[#25D366] border border-[#25D366]/30 rounded-full px-3 py-1.5 hover:bg-[#25D366]/5 transition-colors"
                  >
                    {msg}
                  </button>
                ))}
              </div>

              {/* Custom message */}
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  className="flex-1 border border-gray-200 rounded-full text-xs px-3 py-2 focus:outline-none focus:border-[#25D366] text-gray-700"
                  placeholder="Type a message..."
                />
                <button
                  onClick={() => sendMessage()}
                  className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:bg-[#20BA5A] transition-colors flex-shrink-0"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-green-400/40 flex items-center justify-center text-white relative"
        aria-label="Chat on WhatsApp"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </motion.button>
    </div>
  );
}
