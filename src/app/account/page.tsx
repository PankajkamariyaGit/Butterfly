"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Package, Heart, MapPin, LogOut, Edit2, Plus,
  ChevronRight, Clock, CheckCircle2, Truck, Box, Home,
  Star, Gift, Users, Crown, TrendingUp, Eye,
} from "lucide-react";
import { useAuthStore, useWishlistStore, useOrderStore } from "@/store";
import { ORDERS, PRODUCTS } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import Image from "next/image";

type Tab = "profile" | "orders" | "wishlist" | "addresses" | "rewards" | "referrals";

const STATUS_STEPS = [
  { key: "placed", label: "Order Placed", icon: CheckCircle2 },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "packed", label: "Packed", icon: Box },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

const STATUS_INDEX: Record<string, number> = {
  placed: 0, confirmed: 1, packed: 2, shipped: 3, out_for_delivery: 4, delivered: 5, cancelled: -1,
};

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const { orders: storedOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name ?? "", phone: "", email: user?.email ?? "" });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ivory pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-full bg-champagne/10 flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-champagne" />
            </div>
            <p className="font-display text-3xl text-obsidian mb-3">Sign In to View Your Account</p>
            <p className="font-body text-sm text-mink-light mb-6">Access your orders, wishlist, and Privé Club rewards</p>
            <div className="flex gap-3 justify-center">
              <Link href="/auth/login?redirect=/account"><Button>Sign In</Button></Link>
              <Link href="/auth/register"><Button variant="outline">Create Account</Button></Link>
            </div>
          </div>
          {/* Preview demo orders even when not logged in */}
          <div className="mt-12 text-left">
            <p className="font-body text-xs text-champagne tracking-[0.3em] uppercase mb-4 text-center">Demo Preview — Sample Orders</p>
            <div className="space-y-3">
              {ORDERS.map((order) => (
                <div key={order.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-body text-xs font-semibold text-champagne">{order.id}</p>
                    <p className="font-body text-xs text-mink-light">{order.customerName} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex gap-2">
                    {order.items.slice(0, 2).map(({ product }) => (
                      <div key={product.id} className="relative w-10 h-10 rounded-lg overflow-hidden bg-pearl">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className={`text-[10px] font-body font-semibold tracking-wider uppercase px-2 py-1 rounded-full ${
                    order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                    order.status === "shipped" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                  }`}>{order.status.replace(/_/g, " ")}</span>
                  <p className="font-body text-sm font-semibold text-obsidian">₹{order.total.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userOrders = [
    ...storedOrders,
    ...ORDERS, // demo seed orders always visible
  ].slice(0, 20);

  const NAV_ITEMS: { id: Tab; icon: typeof User; label: string }[] = [
    { id: "profile", icon: User, label: "My Profile" },
    { id: "orders", icon: Package, label: "My Orders" },
    { id: "wishlist", icon: Heart, label: "Wishlist" },
    { id: "addresses", icon: MapPin, label: "Saved Addresses" },
    { id: "rewards", icon: Crown, label: "Privé Rewards" },
    { id: "referrals", icon: Users, label: "Referrals" },
  ];

  return (
    <div className="min-h-screen bg-ivory py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-body text-champagne tracking-[0.3em] uppercase mb-1">✦ Account</p>
            <h1 className="font-display text-4xl text-obsidian">Hello, {user?.name} 👋</h1>
          </div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-2 text-xs font-body text-mink-light hover:text-rose-gold transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-sm p-4">
              <div className="flex flex-col items-center text-center py-4 mb-4 border-b border-champagne/15">
                <div className="w-16 h-16 rounded-full bg-gradient-luxury flex items-center justify-center text-white text-2xl font-bold mb-3">
                  {user?.avatar}
                </div>
                <p className="font-display text-lg text-obsidian">{user?.name}</p>
                <p className="text-xs font-body text-mink-light">{user?.email}</p>
              </div>
              <nav className="space-y-1">
                {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-body transition-colors text-left ${
                      activeTab === id
                        ? "bg-champagne/10 text-champagne font-semibold"
                        : "text-mink hover:bg-ivory-dark hover:text-champagne"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                    <ChevronRight size={12} className="ml-auto opacity-40" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-obsidian">Profile Details</h2>
                  <button onClick={() => setEditMode(!editMode)} className="flex items-center gap-1.5 text-xs font-body text-champagne hover:text-champagne-dark">
                    <Edit2 size={13} /> {editMode ? "Cancel" : "Edit"}
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name", key: "name", value: profileForm.name },
                    { label: "Email", key: "email", value: profileForm.email },
                    { label: "Phone", key: "phone", value: profileForm.phone || "Not added" },
                  ].map(({ label, key, value }) => (
                    <div key={key}>
                      <label className="text-xs font-body text-mink-light tracking-widest uppercase block mb-1.5">{label}</label>
                      {editMode ? (
                        <input
                          value={(profileForm as Record<string, string>)[key]}
                          onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))}
                          className="luxury-input"
                        />
                      ) : (
                        <p className="text-sm font-body text-obsidian py-2">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
                {editMode && (
                  <Button className="mt-6" onClick={() => setEditMode(false)}>Save Changes</Button>
                )}
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="font-display text-2xl text-obsidian">My Orders</h2>
                {userOrders.length === 0 ? (
                  <div className="glass-card rounded-sm p-10 text-center">
                    <Package size={40} className="text-champagne/40 mx-auto mb-4" />
                    <p className="font-display text-xl text-obsidian mb-2">No orders yet</p>
                    <p className="text-sm font-body text-mink-light mb-5">Your order history will appear here.</p>
                    <Link href="/products"><Button>Shop Now</Button></Link>
                  </div>
                ) : (
                  userOrders.map((order) => {
                    const statusIdx = STATUS_INDEX[order.status] ?? 0;
                    return (
                      <div key={order.id} className="glass-card rounded-sm p-5">
                        <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
                          <div>
                            <p className="text-xs font-body text-mink-light tracking-wider">Order ID</p>
                            <p className="font-body font-semibold text-champagne text-sm">{order.id}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 text-[10px] font-body font-semibold tracking-widest uppercase rounded-sm ${
                              order.status === "delivered" ? "bg-green-100 text-green-700" :
                              order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                              order.status === "cancelled" ? "bg-red-100 text-red-600" :
                              "bg-champagne/10 text-champagne"
                            }`}>
                              {order.status.replace(/_/g, " ")}
                            </span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="flex gap-2 mb-4 flex-wrap">
                          {order.items.map(({ product, quantity }) => (
                            <div key={product.id} className="flex gap-2 items-center">
                              <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-pearl flex-shrink-0">
                                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                              </div>
                              <div className="text-xs font-body">
                                <p className="text-obsidian line-clamp-1 max-w-[120px]">{product.name}</p>
                                <p className="text-mink-light">Qty: {quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Status timeline */}
                        {order.status !== "cancelled" && (
                          <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
                            {STATUS_STEPS.map((step, i) => (
                              <div key={step.key} className="flex items-center gap-1">
                                <div className={`flex flex-col items-center gap-1 min-w-[60px] ${i <= statusIdx ? "text-champagne" : "text-mink-light/30"}`}>
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i <= statusIdx ? "bg-champagne" : "bg-mink-light/10"}`}>
                                    <step.icon size={10} className={i <= statusIdx ? "text-white" : "text-mink-light/40"} />
                                  </div>
                                  <span className="text-[9px] font-body text-center leading-tight">{step.label}</span>
                                </div>
                                {i < STATUS_STEPS.length - 1 && (
                                  <div className={`h-px w-5 mb-4 ${i < statusIdx ? "bg-champagne" : "bg-mink-light/20"}`} />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-champagne/10">
                          <p className="text-sm font-body font-semibold text-obsidian">
                            Total: <span className="text-champagne font-display text-lg">₹{order.total.toLocaleString()}</span>
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Link href={`/track-order?id=${order.id}`}>
                              <Button variant="outline" size="sm">Track</Button>
                            </Link>
                            <button
                              onClick={() => {
                                const gst = Math.round(order.subtotal * 0.03);
                                const lines = [
                                  `TAX INVOICE`,
                                  `Butterfly Fine Jewellery | GSTIN: 27AABCU9603R1ZX`,
                                  `-------------------------------`,
                                  `Invoice No: INV-${order.id}`,
                                  `Date: ${new Date(order.placedAt).toLocaleDateString("en-IN")}`,
                                  `Customer: ${order.customerName}`,
                                  ``,
                                  `Items:`,
                                  ...order.items.map(i => `  ${i.product.name} x${i.quantity} = ₹${(i.product.discountPrice * i.quantity).toLocaleString()}`),
                                  ``,
                                  `Subtotal: ₹${order.subtotal.toLocaleString()}`,
                                  `Shipping: ₹${order.shipping}`,
                                  `GST (3%): ₹${gst.toLocaleString()}`,
                                  order.discount > 0 ? `Discount: -₹${order.discount}` : "",
                                  `TOTAL: ₹${order.total.toLocaleString()}`,
                                  `Payment: ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}`,
                                  `Status: ${order.paymentStatus === "paid" ? "PAID" : "PENDING"}`,
                                ].filter(Boolean).join("\n");
                                const blob = new Blob([lines], { type: "text/plain" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `Invoice-${order.id}.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              className="px-3 py-1.5 text-xs font-body border border-champagne/30 text-champagne rounded-sm hover:bg-champagne/5 transition-colors"
                            >
                              Invoice ↓
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === "wishlist" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-2xl text-obsidian mb-6">My Wishlist ({wishlistItems.length})</h2>
                {wishlistItems.length === 0 ? (
                  <div className="glass-card rounded-sm p-10 text-center">
                    <Heart size={40} className="text-champagne/40 mx-auto mb-4" />
                    <p className="font-display text-xl text-obsidian mb-2">No saved items</p>
                    <Link href="/products"><Button>Explore Collections</Button></Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {wishlistItems.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-obsidian">Saved Addresses</h2>
                  <Button variant="outline" size="sm"><Plus size={14} /> Add New</Button>
                </div>
                {ORDERS.slice(0, 2).map((order) => (
                  <div key={order.id} className="glass-card rounded-sm p-5 mb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        {order.shippingAddress.isDefault && (
                          <span className="text-[10px] font-body font-semibold tracking-widest uppercase text-champagne bg-champagne/10 px-2 py-0.5 rounded-sm mb-2 inline-block">Default</span>
                        )}
                        <p className="text-sm font-body font-semibold text-obsidian mt-1">{order.shippingAddress.name}</p>
                        <p className="text-xs font-body text-mink-light mt-0.5">{order.shippingAddress.line1}</p>
                        {order.shippingAddress.line2 && <p className="text-xs font-body text-mink-light">{order.shippingAddress.line2}</p>}
                        <p className="text-xs font-body text-mink-light">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p className="text-xs font-body text-mink-light mt-1">📞 {order.shippingAddress.phone}</p>
                      </div>
                      <button className="text-xs font-body text-champagne hover:text-champagne-dark flex items-center gap-1">
                        <Edit2 size={12} /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── Rewards Tab ── */}
            {activeTab === "rewards" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Membership card */}
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-obsidian via-mink to-obsidian p-8 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-champagne/10 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="font-body text-[9px] text-champagne/50 tracking-[0.3em] uppercase">BUTTERFLY PRIVÉ</p>
                        <p className="font-display text-2xl text-ivory mt-1">{user?.name}</p>
                      </div>
                      <Crown size={28} className="text-champagne/40" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/10">
                      <div><p className="font-display text-2xl text-champagne">Gold</p><p className="font-body text-[9px] text-ivory/40 tracking-[0.2em] uppercase">Tier</p></div>
                      <div><p className="font-display text-2xl text-champagne">462</p><p className="font-body text-[9px] text-ivory/40 tracking-[0.2em] uppercase">Points</p></div>
                      <div><p className="font-display text-2xl text-champagne">₹500</p><p className="font-body text-[9px] text-ivory/40 tracking-[0.2em] uppercase">Redeemable</p></div>
                    </div>
                  </div>
                </div>

                {/* Points progress */}
                <div className="glass-card rounded-2xl p-5 border border-champagne/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-body text-sm font-semibold text-obsidian">Progress to Privé Tier</p>
                    <span className="text-[10px] font-body text-champagne">462 / 2500 pts</span>
                  </div>
                  <div className="h-2 bg-champagne/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-champagne to-champagne-dark rounded-full" initial={{ width: 0 }} animate={{ width: "18%" }} transition={{ duration: 1.5 }} />
                  </div>
                  <p className="font-body text-[10px] text-mink-light mt-2">Earn 2,038 more points to unlock Butterfly Privé status</p>
                </div>

                {/* Benefits grid */}
                <div>
                  <p className="font-body text-sm font-semibold text-obsidian mb-3">Your Gold Benefits</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: "✦", label: "Early Access", desc: "48hrs before public", active: true },
                      { icon: "◆", label: "15% Birthday Discount", desc: "Next: Jan 15", active: true },
                      { icon: "♦", label: "Free Shipping", desc: "On all orders", active: true },
                      { icon: "✧", label: "Priority Support", desc: "Dedicated agent", active: true },
                    ].map((b) => (
                      <div key={b.label} className="bg-pearl border border-champagne/10 rounded-xl p-3">
                        <span className="text-champagne">{b.icon}</span>
                        <p className="font-body text-xs font-semibold text-obsidian mt-1">{b.label}</p>
                        <p className="font-body text-[10px] text-mink-light">{b.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Referrals Tab ── */}
            {activeTab === "referrals" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="glass-card rounded-2xl p-6 border border-champagne/10 text-center">
                  <div className="w-12 h-12 rounded-full bg-champagne/10 flex items-center justify-center mx-auto mb-4">
                    <Gift size={22} className="text-champagne" />
                  </div>
                  <h3 className="font-display text-2xl text-obsidian mb-2">Refer & Earn</h3>
                  <p className="font-body text-xs text-mink-light mb-5">Share your referral code. When a friend makes their first purchase, you both earn ₹300 in Butterfly credits.</p>
                  <div className="bg-pearl border border-champagne/20 rounded-xl px-5 py-3 font-body text-lg font-semibold text-champagne tracking-widest mb-4">
                    BUTTERFLY-{user?.name?.slice(0, 4).toUpperCase() ?? "USER"}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button className="px-4 py-2 bg-champagne/10 text-champagne font-body text-xs tracking-wider uppercase rounded-full border border-champagne/20 hover:bg-champagne/20 transition-colors">Copy Code</button>
                    <button className="px-4 py-2 bg-gradient-to-r from-champagne to-champagne-dark text-white font-body text-xs tracking-wider uppercase rounded-full hover:opacity-90 transition-opacity">Share Link</button>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-champagne/10">
                  <p className="font-body text-sm font-semibold text-obsidian mb-4">Your Referral Stats</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[{ v: "3", l: "Friends Invited" }, { v: "1", l: "Converted" }, { v: "₹300", l: "Credits Earned" }].map((s) => (
                      <div key={s.l} className="text-center">
                        <p className="font-display text-2xl text-champagne">{s.v}</p>
                        <p className="font-body text-[10px] text-mink-light tracking-wide">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
