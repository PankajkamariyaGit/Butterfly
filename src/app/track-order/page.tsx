"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, Truck, Home, Package, Clock, Bell, MapPin, Timer, UserPlus } from "lucide-react";
import { ORDERS } from "@/lib/data";
import { useOrderStore, useAuthStore } from "@/store";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// Map courier AWB prefixes to tracking URLs
const COURIER_TRACK = (trackingId: string) => {
  if (!trackingId) return null;
  // Butterfly uses BFY prefix → Delhivery-style URL
  return `https://www.delhivery.com/track/package/${trackingId}`;
};

const STATUS_STEPS = [
  { key: "placed", label: "Order Placed", icon: CheckCircle2, desc: "We have received your order" },
  { key: "confirmed", label: "Payment Confirmed", icon: CheckCircle2, desc: "Payment verified successfully" },
  { key: "packed", label: "Packed", icon: Package, desc: "Your jewellery is being packed in our luxury box" },
  { key: "shipped", label: "Shipped", icon: Truck, desc: "Your order is on its way" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck, desc: "Arriving today" },
  { key: "delivered", label: "Delivered", icon: Home, desc: "Package delivered successfully" },
];

const STATUS_INDEX: Record<string, number> = {
  placed: 0, confirmed: 1, packed: 2, shipped: 3, out_for_delivery: 4, delivered: 5,
};

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<(typeof ORDERS)[0] | null>(null);
  const [mounted, setMounted] = useState(false);
  const { orders: storedOrders } = useOrderStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);

  const allOrders = mounted
    ? [...storedOrders, ...ORDERS].reduce<typeof ORDERS>((acc, o) => {
        if (!acc.find(x => x.id === o.id)) acc.push(o as typeof ORDERS[0]);
        return acc;
      }, [])
    : [...ORDERS];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearched(true);
    const q = query.trim().toLowerCase();
    const found = allOrders.find((o) =>
      o.id.toLowerCase() === q ||
      o.customerEmail.toLowerCase() === q ||
      o.shippingAddress.phone === q ||
      o.customerName.toLowerCase() === q ||
      o.shippingAddress.name.toLowerCase() === q
    );
    setOrder(found ?? null);
  };

  const statusIdx = order ? (STATUS_INDEX[order.status] ?? 0) : 0;

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-body text-champagne tracking-[0.3em] uppercase mb-3">✦ Order Status</p>
          <h1 className="font-display text-4xl sm:text-5xl text-obsidian mb-4">Track Your Order</h1>
          <div className="section-divider mb-4" />
          <p className="text-sm font-body text-mink-light">
            Enter your Order ID, email address, mobile number, or name to track your jewellery.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-0 mb-10 shadow-luxury">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order ID, email, mobile or name"
            className="luxury-input rounded-r-none flex-1"
          />
          <Button type="submit" className="rounded-l-none">
            <Search size={16} /> Track
          </Button>
        </form>

        <p className="text-xs text-center font-body text-mink-light -mt-8 mb-10">
          Use the Order ID from your order confirmation, or enter your email / mobile number.
        </p>

        {/* Result */}
        {searched && !order && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-sm p-10 text-center">
            <Clock size={40} className="text-mink-light/40 mx-auto mb-4" />
            <p className="font-display text-xl text-obsidian">Order not found</p>
            <p className="text-sm font-body text-mink-light mt-2 max-w-sm mx-auto">
              Please check your Order ID or email and try again. Orders placed on a different device may not appear here.
            </p>
            <a
              href="https://wa.me/919833509027?text=Hi%2C%20I%20need%20help%20tracking%20my%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-champagne/10 border border-champagne/30 text-champagne font-body text-sm rounded-full hover:bg-champagne/20 transition-colors"
            >
              Contact us on WhatsApp
            </a>
          </motion.div>
        )}

        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Order header */}
            <div className="glass-card rounded-2xl p-6 border border-champagne/15 shadow-luxury">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[10px] font-body text-champagne tracking-[0.3em] uppercase mb-1">Order</p>
                  <p className="font-display text-2xl text-obsidian">{order.id}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-[10px] font-body font-semibold tracking-wider uppercase ${
                  order.status === "delivered" ? "bg-green-100 text-green-700" :
                  order.status === "shipped" || order.status === "out_for_delivery" ? "bg-blue-100 text-blue-700" :
                  order.status === "cancelled" ? "bg-red-100 text-red-700" :
                  "bg-champagne/15 text-champagne-dark"
                }`}>
                  {order.status.replace(/_/g, " ")}
                </div>
              </div>

              {/* Progress bar */}
              {order.status !== "cancelled" && (
                <div className="mb-5">
                  <div className="flex justify-between text-[9px] font-body text-mink-light tracking-wider uppercase mb-2">
                    <span>Order Placed</span>
                    <span>Delivered</span>
                  </div>
                  <div className="h-1.5 bg-champagne/15 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-champagne to-champagne-dark rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((statusIdx + 1) / STATUS_STEPS.length) * 100}%` }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <p className="text-[10px] font-body text-champagne mt-2 text-right">{Math.round(((statusIdx + 1) / STATUS_STEPS.length) * 100)}% complete</p>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-champagne/10">
                {[
                  { label: "Total Amount", value: `₹${order.total.toLocaleString()}` },
                  { label: "Payment", value: order.paymentMethod.toUpperCase() },
                  { label: "Customer", value: order.customerName },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] font-body text-mink-light tracking-widest uppercase">{label}</p>
                    <p className="text-sm font-body font-semibold text-obsidian mt-1">{value}</p>
                  </div>
                ))}
              </div>
              {order.trackingId && (
                <div className="mt-4 pt-4 border-t border-champagne/10 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-body text-mink-light tracking-widest uppercase mb-1">Tracking ID</p>
                    <p className="text-sm font-body font-semibold text-champagne">{order.trackingId}</p>
                  </div>
                  <button className="text-[10px] font-body text-champagne border border-champagne/30 px-3 py-1.5 rounded-full hover:bg-champagne/10 transition-colors tracking-wider">
                    Track on Courier
                  </button>
                </div>
              )}
            </div>

            {/* Estimated delivery countdown */}
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <div className="bg-gradient-to-r from-champagne/15 to-rose-gold/10 border border-champagne/20 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <Timer size={20} className="text-champagne" />
                  <div>
                    <p className="font-body text-sm font-semibold text-obsidian">Estimated Delivery</p>
                    <p className="font-body text-xs text-mink-light mt-0.5">
                      {order.status === "out_for_delivery" ? "Today, before 8 PM" :
                       order.status === "shipped" ? "Within 1–2 business days" :
                       "Within 3–5 business days"}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-display text-xl text-champagne">
                      {order.status === "out_for_delivery" ? "Today" : order.status === "shipped" ? "2 Days" : "4 Days"}
                    </p>
                    <p className="font-body text-[9px] text-mink-light tracking-wider">REMAINING</p>
                  </div>
                </div>
              </div>
            )}

            {/* Map placeholder */}
            {(order.status === "shipped" || order.status === "out_for_delivery") && (
              <div className="rounded-2xl overflow-hidden border border-champagne/15 relative h-48 bg-pearl">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                  <MapPin size={32} className="text-champagne/40" />
                  <div>
                    <p className="font-body text-sm font-semibold text-obsidian">Live Shipment Map</p>
                    <p className="font-body text-xs text-mink-light mt-1">Real-time tracking coming soon</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse" />
                    <p className="font-body text-[10px] text-champagne tracking-wider">In Transit — Mumbai → {order.shippingAddress.city}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            {order.status !== "cancelled" ? (
              <div className="glass-card rounded-2xl p-6 border border-champagne/10">
                <h2 className="font-display text-xl text-obsidian mb-8">Order Journey</h2>
                <div className="relative">
                  <div className="absolute left-5 top-5 bottom-5 w-px bg-champagne/15" />
                  <div className="space-y-8">
                    {STATUS_STEPS.map((step, i) => {
                      const done = i <= statusIdx;
                      const current = i === statusIdx;
                      const Icon = step.icon;
                      return (
                        <motion.div key={step.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: done ? 1 : 0.3, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-5">
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${done ? current ? "bg-gradient-to-br from-champagne to-champagne-dark shadow-luxury" : "bg-champagne" : "bg-ivory-dark border-2 border-champagne/20"}`}>
                            <Icon size={16} className={done ? "text-white" : "text-mink-light/40"} />
                            {current && <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }} className="absolute inset-0 rounded-full bg-champagne/40" />}
                          </div>
                          <div className="flex-1 pt-1.5">
                            <p className={`text-sm font-body font-semibold ${done ? "text-obsidian" : "text-mink-light/40"}`}>{step.label}</p>
                            <p className={`text-xs font-body mt-0.5 ${done ? "text-mink-light" : "text-mink-light/25"}`}>{current ? step.desc : done ? step.desc : "Pending"}</p>
                          </div>
                          {current && <span className="text-[9px] font-body font-semibold text-champagne bg-champagne/10 px-2 py-1 rounded-full tracking-widest uppercase self-start mt-1 animate-pulse">Current</span>}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 text-center border border-red-100">
                <p className="font-display text-xl text-red-500 mb-2">Order Cancelled</p>
                <p className="text-sm font-body text-mink-light">Refund will be processed within 5–7 business days.</p>
              </div>
            )}

            {/* Courier Tracking Link */}
            {order.trackingId && (order.status === "shipped" || order.status === "out_for_delivery") && (
              <div className="glass-card rounded-2xl p-5 border border-blue-200 bg-blue-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <Truck size={18} className="text-blue-600" />
                  <p className="font-body text-sm font-semibold text-obsidian">Live Courier Tracking</p>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-body text-mink-light">AWB / Tracking No:</span>
                  <code className="text-xs font-mono bg-white border border-champagne/20 px-2 py-1 rounded text-champagne font-bold">{order.trackingId}</code>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={COURIER_TRACK(order.trackingId) ?? "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-body font-semibold rounded-full hover:bg-blue-700 transition-colors">
                    <MapPin size={12} /> Track on Delhivery
                  </a>
                  <a href={`https://www.shiprocket.in/shipment-tracking/?id=${order.trackingId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-xs font-body font-semibold rounded-full hover:bg-orange-600 transition-colors">
                    <Truck size={12} /> Track on Shiprocket
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(order.trackingId ?? ""); }} className="inline-flex items-center gap-2 px-4 py-2 border border-champagne/30 text-champagne text-xs font-body rounded-full hover:bg-champagne/5 transition-colors">
                    Copy AWB
                  </button>
                </div>
              </div>
            )}

            {/* Notification settings */}
            <div className="bg-pearl border border-champagne/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Bell size={16} className="text-champagne" />
                <p className="font-body text-sm font-semibold text-obsidian">Notification Preferences</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {["SMS Updates", "Email Updates", "WhatsApp Alerts"].map((n) => (
                  <label key={n} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-champagne" />
                    <span className="font-body text-xs text-mink-light">{n}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="glass-card rounded-2xl p-5 border border-champagne/10">
              <p className="text-[10px] font-body text-champagne tracking-widest uppercase mb-3">Delivering To</p>
              <p className="text-sm font-body font-semibold text-obsidian">{order.shippingAddress.name}</p>
              <p className="text-xs font-body text-mink-light mt-1 leading-relaxed">
                {order.shippingAddress.line1}{order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
              </p>
            </div>

            {/* Create account prompt for guests */}
            {!isAuthenticated && (
              <div className="bg-gradient-to-r from-champagne/10 to-rose-gold/5 border border-champagne/25 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-champagne/15 flex items-center justify-center flex-shrink-0">
                    <UserPlus size={18} className="text-champagne" />
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm font-semibold text-obsidian mb-1">Save this order to your account</p>
                    <p className="font-body text-xs text-mink-light mb-4">
                      Create a free account to track all your orders, manage returns, and earn Privé rewards — all in one place.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/auth/signup?email=${encodeURIComponent(order.customerEmail)}&name=${encodeURIComponent(order.customerName)}`}
                      >
                        <Button size="sm">Create Account</Button>
                      </Link>
                      <Link href={`/auth/login?redirect=/track-order`}>
                        <Button variant="outline" size="sm">Login</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
