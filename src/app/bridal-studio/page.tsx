"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Heart, Calendar, Sparkles, Check, ArrowRight, Star, ChevronRight } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { useWishlistStore } from "@/store";
import toast from "react-hot-toast";

const OCCASIONS = [
  { id: "mehndi", label: "Mehndi", icon: "🌿", style: "Colourful & Festive" },
  { id: "sangeet", label: "Sangeet", icon: "💃", style: "Bold & Glamorous" },
  { id: "haldi", label: "Haldi", icon: "🌼", style: "Light & Floral" },
  { id: "wedding", label: "Wedding", icon: "👰", style: "Regal & Traditional" },
  { id: "reception", label: "Reception", icon: "✨", style: "Modern & Sophisticated" },
  { id: "engagement", label: "Engagement", icon: "💍", style: "Romantic & Delicate" },
];

const BRIDAL_PACKAGES = [
  {
    name: "Butterfly Essence",
    subtitle: "For the minimalist bride",
    price: "₹4,999",
    originalPrice: "₹7,200",
    savings: "30%",
    color: "from-champagne/20 to-ivory",
    badge: null,
    items: ["Statement Necklace Set", "Jhumka Earrings", "2 Bangles", "Maang Tikka"],
    image: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=600&q=85",
  },
  {
    name: "Butterfly Royale",
    subtitle: "Our most beloved bridal set",
    price: "₹8,999",
    originalPrice: "₹13,500",
    savings: "33%",
    color: "from-obsidian to-mink",
    badge: "Most Popular",
    items: ["Grand Necklace Set", "Jhumka + Studs", "6 Bangles", "Maang Tikka", "Haath Phool", "Anklets (pair)"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=85",
  },
  {
    name: "Butterfly Empress",
    subtitle: "For the queen who wants it all",
    price: "₹14,999",
    originalPrice: "₹22,000",
    savings: "32%",
    color: "from-rose-gold/20 to-blush",
    badge: "Premium",
    items: ["Bridal Rani Haar Set", "Layered Necklace", "Chandelier Earrings + Studs", "12 Bangles", "Maang Tikka + Passa", "Haath Phool", "Anklets", "Nose Ring"],
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=85",
  },
];

const BRIDAL_LOOKS = [
  { occasion: "North Indian Bridal", style: "Red & Gold", products: 0, image: "https://images.unsplash.com/photo-1509803874385-db7c23652552?w=500&q=85" },
  { occasion: "South Indian Bridal", style: "Temple Gold", products: 2, image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&q=85" },
  { occasion: "Modern Bridal", style: "Rose Gold & Pearl", products: 1, image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=85" },
  { occasion: "Destination Bride", style: "Minimal & Elegant", products: 3, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=85" },
];

export default function BridalStudioPage() {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [appointmentForm, setAppointmentForm] = useState({ name: "", email: "", phone: "", date: "", occasion: "" });
  const [appointmentDone, setAppointmentDone] = useState(false);
  const { toggle } = useWishlistStore();

  const bridalProducts = PRODUCTS.filter(
    (p) => p.categorySlug === "bridal-collection" || p.badge === "Bestseller" || p.featured
  ).slice(0, 8);

  const handleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentDone(true);
    toast.success("Bridal consultation booked! We'll reach out within 24 hours.", {
      style: { background: "#FDFBF7", color: "#1A1409", border: "1px solid #C9A84C" },
    });
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] overflow-hidden flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=2000&q=95"
          alt="Bridal Studio"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/65 to-obsidian/30" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="flex items-center gap-2 mb-6">
              <Crown size={16} className="text-champagne" />
              <span className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase">Butterfly Bridal Studio</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl text-ivory leading-[0.9]">
              Your Wedding,<br /><em className="text-champagne">Your Story,</em><br />Our Jewellery
            </h1>
            <p className="mt-6 font-body text-ivory/65 text-lg leading-relaxed max-w-xl">
              A dedicated space to build your dream bridal look — from engagement to reception.
              Expert curation, personalised recommendations, complete bridal sets.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#packages" className="px-8 py-4 bg-gradient-to-r from-champagne to-champagne-dark text-white font-body text-sm tracking-[0.15em] uppercase rounded-full hover:shadow-luxury-xl transition-shadow flex items-center gap-2">
                <Crown size={14} /> View Packages
              </a>
              <a href="#appointment" className="px-8 py-4 border border-champagne/40 text-champagne font-body text-sm tracking-[0.15em] uppercase rounded-full hover:bg-champagne/10 transition-colors flex items-center gap-2">
                <Calendar size={14} /> Book Consultation
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OCCASION SELECTOR ────────────────────────────────────── */}
      <section className="py-20 bg-pearl">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Look Builder</p>
            <h2 className="font-display text-4xl sm:text-5xl text-obsidian">Select Your Occasion</h2>
            <p className="mt-3 font-body text-mink-light text-sm">Tell us which ceremony you&apos;re dressing for</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {OCCASIONS.map((occ) => (
              <motion.button
                key={occ.id}
                onClick={() => setSelectedOccasion(selectedOccasion === occ.id ? null : occ.id)}
                className={`relative rounded-2xl p-4 text-center border-2 transition-all duration-300 ${
                  selectedOccasion === occ.id
                    ? "border-champagne bg-champagne/10 shadow-luxury"
                    : "border-champagne/15 bg-white hover:border-champagne/40"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-3xl">{occ.icon}</span>
                <p className="font-body text-sm font-semibold text-obsidian mt-2">{occ.label}</p>
                <p className="font-body text-[10px] text-mink-light mt-0.5">{occ.style}</p>
                {selectedOccasion === occ.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-champagne rounded-full flex items-center justify-center">
                    <Check size={11} className="text-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {selectedOccasion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 bg-champagne/10 border border-champagne/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-champagne" />
                  <p className="font-body text-sm font-semibold text-obsidian">
                    Suggested Style for {OCCASIONS.find((o) => o.id === selectedOccasion)?.label}
                  </p>
                </div>
                <p className="font-body text-xs text-mink-light">
                  We recommend our <strong>Kundan & Polki</strong> range for this occasion — combining traditional craftsmanship with modern silhouettes. The set includes a statement necklace, matching jhumkas, and accessories for a complete look.
                </p>
                <Link href="/products?category=bridal-collection" className="mt-3 inline-flex items-center gap-1 text-xs font-body text-champagne tracking-wider uppercase hover:gap-2 transition-all">
                  Browse Suggested Pieces <ArrowRight size={12} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── BRIDAL LOOKS ─────────────────────────────────────────── */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Inspiration</p>
            <h2 className="font-display text-4xl sm:text-5xl text-obsidian">Curated Bridal Looks</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRIDAL_LOOKS.map((look, i) => (
              <motion.div
                key={look.occasion}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Image src={look.image} alt={look.occasion} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className="text-[9px] font-body text-champagne tracking-[0.3em] uppercase">{look.style}</p>
                  <h3 className="font-display text-lg text-white mt-1">{look.occasion}</h3>
                  <button className="mt-2 inline-flex items-center gap-1 text-[10px] font-body text-ivory/70 hover:text-champagne transition-colors tracking-wider uppercase">
                    Build this look <ChevronRight size={10} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRIDAL PACKAGES ──────────────────────────────────────── */}
      <section id="packages" className="py-20 bg-pearl">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Complete Sets</p>
            <h2 className="font-display text-4xl sm:text-5xl text-obsidian">Bridal Jewellery Packages</h2>
            <p className="mt-3 font-body text-mink-light text-sm max-w-xl mx-auto">Save up to 33% with our curated bridal sets. Everything you need for every ceremony, perfectly matched.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BRIDAL_PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                className={`relative rounded-3xl overflow-hidden flex flex-col ${
                  pkg.badge === "Most Popular" ? "ring-2 ring-champagne shadow-luxury-xl" : "border border-champagne/15"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {pkg.badge && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-champagne text-white text-[10px] font-body tracking-[0.15em] uppercase rounded-full">
                    {pkg.badge}
                  </div>
                )}
                <div className="relative h-52">
                  <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${pkg.color} opacity-60`} />
                </div>
                <div className={`flex-1 p-6 bg-gradient-to-b ${pkg.badge === "Most Popular" ? "from-obsidian to-mink text-ivory" : "from-white to-pearl"}`}>
                  <h3 className={`font-display text-2xl ${pkg.badge === "Most Popular" ? "text-champagne" : "text-obsidian"}`}>{pkg.name}</h3>
                  <p className={`font-body text-xs mt-1 ${pkg.badge === "Most Popular" ? "text-ivory/60" : "text-mink-light"}`}>{pkg.subtitle}</p>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className={`font-display text-3xl ${pkg.badge === "Most Popular" ? "text-champagne" : "text-champagne"}`}>{pkg.price}</span>
                    <span className={`font-body text-sm line-through ${pkg.badge === "Most Popular" ? "text-ivory/40" : "text-mink-light/60"}`}>{pkg.originalPrice}</span>
                    <span className="text-[10px] bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full font-body">Save {pkg.savings}</span>
                  </div>
                  <ul className={`mt-4 space-y-2 text-xs font-body ${pkg.badge === "Most Popular" ? "text-ivory/70" : "text-mink-light"}`}>
                    {pkg.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check size={12} className="text-champagne flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className={`mt-6 w-full py-3 rounded-full font-body text-sm tracking-[0.12em] uppercase transition-all ${
                    pkg.badge === "Most Popular"
                      ? "bg-champagne text-white hover:bg-champagne-dark"
                      : "border border-champagne text-champagne hover:bg-champagne/10"
                  }`}>
                    Select Package
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT COLLECTION ───────────────────────────────────── */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Individual Pieces</p>
              <h2 className="font-display text-4xl sm:text-5xl text-obsidian">Bridal Collection</h2>
            </div>
            <Link href="/products?category=bridal-collection" className="hidden md:flex items-center gap-2 font-body text-sm text-mink-light hover:text-champagne transition-colors tracking-wider uppercase">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bridalProducts.slice(0, 4).map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPOINTMENT BOOKING ──────────────────────────────────── */}
      <section id="appointment" className="py-20 bg-gradient-to-br from-obsidian via-mink to-obsidian">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4"><Calendar size={16} className="text-champagne" /><span className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase">Personal Styling</span></div>
            <h2 className="font-display text-4xl sm:text-5xl text-ivory">Book a Bridal Consultation</h2>
            <p className="mt-3 font-body text-ivory/55 text-sm">Our expert stylists will curate a personalised look for your wedding. Free consultation, no obligations.</p>
          </div>

          {!appointmentDone ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleAppointment}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-body text-ivory/60 tracking-[0.2em] uppercase block mb-2">Your Name</label>
                  <input value={appointmentForm.name} onChange={(e) => setAppointmentForm({ ...appointmentForm, name: e.target.value })} required placeholder="Priya Sharma" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-body text-ivory placeholder-ivory/30 focus:outline-none focus:border-champagne/50" />
                </div>
                <div>
                  <label className="text-[10px] font-body text-ivory/60 tracking-[0.2em] uppercase block mb-2">Phone Number</label>
                  <input value={appointmentForm.phone} onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })} required placeholder="+91 98765 43210" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-body text-ivory placeholder-ivory/30 focus:outline-none focus:border-champagne/50" />
                </div>
                <div>
                  <label className="text-[10px] font-body text-ivory/60 tracking-[0.2em] uppercase block mb-2">Email Address</label>
                  <input type="email" value={appointmentForm.email} onChange={(e) => setAppointmentForm({ ...appointmentForm, email: e.target.value })} required placeholder="priya@example.com" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-body text-ivory placeholder-ivory/30 focus:outline-none focus:border-champagne/50" />
                </div>
                <div>
                  <label className="text-[10px] font-body text-ivory/60 tracking-[0.2em] uppercase block mb-2">Wedding Date</label>
                  <input type="date" value={appointmentForm.date} onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-body text-ivory focus:outline-none focus:border-champagne/50" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-body text-ivory/60 tracking-[0.2em] uppercase block mb-2">Occasion Type</label>
                <select value={appointmentForm.occasion} onChange={(e) => setAppointmentForm({ ...appointmentForm, occasion: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-body text-ivory focus:outline-none focus:border-champagne/50">
                  <option value="" className="text-obsidian">Select occasion...</option>
                  {OCCASIONS.map((o) => <option key={o.id} value={o.id} className="text-obsidian">{o.label}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-champagne to-champagne-dark text-white font-body text-sm tracking-[0.15em] uppercase rounded-full hover:shadow-luxury-xl transition-shadow flex items-center justify-center gap-2">
                <Calendar size={15} /> Book My Consultation
              </button>
              <p className="text-center text-[10px] font-body text-ivory/30">Free. No commitment. We&apos;ll call within 24 hours.</p>
            </motion.form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-champagne/20 border border-champagne/40 flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-champagne" />
              </div>
              <h3 className="font-display text-3xl text-ivory mb-3">Consultation Booked!</h3>
              <p className="font-body text-ivory/60 text-sm">Our bridal stylist will reach out within 24 hours. Get ready to begin your journey! 🌸</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
