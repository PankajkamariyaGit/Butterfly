"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore, useCartStore } from "@/store";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { ButterflyIcon } from "@/components/ui/ButterflyLogo";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const moveAllToCart = () => {
    items.forEach((p) => addItem(p));
    toast.success("All items added to cart! 🛍️", {
      style: { background: "#FDFBF7", color: "#1A1409", border: "1px solid #C9A84C", fontFamily: "Jost, sans-serif" },
    });
  };

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs font-body text-champagne tracking-[0.3em] uppercase mb-1">✦ Saved</p>
            <h1 className="font-display text-4xl text-obsidian">My Wishlist</h1>
          </div>
          {items.length > 0 && (
            <Button onClick={moveAllToCart} variant="outline">
              <ShoppingBag size={16} /> Move All to Cart
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <ButterflyIcon size={80} className="mx-auto mb-6 opacity-25" />
            <h2 className="font-display text-3xl text-obsidian mb-3">Your wishlist is empty</h2>
            <p className="text-sm font-body text-mink-light mb-8">
              Save your favourite pieces and come back to them anytime.
            </p>
            <Link href="/products"><Button size="lg"><Heart size={16} /> Explore Collections</Button></Link>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
