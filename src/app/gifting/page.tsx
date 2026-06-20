"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, Heart, Crown, Check, ArrowRight, Star, Sparkles, Package } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";

const GIFT_OCCASIONS = [
  { id: "anniversary", icon: "💕", label: "Anniversary", color: "from-rose-gold/20 to-blush" },
  { id: "birthday", icon: "🎂", label: "Birthday", color: "from-champagne/20 to-ivory" },
  { id: "wedding", icon: "💍", label: "Wedding Gift", color: "from-champagne/30 to-pearl" },
  { id: "diwali", icon: "✨", label: "Diwali", color: "from-amber-100 to-ivory" },
  { id: "baby-shower", icon: "🌸", label: "Baby Shower", color: "from-pink-100 to-blush" },
  { id: "mother", icon: "🌹", label: "Mother&apos;s Day", color: "from-rose-100 to-ivory" },
];

const GIFT_BOXES = [
  {
    name: "Butterfly Essential",
    subtitle: "Perfect starter gift",
    price: "₹1,999",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=85",
    includes: ["1 Premium Piece", "Butterfly Gift Box", "Tissue Paper", "Ribbon"],
    badge: null,
  },
  {
    name: "Butterfly Luxe",
    subtitle: "Most gifted choice",
    price: "₹3,999",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=85",
    includes: ["2 Premium Pieces", "Signature Gift Box", "Tissue Paper", "Satin Ribbon", "Personalised Card"],
    badge: "Most Popular",
  },
  {
    name: "Butterfly Grand",
    subtitle: "The ultimate luxury gift",
    price: "₹7,999",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=85",
    includes: ["3+ Premium Pieces", "Premium Gift Set Box", "Fragrant Tissue", "Gold Ribbon & Bow", "Handwritten Card", "Premium Jewellery Pouch"],
    badge: "Premium",
  },
];

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } };

export default function GiftingPage() {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [giftNote, setGiftNote] = useState("");
  const [noteAdded, setNoteAdded] = useState(false);

  const giftProducts = PRODUCTS.filter((p) => p.featured || p.bestseller).slice(0, 8);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden flex items-center">
        <Image src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=2000&q=90" alt="Gifting" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/85 via-obsidian/55 to-obsidian/20" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <div className="flex items-center gap-2 mb-4"><Gift size={16} className="text-rose-gold" /><span className="text-[10px] font-body text-rose-gold tracking-[0.4em] uppercase">Premium Gifting</span></div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-ivory leading-[0.92]">Give the<br /><em className="text-rose-gold-light">Gift</em> of<br />Butterfly</h1>
            <p className="mt-6 font-body text-ivory/65 text-base leading-relaxed max-w-lg">Every Butterfly gift arrives in our signature luxury box — beautifully wrapped, ready to treasure. Turn any occasion into an unforgettable memory.</p>
            <a href="#gift-boxes" className="mt-8 inline-flex items-center gap-2 px-7 py-4 bg-rose-gold text-white font-body text-sm tracking-[0.15em] uppercase rounded-full hover:bg-rose-gold-dark transition-colors">
              <Gift size={14} /> Shop Gift Sets
            </a>
          </motion.div>
        </div>
      </section>

      {/* Occasion Selector */}
      <section className="py-20 bg-pearl">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-10">
            <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Shop by Occasion</p>
            <h2 className="font-display text-4xl sm:text-5xl text-obsidian">What Are You Celebrating?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {GIFT_OCCASIONS.map((occ) => (
              <motion.button key={occ.id} onClick={() => setSelectedOccasion(selectedOccasion === occ.id ? null : occ.id)} className={`group relative rounded-2xl p-5 text-center bg-gradient-to-br ${occ.color} border-2 transition-all duration-300 ${selectedOccasion === occ.id ? "border-champagne shadow-luxury scale-105" : "border-transparent hover:border-champagne/30"}`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <span className="text-3xl">{occ.icon}</span>
                <p className="font-body text-xs font-semibold text-obsidian mt-2">{occ.label}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Boxes */}
      <section id="gift-boxes" className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Signature Sets</p>
            <h2 className="font-display text-4xl sm:text-5xl text-obsidian">Butterfly Gift Boxes</h2>
            <p className="mt-3 font-body text-mink-light text-sm max-w-xl mx-auto">Curated sets in our luxurious gift packaging — delivered to their door in style.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {GIFT_BOXES.map((box, i) => (
              <motion.div key={box.name} className={`rounded-3xl overflow-hidden border ${box.badge === "Most Popular" ? "border-champagne ring-1 ring-champagne shadow-luxury-xl" : "border-champagne/15"}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                {box.badge && <div className="bg-champagne text-white text-[10px] font-body tracking-[0.15em] uppercase text-center py-1.5">{box.badge}</div>}
                <div className="relative h-48">
                  <Image src={box.image} alt={box.name} fill className="object-cover" />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="font-display text-2xl text-obsidian">{box.name}</h3>
                  <p className="font-body text-xs text-mink-light mt-1">{box.subtitle}</p>
                  <p className="font-display text-3xl text-champagne mt-3">{box.price}</p>
                  <ul className="mt-4 space-y-2">
                    {box.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs font-body text-mink-light">
                        <Check size={11} className="text-champagne flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-5 w-full py-3 bg-gradient-to-r from-champagne to-champagne-dark text-white rounded-xl font-body text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Gift size={12} /> Choose Pieces
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalised Note */}
      <section className="py-20 bg-blush">
        <div className="max-w-2xl mx-auto px-6 sm:px-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4"><Heart size={16} className="text-rose-gold" /><span className="text-[10px] font-body text-rose-gold tracking-[0.4em] uppercase">Make It Personal</span></div>
          <h2 className="font-display text-4xl sm:text-5xl text-obsidian">Add a Personal Note</h2>
          <p className="mt-3 font-body text-mink-light text-sm">Every gift can include a handwritten message card from you. Share your feelings in your own words.</p>
          <div className="mt-8">
            {!noteAdded ? (
              <div className="space-y-4">
                <textarea
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="With all my love, on this special day..."
                  rows={4}
                  className="w-full bg-white border border-champagne/20 rounded-2xl px-5 py-4 font-body text-sm text-obsidian placeholder-mink-light/50 focus:outline-none focus:border-champagne/50 resize-none shadow-sm"
                />
                <button
                  onClick={() => giftNote && setNoteAdded(true)}
                  className="w-full py-3.5 bg-rose-gold text-white font-body text-sm tracking-[0.15em] uppercase rounded-full hover:bg-rose-gold-dark transition-colors flex items-center justify-center gap-2"
                >
                  <Heart size={14} /> Add to Gift
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 border border-rose-gold/20 shadow-sm">
                <div className="flex items-center gap-2 mb-3"><Check size={16} className="text-rose-gold" /><span className="font-body text-sm font-semibold text-obsidian">Note Added!</span></div>
                <p className="font-body text-sm text-mink-light italic">"{giftNote}"</p>
                <button onClick={() => setNoteAdded(false)} className="mt-3 text-[10px] font-body text-rose-gold tracking-wider uppercase hover:underline">Edit note</button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Packaging Visual */}
      <section className="py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ The Experience</p>
            <h2 className="font-display text-4xl sm:text-5xl text-ivory">Luxury in Every Layer</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Package, label: "Signature Box", desc: "Magnetic closure matte box with gold foil butterfly crest" },
              { icon: Sparkles, label: "Fragrant Tissue", desc: "Soft scented tissue paper in ivory & blush pink" },
              { icon: Gift, label: "Satin Ribbon", desc: "Our iconic champagne gold ribbon tied with a bow" },
              { icon: Heart, label: "Personalised Card", desc: "Handwritten note in our signature calligraphy envelope" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-champagne/15 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-champagne" />
                </div>
                <h3 className="font-body text-sm font-semibold text-ivory mb-2">{label}</h3>
                <p className="font-body text-xs text-ivory/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 bg-pearl">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Top Gifted</p>
              <h2 className="font-display text-4xl sm:text-5xl text-obsidian">Most Gifted Pieces</h2>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 font-body text-sm text-mink-light hover:text-champagne transition-colors tracking-wider uppercase">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {giftProducts.slice(0, 4).map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
