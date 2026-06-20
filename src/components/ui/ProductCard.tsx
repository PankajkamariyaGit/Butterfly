"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/data";
import { useCartStore, useWishlistStore } from "@/store";
import { Badge } from "./Badge";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type ProductCardProps = {
  product: Product;
  view?: "grid" | "list";
};

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const wishlisted = isWishlisted(product.id);
  const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart`, {
      icon: "🛍️",
      style: {
        background: "#FDFBF7",
        color: "#1A1409",
        border: "1px solid #C9A84C",
        fontFamily: "Jost, sans-serif",
        fontSize: "0.85rem",
      },
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist ♡", {
      style: {
        background: "#FDFBF7",
        color: "#1A1409",
        border: "1px solid #B76E79",
        fontFamily: "Jost, sans-serif",
        fontSize: "0.85rem",
      },
    });
  };

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-sm overflow-hidden flex gap-0"
      >
        <div className="relative w-48 h-48 flex-shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.badge && (
            <div className="absolute top-3 left-3">
              <Badge label={product.badge} />
            </div>
          )}
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-body text-mink-light tracking-widest uppercase mb-1">
              {product.category}
            </p>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-display text-xl text-obsidian hover:text-champagne transition-colors">
                {product.name}
              </h3>
            </Link>
            <StarRating rating={product.rating} count={product.reviewCount} className="mt-2" />
            <p className="text-sm font-body text-mink-light mt-2 line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl text-champagne">
                ₹{product.discountPrice.toLocaleString()}
              </span>
              <span className="text-sm font-body text-mink-light line-through">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-xs font-body text-rose-gold font-semibold">{discount}% off</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleWishlist}
                className={cn(
                  "p-2 rounded-sm border transition-all",
                  wishlisted
                    ? "border-rose-gold text-rose-gold bg-blush"
                    : "border-champagne/30 text-mink-light hover:border-rose-gold hover:text-rose-gold"
                )}
              >
                <Heart size={18} className={wishlisted ? "fill-rose-gold" : ""} />
              </button>
              <button
                onClick={handleAddToCart}
                className="btn-luxury flex items-center gap-2 py-2"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-pearl rounded-sm overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500 hover:-translate-y-1"
      onMouseEnter={() => { setHovered(true); setImgIdx(1); }}
      onMouseLeave={() => { setHovered(false); setImgIdx(0); }}
    >
      {/* Product Image — entire area is a link to product detail */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-ivory-dark cursor-pointer">
        <AnimatePresence mode="wait">
          <motion.div
            key={imgIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={product.images[imgIdx] ?? product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && <Badge label={product.badge} />}
          {discount >= 15 && (
            <span className="bg-rose-gold text-white text-[10px] font-body font-semibold tracking-wider uppercase px-2 py-1 rounded-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
            wishlisted
              ? "bg-rose-gold text-white shadow-luxury"
              : "bg-white/80 text-mink-light hover:bg-rose-gold hover:text-white backdrop-blur-sm"
          )}
        >
          <Heart size={16} className={wishlisted ? "fill-white" : ""} />
        </button>

        {/* Quick actions — always visible on mobile, hover-only on desktop */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-3 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-200">
          <button
            onClick={e => { e.preventDefault(); handleAddToCart(e); }}
            className="flex-1 bg-obsidian/85 backdrop-blur-sm text-white text-[10px] font-body tracking-widest uppercase py-2.5 rounded-sm hover:bg-champagne transition-colors duration-200 flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
          <div className="w-10 bg-white/90 backdrop-blur-sm text-obsidian rounded-sm hover:bg-champagne hover:text-white transition-colors duration-200 flex items-center justify-center">
            <Eye size={14} />
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-[10px] font-body text-mink-light tracking-widest uppercase mb-1">
          {product.category}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-base text-obsidian leading-tight hover:text-champagne transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} size={12} className="mt-2" />
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-display text-lg text-champagne font-semibold">
            ₹{product.discountPrice.toLocaleString()}
          </span>
          <span className="text-xs font-body text-mink-light line-through">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Gold border on hover */}
      <div className="absolute inset-0 rounded-sm border-2 border-transparent group-hover:border-champagne/30 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
}
