"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ShoppingBag, Zap, ChevronRight, Package, Truck, RotateCcw,
  Shield, Plus, Minus, Share2, ChevronDown, Sparkles, Gift, Eye, Star,
} from "lucide-react";
import { PRODUCTS, REVIEWS } from "@/lib/data";
import { useCartStore, useWishlistStore } from "@/store";
import { useRecentlyViewedStore } from "@/store";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import ExpressCheckout from "@/components/ui/ExpressCheckout";

import { use } from "react";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const reviews = REVIEWS.filter((r) => r.productId === product.id && r.approved);
  const related = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  const [giftWrap, setGiftWrap] = useState(false);
  const [virtualTryOn, setVirtualTryOn] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showExpressCheckout, setShowExpressCheckout] = useState(false);
  const [viewingCount, setViewingCount] = useState(0);

  // Simulate live viewer count — 15s interval to keep page stable/clickable
  useEffect(() => {
    const base = 4 + (parseInt(product.id.replace(/\D/g, "") || "1", 10) % 18);
    setViewingCount(base);
    const interval = setInterval(() => {
      setViewingCount(v => Math.max(3, v + (Math.random() > 0.55 ? 1 : -1)));
    }, 15000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const { addItem: addRecentlyViewed } = useRecentlyViewedStore();
  const wishlisted = isWishlisted(product.id);

  // Track this product as recently viewed
  useEffect(() => {
    addRecentlyViewed(product);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const discount = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart!`, {
      icon: "🛍️",
      style: {
        background: "#FDFBF7",
        color: "#1A1409",
        border: "1px solid #C9A84C",
        fontFamily: "Jost, sans-serif",
      },
    });
  };

  const handleBuyNow = () => {
    setShowExpressCheckout(true);
  };

  const ACCORDION_ITEMS = [
    {
      id: "details",
      label: "Product Details",
      content: (
        <div className="space-y-2 text-sm font-body text-mink-light leading-relaxed">
          <p>{product.description}</p>
          <p>
            <span className="text-mink font-medium">Material:</span> {product.material}
          </p>
          <p>
            <span className="text-mink font-medium">SKU:</span> {product.sku}
          </p>
          <p>
            <span className="text-mink font-medium">Category:</span> {product.category}
          </p>
        </div>
      ),
    },
    {
      id: "care",
      label: "Care Instructions",
      content: (
        <p className="text-sm font-body text-mink-light leading-relaxed">
          {product.careInstructions}
        </p>
      ),
    },
    {
      id: "delivery",
      label: "Delivery & Returns",
      content: (
        <div className="space-y-3">
          {[
            { icon: Truck, label: "Standard Delivery", sub: "3–5 business days · Free above ₹999" },
            { icon: Package, label: "Express Delivery", sub: "1–2 business days · ₹149 extra" },
            { icon: RotateCcw, label: "Easy Returns", sub: "7-day hassle-free returns" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex gap-3">
              <Icon size={16} className="text-champagne mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-body text-mink font-medium">{label}</p>
                <p className="text-xs font-body text-mink-light">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
    <div className="min-h-screen bg-ivory">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 text-xs font-body text-mink-light">
          <Link href="/" className="hover:text-champagne transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-champagne transition-colors">Collections</Link>
          <ChevronRight size={12} />
          <Link
            href={`/products?category=${product.categorySlug}`}
            className="hover:text-champagne transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-mink line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* ── Image Gallery ── */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails + Video Tab */}
            <div className="flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedImage(i); setShowVideo(false); }}
                  className={cn(
                    "relative w-16 h-16 sm:w-20 sm:h-20 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-all",
                    selectedImage === i && !showVideo
                      ? "border-champagne shadow-luxury"
                      : "border-transparent hover:border-champagne/40"
                  )}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={cn(
                    "relative w-16 h-16 sm:w-20 sm:h-20 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-all bg-obsidian flex items-center justify-center",
                    showVideo ? "border-rose-500 shadow-luxury" : "border-transparent hover:border-rose-400/40"
                  )}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-white text-lg">▶</span>
                    <span className="text-white text-[8px] font-body">Video</span>
                  </div>
                </button>
              )}
            </div>

            {/* Main Image / Video */}
            <div className="flex-1 relative aspect-square rounded-sm overflow-hidden bg-ivory-dark shadow-luxury-lg">
              {showVideo && product.videoUrl ? (
                <iframe
                  src={product.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${product.name} product video`}
                />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && <Badge label={product.badge} />}
                {discount >= 15 && (
                  <span className="bg-rose-gold text-white text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-sm">
                    -{discount}% Off
                  </span>
                )}
              </div>

              <button
                onClick={() => toggle(product)}
                className={cn(
                  "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-luxury",
                  wishlisted ? "bg-rose-gold text-white" : "bg-white text-mink-light hover:bg-rose-gold hover:text-white"
                )}
              >
                <Heart size={18} className={wishlisted ? "fill-white" : ""} />
              </button>
            </div>
          </div>

          {/* ── Product Info ── */}
          <div>
            <p className="text-xs font-body text-champagne tracking-[0.25em] uppercase mb-2">
              {product.category}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-obsidian leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <StarRating
                rating={product.rating}
                count={product.reviewCount}
                showValue
              />
              <span className="text-xs font-body text-mink-light">
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                  ? `Only ${product.stock} left!`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Social proof + urgency bar */}
            <div className="flex flex-wrap items-center gap-3 mb-5 px-3 py-2.5 bg-rose-50 border border-rose-100 rounded-lg">
              <span className="flex items-center gap-1.5 text-xs font-body text-rose-600">
                <Eye size={13} className="text-rose-500" />
                <motion.span
                  key={viewingCount}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-bold"
                >
                  {viewingCount}
                </motion.span>
                {" "}people viewing this right now
              </span>
              {product.stock <= 10 && product.stock > 0 && (
                <span className="flex items-center gap-1 text-xs font-body text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  🔥 Only {product.stock} left at this price
                </span>
              )}
            </div>

            {/* Estimated delivery */}
            <div className="flex items-center gap-2 mb-6 text-xs font-body text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              <Truck size={13} className="text-green-600 flex-shrink-0" />
              <span>
                <span className="font-semibold">Free delivery</span> by{" "}
                <span className="font-semibold">
                  {(() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 6);
                    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
                  })()}
                </span>
                {" "}if ordered in the next{" "}
                <span className="font-semibold text-rose-600">
                  {/* Countdown to midnight */}
                  {(() => {
                    const now = new Date();
                    const midnight = new Date(now);
                    midnight.setHours(23, 59, 59, 0);
                    const diff = midnight.getTime() - now.getTime();
                    const h = Math.floor(diff / 3600000);
                    const m = Math.floor((diff % 3600000) / 60000);
                    return `${h}h ${m}m`;
                  })()}
                </span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-champagne/15">
              <span className="font-display text-4xl text-champagne">
                ₹{product.discountPrice.toLocaleString()}
              </span>
              <span className="text-lg font-body text-mink-light line-through">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-sm font-body text-rose-gold font-semibold">
                {discount}% OFF
              </span>
            </div>

            {/* Short description */}
            <p className="text-sm font-body text-mink-light leading-relaxed mb-8">
              {product.description.slice(0, 160)}...
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-6 mb-6">
              <span className="text-xs font-body text-mink tracking-widest uppercase">
                Quantity
              </span>
              <div className="flex items-center border border-champagne/30 rounded-sm overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-mink hover:bg-ivory-dark transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-body font-medium text-obsidian">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-mink hover:bg-ivory-dark transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                size="lg"
                className="flex-1"
                disabled={product.stock === 0}
              >
                <ShoppingBag size={16} />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="flex-1"
                disabled={product.stock === 0}
              >
                <Zap size={16} />
                Buy Now
              </Button>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Shield, label: "Authentic", sub: "100% genuine" },
                { icon: Truck, label: "Free Shipping", sub: "Above ₹999" },
                { icon: RotateCcw, label: "7-Day Return", sub: "Easy returns" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center p-3 bg-pearl rounded-sm"
                >
                  <Icon size={18} className="text-champagne mb-1.5" />
                  <p className="text-xs font-body font-semibold text-obsidian">{label}</p>
                  <p className="text-[10px] font-body text-mink-light">{sub}</p>
                </div>
              ))}
            </div>

        {/* Gift Wrapping Option */}
        <div className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${giftWrap ? "border-champagne bg-champagne/5" : "border-champagne/20 hover:border-champagne/40"}`} onClick={() => setGiftWrap(!giftWrap)}>
          <div className="flex items-center gap-3">
            <Gift size={18} className="text-champagne" />
            <div>
              <p className="font-body text-sm font-semibold text-obsidian">Add Gift Wrapping</p>
              <p className="font-body text-[10px] text-mink-light">Signature box, satin ribbon & personalised card (+₹149)</p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${giftWrap ? "border-champagne bg-champagne" : "border-champagne/30"}`}>
            {giftWrap && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
        </div>

        {/* Virtual Try-On Button */}
        <Link href="/virtual-try-on" className="flex items-center gap-3 p-4 rounded-xl border border-champagne/20 hover:border-champagne/50 hover:bg-champagne/5 transition-all group">
          <Eye size={18} className="text-champagne" />
          <div className="flex-1">
            <p className="font-body text-sm font-semibold text-obsidian">Virtual Try-On</p>
            <p className="font-body text-[10px] text-mink-light">See how this looks on you with AR</p>
          </div>
          <Sparkles size={14} className="text-champagne/50 group-hover:text-champagne transition-colors" />
        </Link>

            {/* Accordion */}
            <div className="space-y-2">
              {ACCORDION_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="border border-champagne/20 rounded-sm overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === item.id ? null : item.id)
                    }
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-xs font-body font-semibold tracking-widest uppercase text-mink">
                      {item.label}
                    </span>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "text-champagne transition-transform duration-300",
                        openAccordion === item.id && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openAccordion === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-champagne/10">
                          <div className="pt-4">{item.content}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Product Story ── */}
        <section className="mt-20 bg-gradient-to-br from-pearl to-ivory rounded-3xl p-8 md:p-12 border border-champagne/10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-4">✦ The Story Behind This Piece</p>
              <h2 className="font-display text-3xl sm:text-4xl text-obsidian leading-tight">
                Designed for Women Who Love Timeless Elegance
              </h2>
              <div className="mt-5 w-12 h-px bg-champagne" />
              <p className="mt-5 font-body text-mink-light text-sm leading-relaxed">
                {product.name} was inspired by the grace of traditional Indian craftsmanship, reimagined for the modern woman. Each element — from the delicate filigree to the lustrous finish — is chosen to create a piece that feels as beautiful to wear as it looks.
              </p>
              <p className="mt-4 font-body text-mink-light text-sm leading-relaxed">
                This piece shines brightest at <strong className="text-obsidian">weddings, festive gatherings, and special celebrations</strong>. Pair it with a silk saree, lehenga, or even an elegant evening gown for maximum impact.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Wedding", "Festive", "Party", "Occasion"].map((occ) => (
                  <span key={occ} className="px-3 py-1 bg-champagne/10 text-champagne text-[10px] font-body tracking-wider rounded-full border border-champagne/20">{occ}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "✦", label: "Design Inspiration", desc: "Traditional Indian art meets contemporary minimalism" },
                { icon: "◆", label: "Materials", desc: product.material },
                { icon: "♦", label: "Occasion", desc: "Weddings, festivals, celebrations & gifting" },
                { icon: "✧", label: "Care", desc: "Store in provided pouch. Avoid moisture & perfume." },
              ].map((item) => (
                <div key={item.label} className="bg-white/70 rounded-2xl p-4 border border-champagne/10">
                  <span className="text-champagne text-lg">{item.icon}</span>
                  <p className="font-body text-xs font-semibold text-obsidian mt-2 mb-1">{item.label}</p>
                  <p className="font-body text-[10px] text-mink-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Complete the Look ── */}
        <section className="mt-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-2">✦ Style It Right</p>
              <h2 className="font-display text-3xl sm:text-4xl text-obsidian">Complete the Look</h2>
            </div>
          </div>
          <div className="bg-pearl rounded-3xl p-6 md:p-8 border border-champagne/10">
            <p className="font-body text-sm text-mink-light mb-5">Wear it with these perfectly matched pieces:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PRODUCTS.filter((p) => p.id !== product.id && p.categorySlug !== product.categorySlug).slice(0, 4).map((p, i) => {
                const bundleLabels = ["Matching Earrings", "Statement Necklace", "Bangles Set", "Cocktail Ring"];
                return (
                  <div key={p.id} className="group">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-ivory mb-3">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/10 transition-colors" />
                    </div>
                    <p className="font-body text-[9px] text-champagne tracking-[0.2em] uppercase">{bundleLabels[i]}</p>
                    <p className="font-body text-xs font-medium text-obsidian mt-0.5 line-clamp-1">{p.name}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="font-body text-xs text-champagne">₹{p.discountPrice.toLocaleString()}</p>
                      <button onClick={() => { useCartStore.getState().addItem(p, 1); toast.success("Added!"); }} className="text-[9px] font-body text-champagne border border-champagne/30 px-2 py-0.5 rounded-full hover:bg-champagne/10 transition-colors">+ Add</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-5 border-t border-champagne/15 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-body text-xs text-mink-light">Buy all 5 pieces together</p>
                <p className="font-body text-sm font-semibold text-obsidian mt-0.5">Save 15% on the complete look bundle</p>
              </div>
              <button className="px-5 py-2.5 bg-gradient-to-r from-champagne to-champagne-dark text-white font-body text-xs tracking-[0.15em] uppercase rounded-full hover:shadow-luxury transition-shadow">
                Buy Complete Look
              </button>
            </div>
          </div>
        </section>

        {/* ── Reviews ── */}
        {reviews.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
              <h2 className="font-display text-3xl text-obsidian">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-display text-4xl text-champagne">{product.rating.toFixed(1)}</p>
                  <StarRating rating={product.rating} size={12} className="justify-center" />
                  <p className="text-[10px] font-body text-mink-light mt-0.5">{product.reviewCount} reviews</p>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="glass-card rounded-2xl p-6 flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-luxury flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-body font-semibold text-obsidian">{review.user}</p>
                          {review.verifiedPurchase && (
                            <span className="text-[9px] font-body text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full">✓ Verified</span>
                          )}
                        </div>
                        <p className="text-[10px] font-body text-mink-light">
                          {review.city && <span>{review.city} · </span>}
                          {new Date(review.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={12} />
                  </div>

                  {/* Comment */}
                  <p className="text-sm font-body text-mink leading-relaxed italic flex-1">
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  {/* Customer photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {review.photos.map((photo, pi) => (
                        <div key={pi} className="relative w-16 h-16 rounded-lg overflow-hidden border border-champagne/20">
                          <Image src={photo} alt={`Review photo ${pi + 1}`} fill className="object-cover" unoptimized />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Video review */}
                  {review.videoUrl && (
                    <div className="rounded-xl overflow-hidden aspect-video bg-obsidian/5">
                      <iframe
                        src={review.videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Video review by ${review.user}`}
                      />
                    </div>
                  )}

                  {/* Helpful */}
                  {(review.helpfulCount ?? 0) > 0 && (
                    <p className="text-[10px] font-body text-mink-light/60">
                      👍 {review.helpfulCount} people found this helpful
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl text-obsidian mb-8">
              You May Also Love
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>

    {/* Express Checkout Modal */}
    {showExpressCheckout && (
      <ExpressCheckout
        product={product}
        quantity={quantity}
        onClose={() => setShowExpressCheckout(false)}
      />
    )}
  </>
  );
}
