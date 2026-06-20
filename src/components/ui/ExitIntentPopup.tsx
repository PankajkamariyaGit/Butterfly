"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Zap } from "lucide-react";
import { useCartStore } from "@/store";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { items } = useCartStore();

  const trigger = useCallback(() => {
    if (dismissed) return;
    const seen = sessionStorage.getItem("butterfly-exit-shown");
    if (seen) return;
    setShow(true);
    sessionStorage.setItem("butterfly-exit-shown", "1");
  }, [dismissed]);

  useEffect(() => {
    // Desktop: mouse leaving the viewport top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) trigger();
    };
    // Mobile: visibility change (tab switch / close)
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") trigger();
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [trigger]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    // In production: call API to save email + send recovery sequence
    setTimeout(() => setShow(false), 2500);
  };

  const close = () => { setShow(false); setDismissed(true); };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartValue = items.reduce((sum, i) => sum + i.product.discountPrice * i.quantity, 0);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
            >
              <X size={14} />
            </button>

            {/* Banner */}
            <div className="relative h-28 bg-gradient-to-r from-[#7C3AED] via-[#FF3E7A] to-[#FFB800] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
              <div className="relative text-center text-white">
                <Gift size={28} className="mx-auto mb-1" />
                <p className="font-body text-xs tracking-[0.3em] uppercase opacity-80">Wait! Before You Go...</p>
              </div>
            </div>

            <div className="p-6">
              {!done ? (
                <>
                  <h2 className="font-display text-2xl text-obsidian text-center mb-1">
                    Get <span className="text-[#FF3E7A]">₹200 Off</span> Your Order
                  </h2>
                  {cartCount > 0 && (
                    <p className="text-center text-xs font-body text-mink-light mb-3">
                      You have {cartCount} item{cartCount > 1 ? "s" : ""} worth ₹{cartValue.toLocaleString()} waiting in your cart!
                    </p>
                  )}
                  <p className="text-center text-xs font-body text-mink-light mb-5">
                    Enter your email to get an exclusive <strong>₹200 discount code</strong> sent instantly. Valid for 24 hours only!
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      className="w-full border border-champagne/30 rounded-full px-4 py-3 text-sm font-body text-obsidian focus:outline-none focus:border-[#FF3E7A] transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 rounded-full bg-gradient-to-r from-[#FF3E7A] via-[#FFB800] to-[#FF3E7A] text-white font-body font-bold text-sm tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <Zap size={14} /> Claim My ₹200 Off
                    </button>
                  </form>

                  <div className="flex items-center justify-center gap-4 mt-4">
                    {["Free Delivery", "Easy Returns", "100% Genuine"].map((t) => (
                      <span key={t} className="text-[9px] font-body text-mink-light/60 tracking-wider">✓ {t}</span>
                    ))}
                  </div>

                  <button onClick={close} className="block w-full mt-3 text-[10px] font-body text-mink-light/40 text-center hover:text-mink-light transition-colors">
                    No thanks, I&apos;ll pay full price
                  </button>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <h3 className="font-display text-2xl text-obsidian mb-2">Check Your Inbox!</h3>
                  <p className="text-sm font-body text-mink-light">Your <strong>₹200 off coupon code</strong> has been sent to <strong>{email}</strong>. Use it at checkout!</p>
                  <p className="text-[10px] font-body text-mink-light/50 mt-3">Code: <code className="font-mono bg-champagne/10 px-2 py-0.5 rounded text-champagne font-bold">SAVE200</code></p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
