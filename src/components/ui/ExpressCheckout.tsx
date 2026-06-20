"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, CheckCircle2, Truck, Shield, RotateCcw } from "lucide-react";
import { Product } from "@/lib/data";
import { useCartStore, useOrderStore, useAuthStore } from "@/store";
import Image from "next/image";
import toast from "react-hot-toast";

interface ExpressCheckoutProps {
  product: Product;
  quantity?: number;
  onClose: () => void;
}

const PAYMENT_OPTIONS = [
  { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when your order arrives" },
  { id: "upi", label: "UPI / PhonePe / GPay", icon: "📱", desc: "Instant payment" },
  { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, Rupay" },
  { id: "razorpay", label: "Razorpay (All methods)", icon: "🔒", desc: "Netbanking, Wallets & more" },
];

export default function ExpressCheckout({ product, quantity = 1, onClose }: ExpressCheckoutProps) {
  const { addOrder } = useOrderStore();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [step, setStep] = useState<"details" | "success">("details");
  const [payment, setPayment] = useState("cod");
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });

  const subtotal = product.discountPrice * quantity;
  const shipping = subtotal >= 999 ? 0 : 99;
  const gst = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + gst;

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    // Save order
    const orderId = `ORD-EXP-${Date.now()}`;
    addOrder({
      id: orderId,
      userId: user?.id ?? "guest",
      customerName: form.name,
      customerEmail: user?.email ?? "",
      items: [{ product, quantity }],
      status: "confirmed",
      paymentMethod: payment === "cod" ? "cod" : "razorpay",
      paymentStatus: payment === "cod" ? "pending" : "paid",
      shippingAddress: {
        id: `addr-${Date.now()}`,
        name: form.name,
        phone: form.phone,
        line1: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        isDefault: false,
      },
      subtotal,
      shipping,
      discount: 0,
      total,
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingId: "",
    });
    setStep("success");
    toast.success("Order placed successfully!", { icon: "🎉" });
  };

  const inputCls = "w-full border border-champagne/20 rounded-xl px-4 py-2.5 text-sm font-body text-obsidian focus:outline-none focus:border-champagne transition-colors bg-white placeholder:text-mink-light/40";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 40 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-champagne/10">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[#FF3E7A]" />
              <h2 className="font-display text-xl text-obsidian">Express Checkout</h2>
              <span className="text-[9px] font-body bg-green-100 text-green-700 px-2 py-0.5 rounded-full">1-Step</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center">
              <X size={14} />
            </button>
          </div>

          {step === "details" ? (
            <div className="p-6 space-y-5">
              {/* Product summary */}
              <div className="flex gap-4 p-4 bg-pearl rounded-2xl border border-champagne/10">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-semibold text-obsidian line-clamp-2">{product.name}</p>
                  <p className="text-xs font-body text-mink-light">Qty: {quantity}</p>
                  <p className="text-base font-display text-champagne mt-1">₹{total.toLocaleString()}</p>
                </div>
              </div>

              {/* Delivery details */}
              <div>
                <p className="text-[10px] font-body text-champagne tracking-[0.3em] uppercase mb-3">Delivery Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full Name *" className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="Mobile Number *" className={inputCls} type="tel" />
                  </div>
                  <div className="col-span-2">
                    <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="House / Flat, Street, Area *" className={inputCls} />
                  </div>
                  <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="City" className={inputCls} />
                  <input value={form.pincode} onChange={e => set("pincode", e.target.value)} placeholder="Pincode *" className={inputCls} maxLength={6} />
                  <div className="col-span-2">
                    <input value={form.state} onChange={e => set("state", e.target.value)} placeholder="State" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <p className="text-[10px] font-body text-champagne tracking-[0.3em] uppercase mb-3">Payment Method</p>
                <div className="space-y-2">
                  {PAYMENT_OPTIONS.map(opt => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${payment === opt.id ? "border-champagne bg-champagne/5" : "border-champagne/15 hover:border-champagne/30"}`}>
                      <input type="radio" value={opt.id} checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="accent-champagne" />
                      <span className="text-base">{opt.icon}</span>
                      <div>
                        <p className="text-xs font-body font-semibold text-obsidian">{opt.label}</p>
                        <p className="text-[10px] font-body text-mink-light">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-pearl rounded-2xl p-4 space-y-1.5 text-xs font-body">
                <div className="flex justify-between text-mink-light"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-mink-light"><span>Shipping</span><span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-mink-light"><span>GST (3%)</span><span>₹{gst}</span></div>
                <div className="flex justify-between font-bold text-obsidian text-sm pt-2 border-t border-champagne/15"><span>Total</span><span className="text-champagne">₹{total.toLocaleString()}</span></div>
              </div>

              {/* Trust */}
              <div className="flex items-center justify-center gap-5 text-[9px] font-body text-mink-light/60">
                {[Shield, Truck, RotateCcw].map((Icon, i) => (
                  <div key={i} className="flex items-center gap-1"><Icon size={10} />{["100% Secure", "Fast Delivery", "Easy Returns"][i]}</div>
                ))}
              </div>

              <button
                onClick={handleOrder}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF3E7A] via-[#FFB800] to-[#FF3E7A] text-white font-body font-bold tracking-wider text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
              >
                <Zap size={16} /> Place Order Now
              </button>
            </div>
          ) : (
            <div className="p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="font-display text-2xl text-obsidian mb-2">Order Placed!</h3>
              <p className="font-body text-sm text-mink-light mb-6">Your order has been confirmed. We&apos;ll send you updates via WhatsApp and SMS.</p>
              <div className="bg-pearl rounded-2xl p-4 mb-6 text-left">
                <p className="text-xs font-body font-semibold text-obsidian">Delivering to:</p>
                <p className="text-xs font-body text-mink-light mt-1">{form.name}, {form.address}, {form.city} {form.pincode}</p>
                <p className="text-xs font-body text-green-600 mt-2 font-semibold">🚚 Expected delivery: {(() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }); })()}</p>
              </div>
              <button onClick={onClose} className="w-full py-3 rounded-xl bg-obsidian text-white font-body text-sm hover:bg-obsidian/90 transition-colors">
                Continue Shopping
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
