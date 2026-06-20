"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, ShoppingCart, Users, Package,
  Clock, CheckCircle2, AlertTriangle, ArrowUpRight,
  Sparkles, Brain, BarChart2, Target, RefreshCcw, Send,
} from "lucide-react";
import { PRODUCTS, ORDERS, USERS } from "@/lib/data";
import { useOrderStore } from "@/store";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import Link from "next/link";

const AI_RESPONSES: Record<string, string> = {
  bestseller: "📊 Top performers this month: Butterfly Royale Bridal Necklace Set (₹3,999) — 42 units, Golden Bloom Earrings (₹1,199) — 38 units, Pearl Butterfly Choker (₹1,899) — 31 units. Recommend increasing inventory of Bridal Set by 20 units before next festive season.",
  stock: "⚠️ Low stock prediction: At current velocity, Butterfly Royale Bridal Set will run out in ~8 days. Crystal Wings Ring has 3 units left. Recommend restocking 20+ units of bridal collection ahead of the upcoming wedding season.",
  description: "✍️ Here's an SEO-optimised description for a necklace set:\n\n\"Elevate your festive look with the Butterfly Royale Bridal Necklace Set — a masterpiece of traditional artistry. Crafted with premium gold-plated alloy and hand-set Kundan stones, this stunning 5-piece set includes a grand necklace, maang tikka, jhumka earrings, and matching bangles. Perfect for weddings, sangeet, and special occasions.\"",
  seo: "🔍 SEO meta description: \"Shop Butterfly Fine Jewellery — India's most loved premium artificial jewellery brand. Explore 200+ designs including bridal sets, statement earrings, necklaces & more. Free shipping above ₹999. COD available.\"",
  campaign: "📣 Suggested campaign for upcoming Diwali season:\n\n**Campaign: \"Shine Like Gold\"**\n- Instagram Reels: 'Transform your Diwali look in 30 seconds'\n- Offer: Buy 2 Get 1 Free on all festive pieces\n- Email subject: 'Your Diwali glow-up starts here ✨'\n- Budget: ₹15,000 for 14-day campaign\n- Expected ROI: 3.2x based on last year's data",
  default: "I'm your Butterfly AI Admin Assistant. I can help you with:\n\n• **Bestsellers** — which products are performing best\n• **Stock predictions** — forecast inventory needs\n• **Descriptions** — generate product copy\n• **SEO** — create optimised meta descriptions\n• **Campaigns** — suggest marketing strategies\n\nTry asking: 'Who are the bestsellers?' or 'Predict low stock'",
};

function getAIAdminResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("best") || q.includes("top") || q.includes("popular")) return AI_RESPONSES.bestseller;
  if (q.includes("stock") || q.includes("inventory") || q.includes("restock")) return AI_RESPONSES.stock;
  if (q.includes("description") || q.includes("copy") || q.includes("write")) return AI_RESPONSES.description;
  if (q.includes("seo") || q.includes("meta") || q.includes("search")) return AI_RESPONSES.seo;
  if (q.includes("campaign") || q.includes("marketing") || q.includes("email") || q.includes("ads")) return AI_RESPONSES.campaign;
  return AI_RESPONSES.default;
}

const CATEGORY_DATA = [
  { name: "Bridal", revenue: 98000 },
  { name: "Earrings", revenue: 64000 },
  { name: "Necklaces", revenue: 78000 },
  { name: "Bangles", revenue: 42000 },
  { name: "Rings", revenue: 18000 },
  { name: "Other", revenue: 12000 },
];

const PAYMENT_DATA = [
  { name: "Razorpay", value: 45 },
  { name: "COD", value: 35 },
  { name: "UPI/BHIM", value: 12 },
  { name: "Wallets", value: 8 },
];

const PIE_COLORS = ["#C9A84C", "#B76E79", "#7C3AED", "#059669"];

// Top Indian states by orders
const STATE_DATA = [
  { state: "Maharashtra", orders: 68, revenue: 84000 },
  { state: "Delhi", orders: 52, revenue: 71000 },
  { state: "Karnataka", orders: 38, revenue: 52000 },
  { state: "Gujarat", orders: 29, revenue: 40000 },
  { state: "Tamil Nadu", orders: 24, revenue: 32000 },
  { state: "Rajasthan", orders: 18, revenue: 26000 },
  { state: "West Bengal", orders: 14, revenue: 19000 },
  { state: "Others", orders: 5, revenue: 8000 },
];

// Top cities
const TOP_CITIES = [
  { city: "Mumbai", orders: 41 },
  { city: "Delhi", orders: 38 },
  { city: "Bengaluru", orders: 29 },
  { city: "Hyderabad", orders: 22 },
  { city: "Ahmedabad", orders: 17 },
  { city: "Pune", orders: 15 },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 58000 },
  { month: "Mar", revenue: 51000 },
  { month: "Apr", revenue: 79000 },
  { month: "May", revenue: 94000 },
  { month: "Jun", revenue: 88000 },
];

const STAT_CARDS = [
  {
    label: "Total Revenue",
    value: "₹3,12,000",
    change: "+18%",
    icon: TrendingUp,
    color: "text-champagne",
    bg: "bg-champagne/10",
  },
  {
    label: "Total Orders",
    value: "248",
    change: "+12%",
    icon: ShoppingCart,
    color: "text-rose-gold",
    bg: "bg-rose-gold/10",
  },
  {
    label: "Customers",
    value: USERS.filter((u) => u.role === "customer").length.toString(),
    change: "+24%",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    label: "Products",
    value: PRODUCTS.length.toString(),
    change: "+3",
    icon: Package,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { orders: storedOrders } = useOrderStore();

  // Merge stored + demo orders, deduplicate by id
  const allOrders = [...storedOrders, ...ORDERS].reduce<typeof ORDERS>((acc, o) => {
    if (!acc.find((x) => x.id === o.id)) acc.push(o as typeof ORDERS[0]);
    return acc;
  }, []);

  const pendingOrders = allOrders.filter((o) => o.status === "placed").length;
  const lowStockProducts = PRODUCTS.filter((p) => p.stock < 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ivory/90 mb-1">Dashboard</h1>
        <p className="text-xs font-body text-ivory/30 tracking-wider">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {STAT_CARDS.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="bg-white/5 border border-white/5 rounded-sm p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-sm ${s.bg} flex items-center justify-center`}>
                  <Icon size={18} className={s.color} />
                </div>
                <span className="text-[10px] font-body font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-sm">
                  {s.change}
                </span>
              </div>
              <p className="font-display text-2xl text-ivory/90">{s.value}</p>
              <p className="text-xs font-body text-ivory/40 mt-1">{s.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Chart + Quick stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales chart */}
        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-sm p-5">
          <h2 className="font-display text-lg text-ivory/80 mb-6">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "Jost" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Jost" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#1A1409", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "4px", fontFamily: "Jost" }}
                labelStyle={{ color: "#C9A84C", fontSize: 11 }}
                itemStyle={{ color: "#FDFBF7", fontSize: 11 }}
                formatter={(v) => [`₹${(v as number).toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order status */}
        <div className="bg-white/5 border border-white/5 rounded-sm p-5">
          <h2 className="font-display text-lg text-ivory/80 mb-5">Order Status</h2>
          <div className="space-y-4">
            {[
              { label: "Pending", count: pendingOrders, color: "bg-yellow-400" },
              { label: "Shipped", count: allOrders.filter((o) => o.status === "shipped").length, color: "bg-blue-400" },
              { label: "Delivered", count: allOrders.filter((o) => o.status === "delivered").length, color: "bg-green-400" },
              { label: "Cancelled", count: allOrders.filter((o) => o.status === "cancelled").length, color: "bg-red-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-sm font-body text-ivory/60 flex-1">{s.label}</span>
                <span className="text-sm font-body font-semibold text-ivory/80">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders + Low stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white/5 border border-white/5 rounded-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-ivory/80">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-body text-champagne/70 hover:text-champagne flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {allOrders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-xs font-body font-semibold text-champagne">{order.id}</p>
                  <p className="text-xs font-body text-ivory/40 mt-0.5">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-body font-semibold text-ivory/80">₹{order.total.toLocaleString()}</p>
                  <span className={`text-[9px] font-body font-semibold tracking-wider uppercase ${
                    order.status === "delivered" ? "text-green-400" :
                    order.status === "shipped" ? "text-blue-400" :
                    "text-champagne"
                  }`}>{order.status.replace(/_/g, " ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white/5 border border-white/5 rounded-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-ivory/80 flex items-center gap-2">
              <AlertTriangle size={16} className="text-yellow-400" />
              Low Stock Alerts
            </h2>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="flex items-center gap-2 text-xs font-body text-green-400">
              <CheckCircle2 size={14} /> All products are well-stocked
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-body text-ivory/70 truncate">{p.name}</p>
                    <p className="text-[10px] font-body text-ivory/30">{p.category}</p>
                  </div>
                  <span className={`ml-3 text-xs font-body font-semibold px-2 py-0.5 rounded-sm ${
                    p.stock === 0 ? "text-red-400 bg-red-400/10" : "text-yellow-400 bg-yellow-400/10"
                  }`}>
                    {p.stock === 0 ? "Out of Stock" : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Best sellers */}
      <div className="bg-white/5 border border-white/5 rounded-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg text-ivory/80">Best Selling Products</h2>
          <Link href="/admin/products" className="text-xs font-body text-champagne/70 hover:text-champagne flex items-center gap-1">
            Manage <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b border-white/5 text-ivory/30 tracking-widest uppercase">
                <th className="text-left py-2 pr-4">Product</th>
                <th className="text-left py-2 pr-4">Category</th>
                <th className="text-left py-2 pr-4">Price</th>
                <th className="text-left py-2 pr-4">Stock</th>
                <th className="text-left py-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.filter((p) => p.bestseller || p.featured).slice(0, 5).map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                  <td className="py-3 pr-4 text-ivory/70 max-w-[200px] truncate">{p.name}</td>
                  <td className="py-3 pr-4 text-ivory/40">{p.category}</td>
                  <td className="py-3 pr-4 text-champagne font-semibold">₹{p.discountPrice.toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <span className={p.stock < 10 ? "text-yellow-400" : "text-green-400"}>{p.stock}</span>
                  </td>
                  <td className="py-3 text-ivory/60">⭐ {p.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* BI Metrics Row */}
      <div>
        <h2 className="font-display text-xl text-ivory/80 mb-4 flex items-center gap-2">
          <BarChart2 size={18} className="text-champagne" /> Business Intelligence
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Conversion Rate", value: "3.8%", trend: "+0.4%", color: "text-green-400" },
            { label: "Cart Abandonment", value: "62%", trend: "-3%", color: "text-yellow-400" },
            { label: "Returning Customers", value: "41%", trend: "+6%", color: "text-blue-400" },
            { label: "Avg Order Value", value: "₹1,258", trend: "+₹180", color: "text-champagne" },
          ].map((m) => (
            <div key={m.label} className="bg-white/5 border border-white/5 rounded-xl p-4">
              <p className="text-[10px] font-body text-ivory/30 tracking-wider uppercase mb-2">{m.label}</p>
              <p className="font-display text-2xl text-ivory/90">{m.value}</p>
              <p className={`text-[10px] font-body mt-1 ${m.color}`}>{m.trend} vs last month</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Category + Payment Mix */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/5 rounded-xl p-5">
          <h3 className="font-display text-base text-ivory/80 mb-4 flex items-center gap-2">
            <Target size={14} className="text-champagne" /> Revenue by Category
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CATEGORY_DATA} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Jost" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "Jost" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#1A1409", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "8px", fontFamily: "Jost" }} labelStyle={{ color: "#C9A84C", fontSize: 11 }} itemStyle={{ color: "#FDFBF7", fontSize: 11 }} formatter={(v) => [`₹${(v as number).toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#C9A84C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl p-5">
          <h3 className="font-display text-base text-ivory/80 mb-4">Payment Method Mix</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={PAYMENT_DATA} cx={65} cy={65} innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {PAYMENT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v as number}%`]} contentStyle={{ background: "#1A1409", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "8px", fontFamily: "Jost" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {PAYMENT_DATA.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-xs font-body text-ivory/60">{d.name}</span>
                  <span className="text-xs font-body font-semibold text-ivory/90 ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* INDIA ANALYTICS ──────────────────────────────────── */}
      <div>
        <h2 className="font-display text-xl text-ivory/80 mb-4 flex items-center gap-2">
          <span className="text-lg">🇮🇳</span> India Sales Analytics
        </h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* State-wise orders */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-5">
            <h3 className="font-display text-base text-ivory/80 mb-4">Orders by State</h3>
            <div className="space-y-3">
              {STATE_DATA.map((s, i) => {
                const max = STATE_DATA[0].orders;
                const pct = Math.round((s.orders / max) * 100);
                const colors = ["#D4A017","#E05A7A","#7C3AED","#0D9488","#FF5F40","#059669","#FFB800","#6B7280"];
                return (
                  <div key={s.state}>
                    <div className="flex items-center justify-between text-xs font-body mb-1">
                      <span className="text-ivory/70">{s.state}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-ivory/40">{s.orders} orders</span>
                        <span className="text-champagne font-semibold">₹{(s.revenue/1000).toFixed(0)}k</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: colors[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Cities + GST summary */}
          <div className="space-y-5">
            <div className="bg-white/5 border border-white/5 rounded-xl p-5">
              <h3 className="font-display text-base text-ivory/80 mb-4">Top Cities</h3>
              <div className="grid grid-cols-2 gap-3">
                {TOP_CITIES.map((c, i) => (
                  <div key={c.city} className="flex items-center gap-3">
                    <span className="text-xs font-body text-ivory/30 w-4 text-center">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-xs font-body text-ivory/80 font-semibold">{c.city}</p>
                      <p className="text-[10px] font-body text-ivory/40">{c.orders} orders</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-champagne/10 flex items-center justify-center text-[10px] font-bold text-champagne">
                      {c.orders}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-5">
              <h3 className="font-display text-base text-ivory/80 mb-4">GST Summary</h3>
              <div className="space-y-2">
                {[
                  { label: "Total Taxable Value", value: "₹3,02,914" },
                  { label: "CGST (1.5%)", value: "₹4,544" },
                  { label: "SGST (1.5%)", value: "₹4,544" },
                  { label: "Total GST Collected", value: "₹9,087" },
                ].map(g => (
                  <div key={g.label} className="flex justify-between text-xs font-body">
                    <span className="text-ivory/40">{g.label}</span>
                    <span className={g.label.includes("Total GST") ? "text-champagne font-semibold" : "text-ivory/70"}>{g.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/5 text-[10px] font-body text-ivory/25">
                  GSTIN: 27AABCU9603R1ZX · FY 2025–26 Q2
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Admin Assistant */}
      <div className="bg-gradient-to-br from-obsidian to-mink border border-champagne/15 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-champagne/15 flex items-center justify-center">
            <Brain size={18} className="text-champagne" />
          </div>
          <div>
            <h2 className="font-display text-xl text-ivory">AI Admin Assistant</h2>
            <p className="font-body text-[10px] text-ivory/35 tracking-wider">Powered by Butterfly Intelligence Engine</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] font-body text-green-400 tracking-wider">Online</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { label: "Top Bestsellers", query: "Who are the bestsellers?" },
            { label: "Predict Low Stock", query: "Predict low stock items" },
            { label: "Write Description", query: "Generate a product description" },
            { label: "SEO Meta", query: "Generate SEO meta description" },
            { label: "Diwali Campaign", query: "Suggest a Diwali marketing campaign" },
          ].map((q) => (
            <button
              key={q.label}
              onClick={async () => {
                setAiQuery(q.query);
                setAiLoading(true);
                setAiResponse(null);
                await new Promise((r) => setTimeout(r, 800));
                setAiResponse(getAIAdminResponse(q.query));
                setAiLoading(false);
              }}
              className="text-[9px] font-body px-2.5 py-1 rounded-full border border-champagne/25 text-champagne/70 hover:border-champagne/60 hover:text-champagne transition-colors tracking-wider"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Response area */}
        {(aiLoading || aiResponse) && (
          <div className="bg-white/5 rounded-xl p-4 mb-4 min-h-[80px]">
            {aiLoading ? (
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-champagne" animate={{ y: [0, -5, 0] }} transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.7 }} />
                ))}
                <span className="text-xs font-body text-ivory/40 ml-2">Analysing...</span>
              </div>
            ) : (
              <p className="text-xs font-body text-ivory/70 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: (aiResponse ?? "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
              />
            )}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!aiQuery) return;
            setAiLoading(true);
            setAiResponse(null);
            await new Promise((r) => setTimeout(r, 900));
            setAiResponse(getAIAdminResponse(aiQuery));
            setAiLoading(false);
          }}
          className="flex gap-2"
        >
          <input
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask anything — sales trends, stock forecasts, marketing ideas..."
            className="flex-1 bg-white/5 border border-white/10 text-ivory/80 placeholder-ivory/20 rounded-xl px-4 py-2.5 text-xs font-body focus:outline-none focus:border-champagne/40"
          />
          <button type="submit" className="w-9 h-9 rounded-xl bg-champagne/20 hover:bg-champagne/30 transition-colors flex items-center justify-center">
            <Send size={14} className="text-champagne" />
          </button>
        </form>
      </div>

    </div>
  );
}
