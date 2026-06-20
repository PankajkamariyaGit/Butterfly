"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, Sparkles, Star, ArrowRight, Gift, Zap, Heart, ShoppingBag } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

const TIERS = [
  {
    name: "Silver",
    icon: "◇",
    color: "from-slate-300/30 to-slate-100",
    borderColor: "border-slate-300/50",
    textColor: "text-slate-600",
    requirement: "All members",
    points: "1 point / ₹100 spent",
    benefits: ["Early access (24hrs)", "Birthday discount 10%", "Free shipping above ₹799", "Monthly newsletter"],
  },
  {
    name: "Gold",
    icon: "◆",
    color: "from-champagne/30 to-ivory",
    borderColor: "border-champagne",
    textColor: "text-champagne-dark",
    requirement: "₹10,000+ spent",
    points: "1.5 points / ₹100 spent",
    badge: "Most Popular",
    benefits: ["Early access (48hrs)", "Birthday discount 15%", "Free shipping on all orders", "Exclusive Gold collections", "Priority customer care", "Quarterly gift"],
  },
  {
    name: "Privé",
    icon: "✦",
    color: "from-obsidian to-mink",
    borderColor: "border-champagne/60",
    textColor: "text-champagne",
    dark: true,
    requirement: "₹25,000+ spent",
    points: "2 points / ₹100 spent",
    benefits: ["First access (72hrs)", "Birthday gift up to ₹1,000", "Free express shipping", "Exclusive Privé collections", "Personal stylist", "Bi-monthly gift", "Private shopping event invites", "Annual luxury hamper"],
  },
];

const PERKS = [
  { icon: Zap, label: "Early Access", desc: "Shop new drops before anyone else. Exclusivity is your right." },
  { icon: Star, label: "Loyalty Points", desc: "Every purchase earns points. Redeem for discounts anytime." },
  { icon: Gift, label: "Birthday Rewards", desc: "An exclusive gift every birthday — because you deserve to celebrate." },
  { icon: Heart, label: "VIP Discounts", desc: "Tiered discounts up to 20% on every single purchase." },
  { icon: Crown, label: "Private Events", desc: "Invitation-only shopping events, trunk shows, and previews." },
  { icon: ShoppingBag, label: "Seasonal Hampers", desc: "Curated luxury hampers during Diwali, New Year & more." },
];

const DEMO_POINTS = [
  { label: "Butterfly Royale Bridal Necklace Set", date: "15 Jun 2026", points: "+40 pts", type: "earned" },
  { label: "Birthday Bonus", date: "1 Jun 2026", points: "+150 pts", type: "bonus" },
  { label: "Golden Bloom Statement Earrings", date: "12 May 2026", points: "+12 pts", type: "earned" },
  { label: "Redeemed for ₹200 off", date: "10 May 2026", points: "-100 pts", type: "redeemed" },
];

export default function PriveClubPage() {
  const [joinForm, setJoinForm] = useState({ name: "", email: "", phone: "" });
  const [joined, setJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<"benefits" | "tiers" | "dashboard">("benefits");
  const { isAuthenticated, user } = useAuthStore();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setJoined(true);
    toast.success("Welcome to Butterfly Privé Club! 🎉", {
      style: { background: "#FDFBF7", color: "#1A1409", border: "1px solid #C9A84C" },
    });
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="relative min-h-[70vh] overflow-hidden flex items-center bg-gradient-to-br from-obsidian via-mink to-obsidian">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute text-champagne text-6xl" style={{ top: `${(i % 5) * 22}%`, left: `${(i % 4) * 28}%`, transform: "rotate(20deg)" }}>✦</div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-full bg-champagne/20 border border-champagne/40 flex items-center justify-center"><Crown size={12} className="text-champagne" /></div>
                <span className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase">Members Only</span>
              </div>
              <h1 className="font-display text-6xl sm:text-7xl text-ivory leading-[0.9]">
                Butterfly<br /><em className="text-champagne">Privé</em><br />Club
              </h1>
              <p className="mt-6 font-body text-ivory/55 text-base leading-relaxed max-w-md">
                An exclusive circle for women who love the finest things. Earn points, unlock privileges, and experience jewellery shopping reimagined.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#join" className="px-7 py-4 bg-gradient-to-r from-champagne to-champagne-dark text-white font-body text-sm tracking-[0.15em] uppercase rounded-full hover:shadow-luxury-xl transition-shadow flex items-center gap-2">
                  <Crown size={14} /> Join Privé Club
                </a>
                <button onClick={() => setActiveTab("tiers")} className="px-7 py-4 border border-champagne/40 text-champagne font-body text-sm tracking-[0.15em] uppercase rounded-full hover:bg-champagne/10 transition-colors">
                  View Tiers
                </button>
              </div>
              {/* Trust stats */}
              <div className="mt-10 flex gap-8">
                {[{ v: "12K+", l: "Members" }, { v: "₹50L+", l: "Rewards Given" }, { v: "4.9★", l: "Member Rating" }].map((s) => (
                  <div key={s.l}>
                    <p className="font-display text-2xl text-champagne">{s.v}</p>
                    <p className="text-[9px] font-body text-ivory/40 tracking-[0.2em] uppercase">{s.l}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Tier cards mini preview */}
            <motion.div className="hidden lg:flex flex-col gap-3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
              {TIERS.map((tier, i) => (
                <motion.div key={tier.name} className={`rounded-2xl p-4 bg-gradient-to-r ${tier.color} border ${tier.borderColor} flex items-center gap-4`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                  <span className={`text-3xl ${tier.textColor}`}>{tier.icon}</span>
                  <div className="flex-1">
                    <p className={`font-display text-lg ${tier.dark ? "text-champagne" : "text-obsidian"}`}>{tier.name}</p>
                    <p className={`font-body text-[10px] ${tier.dark ? "text-ivory/50" : "text-mink-light"}`}>{tier.requirement}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-body text-xs ${tier.dark ? "text-champagne/70" : "text-champagne"}`}>{tier.benefits.length} benefits</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-50 bg-ivory/90 backdrop-blur-xl border-b border-champagne/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex">
            {(["benefits", "tiers", "dashboard"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-body text-xs tracking-[0.2em] uppercase transition-colors relative ${activeTab === tab ? "text-champagne" : "text-mink-light hover:text-champagne"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && <motion.div layoutId="prive-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-champagne" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "benefits" && (
          <motion.section key="benefits" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-20 bg-pearl">
            <div className="max-w-7xl mx-auto px-6 sm:px-10">
              <div className="text-center mb-12">
                <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Why Join</p>
                <h2 className="font-display text-4xl sm:text-5xl text-obsidian">Exclusive Member Privileges</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {PERKS.map(({ icon: Icon, label, desc }, i) => (
                  <motion.div key={label} className="bg-white border border-champagne/10 rounded-2xl p-6 hover:shadow-luxury transition-all hover:-translate-y-1 duration-300" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center mb-4">
                      <Icon size={18} className="text-champagne" />
                    </div>
                    <h3 className="font-body text-sm font-semibold text-obsidian mb-2">{label}</h3>
                    <p className="font-body text-xs text-mink-light leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === "tiers" && (
          <motion.section key="tiers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-20 bg-ivory">
            <div className="max-w-7xl mx-auto px-6 sm:px-10">
              <div className="text-center mb-12">
                <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Membership Tiers</p>
                <h2 className="font-display text-4xl sm:text-5xl text-obsidian">Your Path to Privé</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {TIERS.map((tier, i) => (
                  <motion.div key={tier.name} className={`rounded-3xl overflow-hidden border-2 ${tier.borderColor} ${tier.name === "Privé" ? "shadow-luxury-xl" : ""}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                    <div className={`bg-gradient-to-br ${tier.color} p-6`}>
                      {tier.badge && <div className="inline-block px-3 py-1 bg-champagne text-white text-[9px] font-body tracking-[0.2em] uppercase rounded-full mb-3">{tier.badge}</div>}
                      <span className={`text-5xl ${tier.textColor}`}>{tier.icon}</span>
                      <h3 className={`font-display text-3xl mt-2 ${tier.dark ? "text-champagne" : "text-obsidian"}`}>{tier.name}</h3>
                      <p className={`font-body text-xs mt-1 ${tier.dark ? "text-ivory/55" : "text-mink-light"}`}>{tier.requirement}</p>
                      <p className={`font-body text-[10px] mt-2 ${tier.dark ? "text-champagne/70" : "text-champagne"} tracking-wide`}>{tier.points}</p>
                    </div>
                    <div className={`p-6 ${tier.dark ? "bg-obsidian" : "bg-white"}`}>
                      <ul className="space-y-2.5">
                        {tier.benefits.map((b) => (
                          <li key={b} className={`flex items-center gap-2 text-xs font-body ${tier.dark ? "text-ivory/70" : "text-mink-light"}`}>
                            <Check size={11} className="text-champagne flex-shrink-0" />{b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === "dashboard" && (
          <motion.section key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-20 bg-pearl">
            <div className="max-w-4xl mx-auto px-6 sm:px-10">
              {isAuthenticated ? (
                <div className="space-y-6">
                  {/* Member card */}
                  <div className="bg-gradient-to-br from-obsidian via-mink to-obsidian rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-champagne/10 blur-2xl" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="font-body text-[9px] text-champagne/60 tracking-[0.3em] uppercase">BUTTERFLY PRIVÉ</p>
                          <p className="font-display text-2xl text-ivory mt-1">{user?.name}</p>
                          <p className="font-body text-xs text-ivory/40 mt-0.5">{user?.email}</p>
                        </div>
                        <Crown size={32} className="text-champagne/40" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                        {[{ v: "Gold", l: "Tier" }, { v: "462", l: "Points" }, { v: "₹500", l: "Next Reward" }].map((s) => (
                          <div key={s.l}>
                            <p className="font-display text-xl text-champagne">{s.v}</p>
                            <p className="font-body text-[9px] text-ivory/40 tracking-[0.2em] uppercase">{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Points history */}
                  <div className="bg-white rounded-2xl border border-champagne/10 overflow-hidden">
                    <div className="px-6 py-4 border-b border-champagne/10 flex items-center justify-between">
                      <h3 className="font-body text-sm font-semibold text-obsidian">Points Activity</h3>
                      <span className="text-[10px] font-body text-champagne tracking-wider uppercase">462 pts balance</span>
                    </div>
                    <div className="divide-y divide-champagne/5">
                      {DEMO_POINTS.map((pt, i) => (
                        <div key={i} className="flex items-center justify-between px-6 py-4">
                          <div>
                            <p className="font-body text-xs font-medium text-obsidian">{pt.label}</p>
                            <p className="font-body text-[10px] text-mink-light/60 mt-0.5">{pt.date}</p>
                          </div>
                          <span className={`font-body text-sm font-semibold ${pt.type === "redeemed" ? "text-rose-500" : "text-green-600"}`}>{pt.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Crown size={48} className="text-champagne/30 mx-auto mb-4" />
                  <h3 className="font-display text-2xl text-obsidian mb-2">Sign in to view your membership</h3>
                  <Link href="/auth/login?redirect=/prive-club" className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-champagne text-white font-body text-sm tracking-wider uppercase rounded-full">Sign In <ArrowRight size={14} /></Link>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Join Form */}
      <section id="join" className="py-20 bg-gradient-to-br from-obsidian to-mink">
        <div className="max-w-xl mx-auto px-6 sm:px-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-5"><Sparkles size={16} className="text-champagne" /><span className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase">Free to Join</span></div>
          <h2 className="font-display text-4xl sm:text-5xl text-ivory">Become a Member</h2>
          <p className="mt-3 font-body text-ivory/55 text-sm">Join Butterfly Privé for free. Start earning points on your first purchase.</p>
          {!joined ? (
            <form onSubmit={handleJoin} className="mt-8 space-y-3">
              <input value={joinForm.name} onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })} required placeholder="Your full name" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-body text-ivory placeholder-ivory/35 focus:outline-none focus:border-champagne/50" />
              <input type="email" value={joinForm.email} onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })} required placeholder="Email address" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-body text-ivory placeholder-ivory/35 focus:outline-none focus:border-champagne/50" />
              <input value={joinForm.phone} onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })} placeholder="Phone number (optional)" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-body text-ivory placeholder-ivory/35 focus:outline-none focus:border-champagne/50" />
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-champagne to-champagne-dark text-white font-body text-sm tracking-[0.15em] uppercase rounded-full hover:shadow-luxury-xl transition-shadow flex items-center justify-center gap-2">
                <Crown size={15} /> Join Butterfly Privé — It&apos;s Free
              </button>
              <p className="text-[10px] font-body text-ivory/30">No subscription fee. No credit card required. Just pure luxury.</p>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 py-10">
              <div className="w-20 h-20 rounded-full bg-champagne/20 border border-champagne/40 flex items-center justify-center mx-auto mb-5">
                <Crown size={32} className="text-champagne" />
              </div>
              <h3 className="font-display text-3xl text-ivory mb-3">Welcome to Privé! ✦</h3>
              <p className="font-body text-ivory/55 text-sm">You&apos;re now a Silver member. Start shopping to earn points and unlock Gold status.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
