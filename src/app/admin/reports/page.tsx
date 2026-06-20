"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { Download, BarChart2, Users, Package, Tag } from "lucide-react";
import toast from "react-hot-toast";

const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 84200, orders: 42 },
  { month: "Feb", revenue: 91500, orders: 48 },
  { month: "Mar", revenue: 78900, orders: 39 },
  { month: "Apr", revenue: 112300, orders: 61 },
  { month: "May", revenue: 134700, orders: 74 },
  { month: "Jun", revenue: 158400, orders: 89 },
];

const TOP_PRODUCTS = [
  { name: "Butterfly Royale Bridal Set", revenue: 42500, units: 10 },
  { name: "Golden Bloom Earrings", revenue: 28600, units: 22 },
  { name: "Pearl Choker", revenue: 21400, units: 11 },
  { name: "Rose Gold Bangles", revenue: 18200, units: 8 },
  { name: "Maang Tikka Gold", revenue: 15600, units: 12 },
  { name: "Layered Gold Necklace", revenue: 13900, units: 9 },
];

const CUSTOMER_DATA = [
  { month: "Jan", newCustomers: 28, returning: 14 },
  { month: "Feb", newCustomers: 31, returning: 17 },
  { month: "Mar", newCustomers: 24, returning: 15 },
  { month: "Apr", newCustomers: 38, returning: 23 },
  { month: "May", newCustomers: 47, returning: 27 },
  { month: "Jun", newCustomers: 52, returning: 37 },
];

const COUPON_DATA = [
  { name: "BUTTERFLY20", uses: 148, savings: 24600 },
  { name: "FLASH10", uses: 89, savings: 11200 },
  { name: "WELCOME50", uses: 52, savings: 7800 },
  { name: "FESTIVAL15", uses: 43, savings: 6400 },
];

const ORDER_STATUS_PIE = [
  { name: "Delivered", value: 185, color: "#22c55e" },
  { name: "Processing", value: 42, color: "#3b82f6" },
  { name: "Shipped", value: 28, color: "#a855f7" },
  { name: "Cancelled", value: 12, color: "#ef4444" },
];

type TabType = "sales" | "products" | "customers" | "coupons";

const TAB_LABELS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "sales", label: "Sales Report", icon: BarChart2 },
  { id: "products", label: "Product Report", icon: Package },
  { id: "customers", label: "Customer Report", icon: Users },
  { id: "coupons", label: "Coupon Report", icon: Tag },
];

function exportCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const rows = [keys.join(","), ...data.map(row => keys.map(k => String(row[k])).join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${filename}-${Date.now()}.csv`;
  a.click();
  toast.success("CSV exported!");
}

export default function AdminReportsPage() {
  const [tab, setTab] = useState<TabType>("sales");

  const totalRevenue = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = MONTHLY_REVENUE.reduce((s, m) => s + m.orders, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">Reports</h1>
          <p className="text-xs font-body text-ivory/30 mt-1">Sales, products, customers & coupon analytics</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue (6M)", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, sub: "Last 6 months", color: "text-champagne" },
          { label: "Total Orders (6M)", value: totalOrders, sub: "Last 6 months", color: "text-blue-400" },
          { label: "Avg. Order Value", value: `₹${Math.round(totalRevenue / totalOrders).toLocaleString()}`, sub: "Per order", color: "text-violet-400" },
          { label: "Top Month", value: "June 2026", sub: "₹1,58,400 revenue", color: "text-green-400" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white/5 border border-white/5 rounded-xl p-4">
            <p className={`font-display text-2xl ${color}`}>{value}</p>
            <p className="text-xs font-body text-ivory/60 mt-1">{label}</p>
            <p className="text-[10px] font-body text-ivory/30">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-white/3 border border-white/5 rounded-lg p-1">
        {TAB_LABELS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-body rounded transition-colors ${tab === t.id ? "bg-champagne/20 text-champagne" : "text-ivory/40 hover:text-ivory/70"}`}>
            <t.icon size={12} /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "sales" && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <button onClick={() => exportCSV(MONTHLY_REVENUE as unknown as Record<string, unknown>[], "sales-report")} className="flex items-center gap-2 px-4 py-2 bg-champagne/10 border border-champagne/30 text-champagne text-xs font-body rounded-sm hover:bg-champagne/20 transition-colors">
              <Download size={12} /> Export CSV
            </button>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-6">
            <h3 className="font-body text-sm font-semibold text-ivory/60 mb-5">Monthly Revenue (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MONTHLY_REVENUE}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(253,251,247,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(253,251,247,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: "#1A1409", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, color: "#FDFBF7" }} formatter={(v) => [`₹${(v as number).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#C9A84C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white/5 border border-white/5 rounded-xl p-6">
              <h3 className="font-body text-sm font-semibold text-ivory/60 mb-5">Monthly Orders</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MONTHLY_REVENUE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "rgba(253,251,247,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(253,251,247,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1A1409", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, color: "#FDFBF7" }} />
                  <Line type="monotone" dataKey="orders" stroke="#FF3E7A" strokeWidth={2} dot={{ fill: "#FF3E7A", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-6">
              <h3 className="font-body text-sm font-semibold text-ivory/60 mb-4">Order Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={ORDER_STATUS_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={{ stroke: "rgba(255,255,255,0.2)" }} fontSize={10} fill="#C9A84C">
                    {ORDER_STATUS_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1A1409", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, color: "#FDFBF7" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <button onClick={() => exportCSV(TOP_PRODUCTS as unknown as Record<string, unknown>[], "product-report")} className="flex items-center gap-2 px-4 py-2 bg-champagne/10 border border-champagne/30 text-champagne text-xs font-body rounded-sm hover:bg-champagne/20 transition-colors">
              <Download size={12} /> Export CSV
            </button>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-6">
            <h3 className="font-body text-sm font-semibold text-ivory/60 mb-5">Top Products by Revenue</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={TOP_PRODUCTS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "rgba(253,251,247,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" width={160} tick={{ fill: "rgba(253,251,247,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1A1409", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, color: "#FDFBF7" }} formatter={(v) => [`₹${(v as number).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#7C3AED" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-xs font-body">
              <thead className="border-b border-white/5">
                <tr className="text-ivory/30 tracking-widest uppercase">
                  <th className="text-left px-5 py-3">#</th>
                  <th className="text-left px-5 py-3">Product</th>
                  <th className="text-left px-5 py-3">Units Sold</th>
                  <th className="text-left px-5 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS.map((p, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 text-ivory/30 font-bold">{i + 1}</td>
                    <td className="px-5 py-3 text-ivory/80">{p.name}</td>
                    <td className="px-5 py-3 text-ivory/50">{p.units}</td>
                    <td className="px-5 py-3 text-champagne font-semibold">₹{p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "customers" && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <button onClick={() => exportCSV(CUSTOMER_DATA as unknown as Record<string, unknown>[], "customer-report")} className="flex items-center gap-2 px-4 py-2 bg-champagne/10 border border-champagne/30 text-champagne text-xs font-body rounded-sm hover:bg-champagne/20 transition-colors">
              <Download size={12} /> Export CSV
            </button>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-6">
            <h3 className="font-body text-sm font-semibold text-ivory/60 mb-5">New vs Returning Customers</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={CUSTOMER_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(253,251,247,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(253,251,247,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1A1409", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, color: "#FDFBF7" }} />
                <Legend wrapperStyle={{ fontSize: 11, color: "rgba(253,251,247,0.5)" }} />
                <Bar dataKey="newCustomers" name="New Customers" fill="#FF3E7A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="returning" name="Returning" fill="#C9A84C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "coupons" && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <button onClick={() => exportCSV(COUPON_DATA as unknown as Record<string, unknown>[], "coupon-report")} className="flex items-center gap-2 px-4 py-2 bg-champagne/10 border border-champagne/30 text-champagne text-xs font-body rounded-sm hover:bg-champagne/20 transition-colors">
              <Download size={12} /> Export CSV
            </button>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-xs font-body">
              <thead className="border-b border-white/5">
                <tr className="text-ivory/30 tracking-widest uppercase">
                  <th className="text-left px-5 py-3">Coupon Code</th>
                  <th className="text-left px-5 py-3">Total Uses</th>
                  <th className="text-left px-5 py-3">Total Savings</th>
                </tr>
              </thead>
              <tbody>
                {COUPON_DATA.map((c, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 text-champagne font-mono font-bold">{c.name}</td>
                    <td className="px-5 py-3 text-ivory/60">{c.uses} uses</td>
                    <td className="px-5 py-3 text-red-400">-₹{c.savings.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
