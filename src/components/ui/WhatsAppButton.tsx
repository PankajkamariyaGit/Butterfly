"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919833509027"; // Pankaj Kamariya
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
            className="bg-obsidian rounded-2xl shadow-2xl w-80 overflow-hidden border border-champagne/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0F0B08] to-[#1a1208] px-4 py-3 flex items-center gap-3 border-b border-champagne/15">
              <div className="w-10 h-10 rounded-full bg-champagne/15 border border-champagne/30 flex items-center justify-center text-white text-lg">🦋</div>
              <div className="flex-1">
                <p className="text-champagne font-body font-semibold text-sm tracking-wide">Butterfly Jewellery</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  <p className="text-ivory/50 text-[10px] font-body">Typically replies instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-ivory/40 hover:text-champagne transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Chat bubble */}
            <div className="bg-[#0c0a06] px-4 py-4">
              <div className="bg-[#1a1610] border border-champagne/10 rounded-lg rounded-tl-none p-3 text-sm shadow-sm max-w-[90%]">
                <p className="text-ivory/80 font-body text-xs">👋 Hello! Welcome to Butterfly Jewellery.</p>
                <p className="text-ivory/60 font-body text-xs mt-1">How can we help you today?</p>
                <p className="text-[10px] text-ivory/25 font-body mt-2 text-right">✓✓</p>
              </div>
            </div>

            {/* Quick replies */}
            <div className="bg-obsidian px-4 py-3 border-t border-champagne/10">
              <p className="text-[9px] text-champagne/60 font-body font-semibold uppercase tracking-[0.2em] mb-2">Quick Messages</p>
              <div className="space-y-1.5 mb-3">
                {QUICK_MESSAGES.map((msg) => (
                  <button
                    key={msg}
                    onClick={() => sendMessage(msg)}
                    className="w-full text-left text-[11px] font-body text-ivory/60 border border-champagne/20 rounded-full px-3 py-1.5 hover:border-champagne/60 hover:text-champagne transition-colors"
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
                  className="flex-1 bg-white/5 border border-champagne/20 rounded-full text-xs font-body px-3 py-2 focus:outline-none focus:border-champagne/50 text-ivory placeholder-ivory/30"
                  placeholder="Type a message..."
                />
                <button
                  onClick={() => sendMessage()}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-champagne to-[#b8922a] flex items-center justify-center text-white hover:opacity-90 transition-opacity flex-shrink-0"
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
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a1408] to-obsidian border border-champagne/50 shadow-[0_4px_24px_rgba(201,168,76,0.35)] flex items-center justify-center text-champagne relative"
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
        <span className="absolute inset-0 rounded-full bg-champagne animate-ping opacity-15" />
      </motion.button>
    </div>
  );
}
