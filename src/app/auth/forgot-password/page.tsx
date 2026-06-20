"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    toast.success("Reset link sent! Check your inbox.", {
      style: { background: "#FDFBF7", color: "#1A1409", border: "1px solid #C9A84C", fontFamily: "Jost, sans-serif" },
    });
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">Account Recovery</p>
          <h1 className="font-display text-4xl text-obsidian">Forgot Password</h1>
          <p className="font-body text-sm text-mink-light mt-3">Enter your registered email and we&apos;ll send you a reset link.</p>
        </div>

        <div className="bg-white border border-champagne/10 rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-champagne/10 flex items-center justify-center mx-auto mb-4">
                <Check size={22} className="text-champagne" />
              </div>
              <p className="font-display text-xl text-obsidian mb-2">Check Your Inbox</p>
              <p className="font-body text-sm text-mink-light mb-6">We&apos;ve sent a password reset link to <span className="text-champagne">{email}</span>. It expires in 30 minutes.</p>
              <Link href="/auth/login" className="font-body text-sm text-champagne hover:underline flex items-center gap-1 justify-center">
                Back to Sign In <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-body text-xs text-mink-light tracking-wider uppercase mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mink-light" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@email.com"
                    className="w-full pl-11 pr-4 py-3 border border-champagne/20 rounded-xl font-body text-sm text-obsidian bg-pearl focus:outline-none focus:border-champagne transition-colors"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-champagne to-champagne-dark text-white font-body text-sm tracking-[0.15em] uppercase rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Send Reset Link <ArrowRight size={15} />
              </button>
              <p className="text-center font-body text-xs text-mink-light">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-champagne hover:underline">Sign In</Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
