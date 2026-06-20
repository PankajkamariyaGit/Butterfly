"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, Star, Crown, Gift } from "lucide-react";
import { PRODUCTS, CATEGORIES, TESTIMONIALS } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { ButterflyIcon } from "@/components/ui/ButterflyLogo";
import RecentlyViewed from "@/components/ui/RecentlyViewed";
import { useRecentlyViewedStore } from "@/store";

// ── Feature flags — set true/false to show or hide sections ──────────
const SHOW_BRIDAL_STUDIO = false;       // set true to re-enable bridal banner
const SHOW_FESTIVE_COLLECTIONS = false; // set true to re-enable festive section
const SHOW_INFLUENCER_LOVES = false;    // set true to re-enable influencer section


/* ── Mouse spotlight ──────────────────────────────────────────── */
function MouseSpotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 opacity-0 md:opacity-100"
      style={{
        background: useTransform(
          [springX, springY],
          ([x, y]: number[]) =>
            `radial-gradient(600px at ${x}px ${y}px, rgba(201,168,76,0.05) 0%, transparent 70%)`
        ),
      }}
    />
  );
}

/* ── Animated 3D butterfly ────────────────────────────────────── */
function Butterfly3D({ size = 120 }: { size?: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.015;
      setTilt({ x: Math.sin(t) * 8, y: Math.cos(t * 0.7) * 6 });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div style={{ width: size, height: size, transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 0.1s ease", position: "relative" }}>
      <div className="absolute inset-0 rounded-full opacity-30" style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.6) 0%, rgba(183,110,121,0.3) 50%, transparent 70%)", filter: "blur(20px)", transform: "scale(1.5)" }} />
      <ButterflyIcon size={size} />
    </div>
  );
}

/* ── Animated stat counter ────────────────────────────────────── */
function AnimatedStat({ value, suffix = "", label, decimals = 0 }: { value: number; suffix?: string; label: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const inc = value / steps;
    let cur = 0;
    const t = setInterval(() => { cur += inc; if (cur >= value) { setCount(value); clearInterval(t); } else setCount(parseFloat(cur.toFixed(decimals))); }, 1800 / steps);
    return () => clearInterval(t);
  }, [started, value, decimals]);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl sm:text-5xl text-champagne">{count.toFixed(decimals)}{suffix}</p>
      <p className="text-xs font-body text-ivory/50 tracking-[0.2em] uppercase mt-1">{label}</p>
    </div>
  );
}

const fadeUp = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

/* ══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.08]);

  const bestsellers = PRODUCTS.filter((p) => p.bestseller).slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.newArrival).slice(0, 4);

  return (
    <>
      <MouseSpotlight />

      {/* HERO ─────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <Image src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=2000&q=95" alt="Butterfly Fine Jewellery" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0B08]/90 via-[#1a0a20]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0B08]/80 via-transparent to-transparent" />
          {/* Vivid color wash overlay — brighter */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-transparent to-rose-900/30" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#FF3E7A]/8 to-[#FFB800]/12" />
        </motion.div>

        {/* 3D butterfly */}
        <motion.div className="absolute right-[8%] top-[15%] hidden lg:block" animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ opacity: heroOpacity }}>
          <Butterfly3D size={150} />
        </motion.div>
        {[{ top: "20%", left: "60%", size: 40, delay: 0 }, { top: "65%", left: "72%", size: 28, delay: 1.2 }].map((b, i) => (
          <motion.div key={i} className="absolute hidden md:block opacity-25" style={{ top: b.top, left: b.left }} animate={{ y: [0, -12, 0], opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 4 + i, delay: b.delay, repeat: Infinity }}>
            <ButterflyIcon size={b.size} />
          </motion.div>
        ))}

        <motion.div className="relative h-full flex items-center" style={{ opacity: heroOpacity }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
            <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl">
              <motion.p variants={fadeUp} className="text-xs font-body text-champagne-light tracking-[0.4em] uppercase mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-champagne/60" />Fine Jewellery Collection 2026<span className="w-8 h-px bg-champagne/60" />
              </motion.p>
              <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-6xl lg:text-8xl text-ivory leading-[0.92] tracking-tight">
                Jewellery<br />
                <em className="text-gradient-gold not-italic">That</em><br />
                Lets You<br />
                <span className="relative">Bloom
                  <motion.div className="absolute -bottom-2 left-0 h-[3px] bg-gradient-to-r from-[#FF3E7A] via-[#FFB800] to-transparent rounded-full" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1.2, duration: 1 }} />
                </span>
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-8 text-base font-body text-ivory/70 leading-relaxed max-w-md">
                Discover exclusive pieces crafted for women who celebrate every moment with timeless grace and modern elegance.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4 items-center">
                <Link href="/products" className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-[#D4A017] via-[#FF3E7A] to-[#E05A7A] text-white font-body text-sm tracking-[0.15em] uppercase rounded-full hover:shadow-[0_10px_40px_rgba(255,62,122,0.5)] transition-all flex items-center gap-2" data-cursor="Explore">
                  <span>Explore Collection</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                </Link>
                {SHOW_BRIDAL_STUDIO && (
                  <Link href="/bridal-studio" className="flex items-center gap-2 text-ivory/80 hover:text-champagne-light font-body text-sm tracking-[0.12em] uppercase transition-colors">
                    <span className="w-7 h-7 rounded-full border border-[#FFB800]/50 flex items-center justify-center"><Crown size={12} className="text-champagne-light" /></span>
                    Bridal Studio
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom trust bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 hidden md:flex">
          {[{ label: "Free Shipping", sub: "On orders above ₹999" }, { label: "Premium Quality", sub: "Certified materials" }, { label: "Easy Returns", sub: "7-day guarantee" }, { label: "Luxury Packaging", sub: "Gift-ready always" }].map((item) => (
            <div key={item.label} className="flex-1 py-4 px-4 border-r border-white/10 last:border-r-0 text-center hover:bg-white/5 transition-colors">
              <p className="text-[11px] font-body font-medium text-ivory/80 tracking-wider">{item.label}</p>
              <p className="text-[9px] font-body text-ivory/40 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ opacity: heroOpacity }}>
          <p className="text-[9px] font-body text-ivory/40 tracking-[0.3em] uppercase">Scroll</p>
          <div className="w-px h-10 bg-gradient-to-b from-champagne/60 to-transparent" />
        </motion.div>
      </section>

      {/* MARQUEE ─────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-gradient-to-r from-[#C9A84C] via-[#FF3E7A] to-[#7C3AED] py-4">
        <motion.div className="flex gap-12 items-center whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-10 text-white font-body text-xs tracking-[0.3em] uppercase font-semibold">
              <span>✦ New Arrivals</span><span className="opacity-50">|</span><span>Bridal 2026</span><span className="opacity-50">|</span><span>Free Shipping ₹999+</span><span className="opacity-50">|</span><span>💎 Premium Quality</span><span className="opacity-50">|</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* EDITORIAL INTRO ─────────────────────────────────────── */}
      <section className="py-28 md:py-36 overflow-hidden bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF0F5] relative">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#FFB800]/15 to-[#FF3E7A]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-[#7C3AED]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-6">✦ The Butterfly Philosophy</p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl text-obsidian leading-[0.9] tracking-tight">
                Worn by<br /><em className="text-rose-gold">Women</em><br />Who Dare<br />to Shine
              </h2>
              <div className="mt-8 w-16 h-px bg-champagne" />
              <p className="mt-6 font-body text-mink-light text-base leading-relaxed max-w-md">
                Each Butterfly piece is born from a singular obsession: creating jewellery that doesn&apos;t just accessorise — it transforms. Crafted with precision, worn with intention.
              </p>
              <div className="mt-8 flex gap-6">
                <Link href="/about" className="group flex items-center gap-2 font-body text-sm text-champagne tracking-[0.15em] uppercase" data-cursor="Read">
                  Our Story <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link href="/products" className="group flex items-center gap-2 font-body text-sm text-mink-light tracking-[0.15em] uppercase hover:text-champagne transition-colors">
                  Shop All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div className="relative h-[520px] hidden lg:block" initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <motion.div className="absolute top-0 left-8 w-52 h-64 rounded-2xl overflow-hidden shadow-luxury-xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                <Image src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=90" alt="editorial" fill className="object-cover" />
              </motion.div>
              <motion.div className="absolute top-16 right-0 w-60 h-72 rounded-2xl overflow-hidden shadow-luxury-xl" animate={{ y: [0, 10, 0] }} transition={{ duration: 7, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}>
                <Image src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=90" alt="editorial" fill className="object-cover" />
              </motion.div>
              <motion.div className="absolute bottom-0 left-0 w-44 h-52 rounded-2xl overflow-hidden shadow-luxury-xl" animate={{ y: [0, 8, 0] }} transition={{ duration: 5.5, delay: 1, repeat: Infinity, ease: "easeInOut" }}>
                <Image src="https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600&q=90" alt="editorial" fill className="object-cover" />
              </motion.div>
              <motion.div className="absolute bottom-12 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-luxury" animate={{ y: [0, -5, 0] }} transition={{ duration: 4, delay: 0.8, repeat: Infinity }}>
                <div className="flex items-center gap-2"><Star size={12} fill="currentColor" className="text-champagne" /><span className="font-body text-xs font-semibold text-obsidian">4.9 / 5.0</span></div>
                <p className="text-[9px] font-body text-mink-light mt-0.5">3,700+ happy customers</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FLASH SALE COUNTDOWN ───────────────────────────────── */}
      <FlashSaleBar />

      {/* CATEGORIES ──────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-white to-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mb-14">
            <motion.p variants={fadeUp} className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Curated for You</motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-5xl sm:text-6xl text-obsidian">The Collections</motion.h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {CATEGORIES.filter((c) => c.featured).slice(0, 4).map((cat, i) => (
              <motion.div key={cat.id} className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "md:col-span-2 h-72 md:h-96" : "h-52 md:h-64"}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} whileHover={{ scale: 1.02 }} data-cursor="Explore">
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className="text-[9px] font-body text-champagne/70 tracking-[0.3em] uppercase mb-1">{cat.productCount} pieces</p>
                  <h3 className="font-display text-xl sm:text-2xl text-white">{cat.name}</h3>
                  <Link href={`/products?category=${cat.slug}`} className="mt-2 inline-flex items-center gap-1 text-[10px] font-body text-ivory/70 hover:text-champagne transition-colors tracking-wider uppercase">Shop now <ArrowRight size={10} /></Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS ────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-[#FFF0F5] via-[#FFF8FF] to-[#F8F0FF] overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,62,122,0.06) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(124,58,237,0.06) 0%, transparent 50%)" }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Staff Picks</p>
              <h2 className="font-display text-5xl sm:text-6xl text-obsidian">New Arrivals</h2>
            </div>
            <Link href="/products?filter=new" className="hidden md:flex items-center gap-2 font-body text-sm text-mink-light hover:text-champagne transition-colors tracking-[0.15em] uppercase">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <div className="mt-10 md:hidden text-center"><Link href="/products?filter=new"><Button variant="outline">View All New Arrivals</Button></Link></div>
        </div>
      </section>

      {/* BRIDAL BANNER ───────────────────────────────────────── */}      {SHOW_BRIDAL_STUDIO && (      <section className="relative overflow-hidden min-h-[500px] md:min-h-[620px]">
        <Image src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=2000&q=90" alt="Bridal Studio" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/60 to-obsidian/20" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 h-full flex items-center min-h-[500px] md:min-h-[620px]">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="max-w-xl">
            <div className="flex items-center gap-2 mb-6"><Crown size={14} className="text-champagne" /><span className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase">Bridal Studio 2026</span></div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl text-ivory leading-[0.92]">
              Your Dream<br /><em className="text-champagne">Bridal</em><br />Jewellery
            </h2>
            <p className="mt-6 font-body text-ivory/65 text-base leading-relaxed">From the first look to the last dance — curated bridal jewellery sets, personalised look-building, and expert styling guidance for your most treasured day.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/bridal-studio" className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-champagne to-champagne-dark text-white font-body text-sm tracking-[0.15em] uppercase rounded-full hover:shadow-luxury-xl transition-shadow flex items-center gap-2" data-cursor="Explore">
                <Crown size={14} /><span>Enter Bridal Studio</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              </Link>
              <Link href="/products?category=bridal-collection" className="px-8 py-4 border border-champagne/40 text-champagne font-body text-sm tracking-[0.15em] uppercase rounded-full hover:bg-champagne/10 transition-colors">View Collection</Link>
            </div>
          </motion.div>
        </div>
      </section>      )}
      {/* BESTSELLERS ─────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-white to-[#FFFBF0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Most Loved</p>
              <h2 className="font-display text-5xl sm:text-6xl text-obsidian">Bestsellers</h2>
            </div>
            <Link href="/products?filter=bestseller" className="hidden md:flex items-center gap-2 font-body text-sm text-mink-light hover:text-champagne transition-colors tracking-[0.15em] uppercase">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GIFTING BANNER ──────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-[#FFF0F5] via-[#FFFBF0] to-[#FFF0FA] overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(224,90,122,0.08) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-center gap-2 mb-4"><Gift size={14} className="text-rose-gold" /><span className="text-[10px] font-body text-rose-gold tracking-[0.4em] uppercase">Gifting Experience</span></div>
              <h2 className="font-display text-5xl sm:text-6xl text-obsidian leading-[0.95]">Give the Gift<br />of <em className="text-rose-gold">Butterfly</em></h2>
              <p className="mt-6 font-body text-mink-light text-base leading-relaxed">Every Butterfly piece arrives in our signature luxury gift box with tissue paper, satin ribbon, and a personalised handwritten note. Turn any moment into a memory.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Anniversary Gifts", "Birthday Gifts", "Wedding Gifts", "Just Because"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-rose-gold/10 border border-rose-gold/20 text-rose-gold text-[10px] font-body tracking-wider rounded-full">{tag}</span>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/gifting" className="group inline-flex items-center gap-2 px-6 py-3.5 bg-rose-gold text-white font-body text-sm tracking-[0.12em] uppercase rounded-full hover:bg-rose-gold-dark transition-colors">
                  <Gift size={14} /><span>Shop Gifts</span><ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
            <motion.div className="relative h-80 md:h-[400px]" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <div className="absolute inset-4 rounded-3xl overflow-hidden shadow-luxury-xl">
                <Image src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=90" alt="Luxury gift packaging" fill className="object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR ───────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-[#0F0B08] via-[#1A0E2E] to-[#1C0A14] overflow-hidden relative">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(255,62,122,0.10) 0%, transparent 60%)" }} />
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <AnimatedStat value={3700} suffix="+" label="Happy Customers" />
            <AnimatedStat value={300} suffix="+" label="Products" />
            <AnimatedStat value={99} suffix="%" label="Satisfaction Rate" />
            <AnimatedStat value={4.6} suffix=" ★" label="Avg Rating" decimals={1} />
          </div>
        </div>
      </section>

      {/* FESTIVE COLLECTIONS ─────────────────────────────────── */}
      {SHOW_FESTIVE_COLLECTIONS && (
      <section className="py-24 bg-gradient-to-br from-[#2D0A1F] via-[#1A0E2E] to-[#1C0A0A] overflow-hidden relative">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-[10px] font-body text-[#FFB800] tracking-[0.4em] uppercase mb-3">✦ Celebrate India</p>
            <h2 className="font-display text-5xl sm:text-6xl text-white leading-tight">
              Festive <em className="text-[#FFB800]">Collections</em>
            </h2>
            <p className="mt-4 font-body text-white/50 text-base max-w-lg mx-auto">Curated exclusively for India&apos;s most beloved celebrations</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                festival: "Diwali 2026",
                subtitle: "Festival of Lights",
                color: "from-amber-500/30 to-yellow-900/50",
                border: "border-amber-500/30",
                accent: "#FFB800",
                emoji: "🪔",
                tag: "Gold & Pearl",
                link: "/products?collection=diwali",
                img: "https://images.unsplash.com/photo-1650785468226-4f63e3fda7e9?w=500&q=80",
              },
              {
                festival: "Navratri",
                subtitle: "Nine Nights of Joy",
                color: "from-red-500/30 to-rose-900/50",
                border: "border-red-500/30",
                accent: "#FF3E7A",
                emoji: "🎭",
                tag: "Colourful Bangles",
                link: "/products?collection=navratri",
                img: "https://images.unsplash.com/photo-1758995116383-28ff6b4eb1ee?w=500&q=80",
              },
              {
                festival: "Karwa Chauth",
                subtitle: "For the Beloved",
                color: "from-violet-500/30 to-purple-900/50",
                border: "border-violet-500/30",
                accent: "#7C3AED",
                emoji: "🌕",
                tag: "Maang Tikka & Rings",
                link: "/products?collection=karwa-chauth",
                img: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=500&q=80",
              },
              {
                festival: "Wedding Season",
                subtitle: "Bridal Trousseau",
                color: "from-rose-500/30 to-pink-900/50",
                border: "border-rose-500/30",
                accent: "#E05A7A",
                emoji: "💍",
                tag: "Bridal Sets",
                link: "/products?collection=bridal",
                img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80",
              },
            ].map((item, i) => (
              <motion.a
                key={item.festival}
                href={item.link}
                className={`group relative rounded-2xl overflow-hidden border ${item.border} bg-gradient-to-b ${item.color} cursor-pointer block`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image src={item.img} alt={item.festival} fill className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 right-3 text-2xl">{item.emoji}</span>
                </div>
                <div className="p-5">
                  <span className="text-[9px] font-body tracking-[0.3em] uppercase mb-1 block" style={{ color: item.accent }}>{item.tag}</span>
                  <h3 className="font-display text-xl text-white mb-1">{item.festival}</h3>
                  <p className="text-xs font-body text-white/50 mb-4">{item.subtitle}</p>
                  <span className="text-xs font-body font-semibold flex items-center gap-1.5 transition-colors" style={{ color: item.accent }}>
                    Shop Now <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-[#FFF8F0] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-14">
            <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">✦ Love Letters</p>
            <h2 className="font-display text-5xl sm:text-6xl text-obsidian">What They Say</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} className="bg-pearl border border-champagne/10 rounded-2xl p-6 hover:shadow-luxury-lg transition-all hover:-translate-y-1 duration-300" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}>
                <div className="flex gap-0.5 mb-4">{Array.from({ length: 5 }).map((_, s) => <Star key={s} size={12} fill="currentColor" className="text-champagne" />)}</div>
                <p className="font-body text-xs text-mink-light leading-relaxed italic mb-4">&ldquo;{t.comment}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-champagne/20 flex items-center justify-center text-xs font-bold text-champagne">{t.name?.charAt(0) ?? "U"}</div>
                  <div>
                    <p className="font-body text-[10px] font-semibold text-obsidian">{t.name}</p>
                    <p className="font-body text-[9px] text-mink-light/60">{(t as { city?: string }).city ?? ""}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INFLUENCER GALLERY ───────────────────────────────────── */}
      {SHOW_INFLUENCER_LOVES && (
      <section className="py-24 bg-gradient-to-br from-[#1A0E2E] to-[#0F0B08] overflow-hidden relative">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(255,62,122,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(124,58,237,0.08) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-[10px] font-body text-[#FF3E7A] tracking-[0.4em] uppercase mb-3">✦ Style Icons</p>
            <h2 className="font-display text-5xl sm:text-6xl text-white">
              Influencer <em className="text-[#FFB800]">Loves</em>
            </h2>
            <p className="mt-3 font-body text-white/50 text-sm">India&apos;s top fashion influencers styled by Butterfly</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "Rashmi K.", followers: "2.1M", platform: "Instagram", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80", look: "Bridal Glow" },
              { name: "Pooja S.", followers: "890K", platform: "YouTube", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80", look: "Festive Queen" },
              { name: "Meera T.", followers: "1.4M", platform: "Reels", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80", look: "Office Glam" },
              { name: "Divya R.", followers: "620K", platform: "Instagram", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80", look: "Navratri Vibes" },
              { name: "Anisha M.", followers: "3.2M", platform: "YouTube", img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&q=80", look: "Sangeet Look" },
              { name: "Sneha P.", followers: "750K", platform: "Reels", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=80", look: "Everyday Luxe" },
            ].map((inf, i) => (
              <motion.div
                key={inf.name}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ y: -6 }}
              >
                <Image src={inf.img} alt={inf.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FFB800]/50 transition-colors rounded-2xl" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-[9px] font-body text-[#FFB800] tracking-[0.2em] uppercase mb-0.5">{inf.look}</p>
                  <p className="text-xs font-body font-semibold text-white">{inf.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[9px] font-body text-white/50">{inf.followers}</p>
                    <span className="text-[8px] font-body text-white/40 bg-white/10 px-1.5 py-0.5 rounded-full">{inf.platform}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-[#FF3E7A]/40 text-[#FF3E7A] font-body text-sm tracking-[0.15em] uppercase rounded-full hover:bg-[#FF3E7A]/10 transition-colors">
              <ArrowUpRight size={14} /> Collab With Us
            </a>
          </div>
        </div>
      </section>
      )}

      {/* INSTAGRAM / UGC GALLERY ────────────────────────────── */}
      <section className="pb-0 pt-16 bg-gradient-to-b from-white to-[#FFF5FB] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-2">✦ #WearButterfly</p>
              <h2 className="font-display text-4xl sm:text-5xl text-obsidian">As Seen On Instagram</h2>
            </div>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 font-body text-sm text-mink-light hover:text-champagne transition-colors tracking-[0.12em] uppercase">Follow us <ArrowUpRight size={13} /></a>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
          {[
            "https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400&q=80",
            "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&q=80",
            "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
            "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80",
            "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80",
          ].map((src, i) => (
            <motion.div key={i} className="relative aspect-square group cursor-pointer overflow-hidden" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} data-cursor="View">
              <Image src={src} alt={`Instagram post ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/30 transition-colors flex items-center justify-center">
                <Star size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="white" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENTLY VIEWED ─────────────────────────────────────── */}
      <RecentlyViewed />

      {/* PERSONALIZED RECOMMENDATIONS ───────────────────────── */}
      <PersonalizedSection />

      {/* AS SEEN IN ──────────────────────────────────────────── */}
      <section className="py-14 bg-white border-y border-champagne/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <p className="text-center text-[10px] font-body text-champagne/60 tracking-[0.4em] uppercase mb-8">✦ As Featured In</p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-60">
            {["Vogue India", "Harper's Bazaar", "Femina", "Elle India", "Grazia", "Filmfare"].map((pub) => (
              <span key={pub} className="font-display text-xl text-mink tracking-wide hover:text-champagne transition-colors cursor-default">{pub}</span>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BUTTERFLY ────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-[#1A0E2E] via-[#0F0B08] to-[#1A0A14] overflow-hidden relative">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(255,62,122,0.10) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-[10px] font-body text-[#FFB800] tracking-[0.4em] uppercase mb-3">✦ The Butterfly Promise</p>
            <h2 className="font-display text-5xl sm:text-6xl text-white">Why <em className="text-[#FFB800]">Choose Us</em></h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "💎", title: "Premium Craftsmanship", desc: "Every piece is hand-inspected by our master artisans. We use only certified hypoallergenic materials that won't tarnish or fade." },
              { icon: "🚚", title: "Pan India Delivery", desc: "Free shipping above ₹999 to 26,000+ pincodes. Express delivery available in Mumbai, Delhi, Bengaluru & 50+ cities." },
              { icon: "♻️", title: "7-Day Easy Returns", desc: "Not satisfied? Return or exchange within 7 days, no questions asked. Full refund or store credit — your choice." },
              { icon: "🔒", title: "100% Secure Payments", desc: "Powered by Razorpay. Pay via UPI, Netbanking, Cards, Wallets or Cash on Delivery. 3D Secure on all transactions." },
              { icon: "🎁", title: "Luxury Gift Packaging", desc: "Every order arrives in our signature black box with gold foil, satin ribbon and a handwritten greeting card." },
              { icon: "💬", title: "24/7 WhatsApp Support", desc: "Talk to our styling experts on WhatsApp anytime. Personalised recommendations for every occasion and budget." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="group bg-white/5 border border-white/10 hover:border-champagne/30 rounded-2xl p-6 transition-all hover:bg-white/8 hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                <span className="text-3xl block mb-4">{item.icon}</span>
                <h3 className="font-body text-sm font-bold text-ivory mb-2">{item.title}</h3>
                <p className="text-xs font-body text-ivory/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER ──────────────────────────────────────────── */}
      <NewsletterSection />
    </>
  );
}

function PersonalizedSection() {
  const [mounted, setMounted] = useState(false);
  const { items: recentlyViewed } = useRecentlyViewedStore();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Get category slugs from recently viewed; fallback to featured
  const viewedCategorySlugs = [...new Set(recentlyViewed.map(p => p.categorySlug))];
  const picks = viewedCategorySlugs.length > 0
    ? PRODUCTS.filter(p =>
        viewedCategorySlugs.includes(p.categorySlug) &&
        !recentlyViewed.find(r => r.id === p.id)
      ).slice(0, 4)
    : PRODUCTS.filter(p => p.featured).slice(0, 4);

  if (picks.length < 2) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-violet-50 via-ivory to-rose-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-[10px] font-body text-[#7C3AED] tracking-[0.4em] uppercase mb-2">✦ Just For You</p>
            <h3 className="font-display text-3xl sm:text-4xl text-obsidian">
              {viewedCategorySlugs.length > 0 ? "Based on Your Browsing" : "Curated Top Picks"}
            </h3>
          </div>
          <Link href="/products" className="text-xs font-body text-mink-light hover:text-champagne transition-colors tracking-wider uppercase flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {picks.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlashSaleBar() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Flash sale ends at midnight today
    const calcTime = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 0);
      const diff = end.getTime() - now.getTime();
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calcTime();
    const t = setInterval(calcTime, 1000);
    return () => clearInterval(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#7C3AED] via-[#FF3E7A] to-[#FFB800] overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)" }} />
      <div className="relative max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-body font-bold tracking-wider">⚡ FLASH SALE — Extra 10% OFF Sitewide</span>
          <span className="text-white/70 text-xs font-body hidden sm:inline">Use code:</span>
          <code className="bg-white/20 border border-white/30 text-white text-xs font-mono font-bold px-2 py-0.5 rounded tracking-wider">FLASH10</code>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white/70 text-[10px] font-body tracking-wider uppercase">Ends in:</span>
          {[
            { val: timeLeft.h, label: "hr" },
            { val: timeLeft.m, label: "min" },
            { val: timeLeft.s, label: "sec" },
          ].map(({ val, label }, i) => (
            <div key={label} className="flex items-center gap-1">
              <span className="bg-white/20 text-white font-mono font-bold text-sm px-2 py-0.5 rounded min-w-[2rem] text-center">
                {String(val).padStart(2, "0")}
              </span>
              <span className="text-white/60 text-[9px] font-body">{label}</span>
              {i < 2 && <span className="text-white/60 font-bold">:</span>}
            </div>
          ))}
        </div>
        <Link href="/products" className="hidden sm:inline-flex items-center gap-1 bg-white text-[#FF3E7A] text-xs font-body font-bold px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors">
          Shop Now <ArrowRight size={12} />
        </Link>
        <button onClick={() => setVisible(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
          <span className="text-lg leading-none">×</span>
        </button>
      </div>
    </div>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="py-28 bg-gradient-to-br from-obsidian via-mink to-obsidian relative overflow-hidden">
      <motion.div className="absolute top-10 left-10 opacity-5" animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }}>
        <ButterflyIcon size={200} />
      </motion.div>
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-4">✦ Inner Circle</p>
          <h2 className="font-display text-5xl sm:text-6xl text-ivory leading-tight">Stay in the<br /><em className="text-champagne">Butterfly</em> Loop</h2>
          <p className="mt-6 font-body text-ivory/55 text-sm leading-relaxed">Be the first to discover new collections, exclusive offers, and styling inspiration. No spam. Only beauty.</p>
          {!done ? (
            <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" required className="flex-1 bg-white/10 border border-white/20 text-ivory placeholder-ivory/40 rounded-full px-5 py-3 font-body text-sm focus:outline-none focus:border-champagne/60 transition-colors" />
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-champagne to-champagne-dark text-white font-body text-sm tracking-[0.12em] uppercase rounded-full hover:shadow-luxury transition-shadow whitespace-nowrap">Subscribe</button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 flex items-center justify-center gap-3">
              <ButterflyIcon size={24} />
              <p className="font-display text-xl text-champagne">Welcome to the Butterfly family!</p>
            </motion.div>
          )}
          <p className="mt-4 text-[10px] font-body text-ivory/30 tracking-wider">Join 12,000+ subscribers. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}
