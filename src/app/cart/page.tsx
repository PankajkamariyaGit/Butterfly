"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, Tag, ArrowRight, Trash2 } from "lucide-react";
import { useCartStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { COUPONS, PRODUCTS } from "@/lib/data";
import { ButterflyIcon } from "@/components/ui/ButterflyLogo";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, addItem } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<(typeof COUPONS)[0] | null>(null);

  // Cross-sell: products not already in cart, from related categories
  const cartProductIds = new Set(items.map(i => i.product.id));
  const crossSellProducts = PRODUCTS
    .filter(p => !cartProductIds.has(p.id) && p.active && p.stock > 0)
    .slice(0, 4);

  const sub = subtotal();
  const shipping = sub >= 999 ? 0 : 99;
  const discount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? Math.round((sub * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;
  const total = sub + shipping - discount;

  const applyCoupon = () => {
    const coupon = COUPONS.find(
      (c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.active
    );
    if (!coupon) {
      toast.error("Invalid coupon code", { style: { fontFamily: "Jost, sans-serif" } });
      return;
    }
    if (sub < coupon.minOrderValue) {
      toast.error(`Minimum order ₹${coupon.minOrderValue} required`, {
        style: { fontFamily: "Jost, sans-serif" },
      });
      return;
    }
    setAppliedCoupon(coupon);
    toast.success(`Coupon "${coupon.code}" applied! You saved ₹${
      coupon.type === "percentage"
        ? Math.round((sub * coupon.value) / 100)
        : coupon.value
    }`, {
      icon: "🎉",
      style: {
        background: "#FDFBF7",
        color: "#1A1409",
        border: "1px solid #C9A84C",
        fontFamily: "Jost, sans-serif",
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-ivory">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <ButterflyIcon size={80} className="mx-auto mb-6 opacity-30" />
          <h2 className="font-display text-3xl text-obsidian mb-3">Your cart is empty</h2>
          <p className="text-sm font-body text-mink-light mb-8">
            Discover our exquisite jewellery collections and add your favourites.
          </p>
          <Link href="/products">
            <Button size="lg">
              <ShoppingBag size={16} /> Shop Now
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-4xl text-obsidian mb-2">Shopping Cart</h1>
        <p className="text-sm font-body text-mink-light mb-10">
          {items.length} item{items.length > 1 ? "s" : ""} in your cart
        </p>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map(({ product, quantity }) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-sm p-4 sm:p-5 flex gap-4 sm:gap-6"
                >
                  <Link href={`/products/${product.slug}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-sm overflow-hidden bg-pearl">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-body text-mink-light tracking-widest uppercase">
                          {product.category}
                        </p>
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-display text-lg text-obsidian leading-tight hover:text-champagne transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-mink-light hover:text-rose-gold transition-colors flex-shrink-0 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      {/* Quantity */}
                      <div className="flex items-center border border-champagne/25 rounded-sm overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-ivory-dark text-mink transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-body text-obsidian">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-ivory-dark text-mink transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-display text-xl text-champagne">
                          ₹{(product.discountPrice * quantity).toLocaleString()}
                        </p>
                        {quantity > 1 && (
                          <p className="text-xs font-body text-mink-light">
                            ₹{product.discountPrice.toLocaleString()} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={() => { clearCart(); toast.success("Cart cleared"); }}
              className="flex items-center gap-2 text-xs font-body text-mink-light hover:text-rose-gold transition-colors mt-2"
            >
              <Trash2 size={14} /> Clear cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-sm p-6 sticky top-28">
              <h2 className="font-display text-2xl text-obsidian mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-xs font-body text-mink tracking-widest uppercase block mb-2">
                  Coupon Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-champagne/10 border border-champagne/30 rounded-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-champagne" />
                      <span className="text-sm font-body font-semibold text-champagne">
                        {appliedCoupon.code}
                      </span>
                    </div>
                    <button
                      onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}
                      className="text-xs text-rose-gold hover:text-rose-gold-dark"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-0">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="luxury-input rounded-r-none flex-1 text-sm py-2.5"
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-champagne text-white px-4 text-xs font-body font-semibold tracking-widest uppercase hover:bg-champagne-dark transition-colors rounded-r-sm"
                    >
                      Apply
                    </button>
                  </div>
                )}
                <p className="text-[10px] font-body text-mink-light mt-1.5">
                  Try: BUTTERFLY20 · WELCOME200 · BRIDAL15
                </p>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 pb-5 border-b border-champagne/15">
                <div className="flex justify-between text-sm font-body text-mink">
                  <span>Subtotal</span>
                  <span>₹{sub.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-body text-mink">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-body text-rose-gold">
                    <span>Discount</span>
                    <span>- ₹{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-5 mb-8">
                <span className="font-body font-semibold text-obsidian tracking-wider uppercase text-sm">
                  Total
                </span>
                <span className="font-display text-3xl text-champagne">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <Link href="/checkout">
                <Button fullWidth size="lg">
                  Proceed to Checkout <ArrowRight size={16} />
                </Button>
              </Link>

              <Link href="/products" className="block text-center mt-4 text-xs font-body text-mink-light hover:text-champagne transition-colors tracking-wider">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CROSS-SELL ─────────────────────────────────────────── */}
      {crossSellProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-20">
          <div className="border-t border-champagne/10 pt-12">
            <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-2">✦ You Might Also Love</p>
            <h3 className="font-display text-3xl text-obsidian mb-8">Complete Your Look</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {crossSellProducts.map((p) => (
                <div key={p.id} className="bg-pearl border border-champagne/10 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    {p.badge && (
                      <span className="absolute top-2 left-2 text-[9px] font-body font-bold bg-champagne text-white px-2 py-0.5 rounded-full">{p.badge}</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-body font-semibold text-obsidian truncate">{p.name}</p>
                    <p className="text-xs text-champagne font-bold mt-0.5">₹{p.discountPrice.toLocaleString()}</p>
                    <button
                      onClick={() => { addItem(p, 1); toast.success(`${p.name} added!`, { icon: "🛍️" }); }}
                      className="mt-2 w-full py-1.5 text-[10px] font-body font-semibold border border-champagne/30 text-champagne rounded-full hover:bg-champagne hover:text-white transition-colors"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
