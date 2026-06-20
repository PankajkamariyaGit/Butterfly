"use client";

import Link from "next/link";
import { ButterflyLogo, ButterflyIcon } from "@/components/ui/ButterflyLogo";
import { Instagram, Facebook, Youtube, Twitter, Phone, Mail, MapPin, Shield, RotateCcw, Package, Truck, Star } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const FOOTER_LINKS = {
  Shop: [
    { label: "New Arrivals", href: "/products?filter=new" },
    { label: "Bridal Studio", href: "/bridal-studio" },
    { label: "Bestsellers", href: "/products?filter=bestseller" },
    { label: "Earrings", href: "/products?category=earrings" },
    { label: "Necklaces", href: "/products?category=necklaces" },
    { label: "Virtual Try-On", href: "/virtual-try-on" },
  ],
  Experiences: [
    { label: "Butterfly Privé Club", href: "/prive-club" },
    { label: "Gifting Experience", href: "/gifting" },
    { label: "WhatsApp Support", href: "https://wa.me/919876543210" },
    { label: "Bridal Consultation", href: "/bridal-studio#appointment" },
    { label: "Track Order", href: "/track-order" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  Help: [
    { label: "FAQs", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Return & Refund", href: "/return-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "About Butterfly", href: "/about" },
  ],
};

const TRUST_BADGES = [
  { icon: Shield, label: "100% Secure Payments" },
  { icon: Package, label: "COD Available" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Truck, label: "Premium Packaging" },
  { icon: Star, label: "Trusted by Thousands" },
];

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success("Welcome to the Butterfly Inner Circle! ✦", {
      style: { background: "#FDFBF7", color: "#1A1409", border: "1px solid #C9A84C", fontFamily: "Jost, sans-serif" },
    });
  };

  return (
    <footer className="bg-obsidian text-ivory/80">
      {/* Trust Badges */}
      <div className="border-b border-champagne/10 bg-obsidian/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={14} className="text-champagne/70" />
                <span className="text-[10px] font-body text-ivory/50 tracking-[0.15em] uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-champagne/10 relative overflow-hidden">
        <motion.div className="absolute right-10 top-0 bottom-0 opacity-[0.03] flex items-center" animate={{ rotate: [0, 360] }} transition={{ duration: 180, repeat: Infinity, ease: "linear" }}>
          <ButterflyIcon size={300} />
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Inner Circle</p>
              <h3 className="font-display text-4xl text-ivory leading-tight">Stay in the<br /><em className="text-champagne">Butterfly</em> Loop</h3>
              <p className="mt-3 font-body text-ivory/40 text-sm leading-relaxed max-w-sm">Join 12,000+ subscribers. Early access, exclusive offers, and styling inspiration — no spam, only beauty.</p>
            </div>
            <div>
              {subscribed ? (
                <div className="flex items-center gap-3 p-5 border border-champagne/30 rounded-2xl">
                  <ButterflyIcon size={28} />
                  <p className="font-display text-lg text-champagne">Welcome to the family! ✦</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" required className="flex-1 bg-white/5 border border-white/15 text-ivory placeholder-ivory/30 rounded-full px-5 py-3 font-body text-sm focus:outline-none focus:border-champagne/50 transition-colors" />
                  <button type="submit" className="px-7 py-3 bg-gradient-to-r from-champagne to-champagne-dark text-white font-body text-sm tracking-[0.12em] uppercase rounded-full hover:shadow-luxury transition-shadow whitespace-nowrap">Subscribe</button>
                </form>
              )}
              <div className="flex flex-wrap gap-4 mt-4">
                {["New Collections", "Exclusive Offers", "Styling Tips", "Bridal Guides"].map((tag) => (
                  <span key={tag} className="text-[9px] font-body text-ivory/25 tracking-wider">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <ButterflyLogo size="sm" />
            <p className="text-sm font-body text-ivory/35 mt-5 leading-relaxed max-w-xs">
              Premium artificial jewellery crafted for the modern Indian woman — from everyday elegance to bridal grandeur. Est. 2019.
            </p>
            <div className="flex gap-3 mt-6">
              {[{ icon: Instagram, href: "#", label: "Instagram" }, { icon: Facebook, href: "#", label: "Facebook" }, { icon: Youtube, href: "#", label: "YouTube" }, { icon: Twitter, href: "#", label: "Twitter" }].map(({ icon: Icon, href, label }) => (
                <Link key={label} href={href} aria-label={label} className="w-9 h-9 rounded-full border border-champagne/15 flex items-center justify-center text-ivory/40 hover:border-champagne hover:text-champagne transition-all duration-200">
                  <Icon size={14} />
                </Link>
              ))}
            </div>
            {/* Contact */}
            <div className="mt-8 space-y-2.5">
              {[
                { icon: Mail, text: "support@butterfly.com" },
                { icon: Phone, text: "+91 98765 43210" },
                { icon: MapPin, text: "Mumbai, India" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon size={12} className="text-champagne/50 flex-shrink-0" />
                  <span className="text-[11px] font-body text-ivory/35">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nav groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-champagne font-body text-[10px] font-semibold tracking-[0.25em] uppercase mb-5">{group}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-xs font-body text-ivory/40 hover:text-champagne/80 transition-colors tracking-wide">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Ratings strip */}
      <div className="border-t border-champagne/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill="currentColor" className="text-champagne" />)}
              <span className="text-xs font-body text-ivory/50 ml-1">4.9 / 5 · 12,000+ Reviews</span>
            </div>
            <span className="text-[10px] font-body text-ivory/25 hidden md:block">Verified by happy customers</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-body text-ivory/25 tracking-wider">Secure Payments:</span>
            <div className="flex gap-2">
              {["Razorpay", "UPI", "COD", "Visa", "Mastercard"].map((p) => (
                <span key={p} className="text-[9px] border border-ivory/10 px-2 py-1 rounded text-ivory/30 tracking-wider">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-champagne/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] font-body text-ivory/20 tracking-wider">© 2026 Butterfly Fine Jewellery. All rights reserved.</p>
          <p className="text-[10px] font-body text-ivory/15 tracking-wider">Crafted with ♥ for women who dare to shine</p>
        </div>
      </div>
    </footer>
  );
}

