"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Sparkles, ArrowRight, RefreshCcw, Eye } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import Link from "next/link";

const TRY_ON_PRODUCTS = PRODUCTS.slice(0, 6);

export default function VirtualTryOnPage() {
  const [mode, setMode] = useState<"idle" | "upload" | "camera" | "result">("idle");
  const [selected, setSelected] = useState(TRY_ON_PRODUCTS[0]);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setMode("result");
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="relative py-28 overflow-hidden bg-gradient-to-br from-obsidian via-mink to-obsidian text-center">
        <motion.div className="absolute inset-0 opacity-5" animate={{ rotate: [0, 360] }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-champagne/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-champagne/20" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Eye size={16} className="text-champagne" />
            <span className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase">Powered by AR Technology</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-ivory">
            Virtual <em className="text-champagne">Try-On</em>
          </h1>
          <p className="mt-4 font-body text-ivory/55 text-base max-w-xl mx-auto leading-relaxed">
            See how Butterfly jewellery looks on you — before you buy. Upload your photo or use live camera to preview any piece.
          </p>
        </motion.div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Try-On Area */}
          <div>
            <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-5">✦ Try-On Studio</p>

            <AnimatePresence mode="wait">
              {mode === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl border-2 border-dashed border-champagne/30 bg-pearl aspect-[3/4] flex flex-col items-center justify-center gap-6 p-8 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-champagne/10 flex items-center justify-center">
                    <Camera size={32} className="text-champagne/60" />
                  </div>
                  <div>
                    <p className="font-display text-2xl text-obsidian">Choose Your Method</p>
                    <p className="font-body text-xs text-mink-light mt-2">Upload a selfie or use live camera</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-champagne/15 border border-champagne/30 rounded-xl font-body text-sm text-champagne hover:bg-champagne/20 transition-colors"
                    >
                      <Upload size={15} /> Upload Photo
                    </button>
                    <button
                      onClick={() => setMode("camera")}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-champagne to-champagne-dark text-white rounded-xl font-body text-sm hover:opacity-90 transition-opacity"
                    >
                      <Camera size={15} /> Live Camera
                    </button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </motion.div>
              )}

              {mode === "camera" && (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl overflow-hidden bg-obsidian aspect-[3/4] flex flex-col items-center justify-center gap-4 text-center p-8"
                >
                  <div className="w-20 h-20 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center animate-pulse">
                    <Camera size={32} className="text-champagne" />
                  </div>
                  <p className="font-display text-2xl text-ivory">Camera Access</p>
                  <p className="font-body text-xs text-ivory/50 max-w-xs">
                    Live camera AR try-on is coming soon! This feature is currently in beta and will be available in the next update. For now, please upload a photo.
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-champagne animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-champagne animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-2 h-2 rounded-full bg-champagne animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                  <button onClick={() => { fileRef.current?.click(); setMode("idle"); }} className="mt-2 px-5 py-2.5 border border-champagne/40 text-champagne font-body text-xs tracking-wider uppercase rounded-full hover:bg-champagne/10 transition-colors">
                    Upload Instead
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </motion.div>
              )}

              {mode === "result" && preview && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl overflow-hidden relative aspect-[3/4]"
                >
                  <Image src={preview} alt="Your photo" fill className="object-cover" />
                  {/* AR overlay simulation */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-3/4 max-w-[200px]">
                      <div className="relative w-full aspect-square opacity-70 mix-blend-multiply">
                        <Image src={selected.images[0]} alt={selected.name} fill className="object-contain drop-shadow-xl" />
                      </div>
                    </div>
                    {/* AR detection dots */}
                    <div className="absolute top-[18%] left-1/2 -translate-x-1/2 flex gap-8">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-champagne" animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }} />
                      ))}
                    </div>
                    {/* Corner brackets */}
                    {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((cls, i) => (
                      <div key={i} className={`absolute w-8 h-8 ${cls} border-champagne/60`} />
                    ))}
                  </div>
                  {/* Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <button onClick={() => { setMode("idle"); setPreview(null); }} className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                      <RefreshCcw size={16} className="text-white" />
                    </button>
                    <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <p className="text-[10px] font-body text-white tracking-wider">AR Preview Active</p>
                    </div>
                    <div className="w-10" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Try-On features */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: "🔍", label: "Face Detection", status: "Active" },
                { icon: "💎", label: "AR Overlay", status: "Beta" },
                { icon: "📸", label: "Save Look", status: "Available" },
              ].map((f) => (
                <div key={f.label} className="bg-pearl border border-champagne/15 rounded-xl p-3 text-center">
                  <span className="text-xl">{f.icon}</span>
                  <p className="font-body text-[10px] font-semibold text-obsidian mt-1">{f.label}</p>
                  <span className="text-[9px] font-body text-champagne/70">{f.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Selector */}
          <div>
            <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-5">✦ Select Jewellery to Try</p>
            <div className="grid grid-cols-2 gap-3">
              {TRY_ON_PRODUCTS.map((product) => (
                <motion.button
                  key={product.id}
                  onClick={() => setSelected(product)}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 text-left ${
                    selected.id === product.id ? "border-champagne shadow-luxury" : "border-transparent"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative aspect-square bg-pearl">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    {selected.id === product.id && (
                      <div className="absolute inset-0 bg-champagne/10 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-champagne flex items-center justify-center">
                          <Eye size={14} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 bg-white">
                    <p className="font-body text-[10px] font-semibold text-obsidian leading-tight truncate">{product.name}</p>
                    <p className="font-body text-[10px] text-champagne mt-0.5">₹{product.discountPrice.toLocaleString()}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Selected product detail */}
            <div className="mt-6 bg-pearl border border-champagne/15 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={selected.images[0]} alt={selected.name} width={56} height={56} className="object-cover w-full h-full" />
                </div>
                <div>
                  <p className="font-display text-base text-obsidian">{selected.name}</p>
                  <p className="font-body text-xs text-champagne">₹{selected.discountPrice.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setMode("idle")}
                  className="flex-1 py-2.5 bg-gradient-to-r from-champagne to-champagne-dark text-white rounded-xl font-body text-xs tracking-wider uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={12} /> Try This On
                </button>
                <Link href={`/products/${selected.slug}`} className="flex-1 py-2.5 border border-champagne/30 text-champagne rounded-xl font-body text-xs tracking-wider uppercase hover:bg-champagne/10 transition-colors flex items-center justify-center gap-1.5">
                  View <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
