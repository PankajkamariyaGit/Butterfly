"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useRecentlyViewedStore } from "@/store";
import { ProductCard } from "@/components/ui/ProductCard";

export default function RecentlyViewed() {
  const [mounted, setMounted] = useState(false);
  const { items } = useRecentlyViewedStore();

  useEffect(() => setMounted(true), []);

  if (!mounted || items.length < 2) return null;

  const display = items.slice(0, 4);

  return (
    <section className="py-16 bg-ivory border-t border-champagne/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3 mb-8">
          <Clock size={16} className="text-champagne" />
          <div>
            <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase">Recently Viewed</p>
            <h3 className="font-display text-2xl text-obsidian">Pick Up Where You Left Off</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {display.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
