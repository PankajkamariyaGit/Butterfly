"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Search, Check, X, Clock, Package } from "lucide-react";
import toast from "react-hot-toast";

type ReturnStatus = "pending" | "approved" | "rejected" | "refunded";

type ReturnRequest = {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  reason: string;
  status: ReturnStatus;
  requestedAt: string;
  amount: number;
  refundMethod: string;
};

const DEMO_RETURNS: ReturnRequest[] = [
  { id: "RET-001", orderId: "ORD-2026-0001", customerName: "Priya Sharma", customerEmail: "priya@example.com", productName: "Butterfly Royale Bridal Necklace Set", reason: "Size doesn't fit", status: "pending", requestedAt: "2026-06-18T10:30:00Z", amount: 4299, refundMethod: "Original Payment Method" },
  { id: "RET-002", orderId: "ORD-2026-0002", customerName: "Ananya Reddy", customerEmail: "ananya@example.com", productName: "Golden Bloom Statement Earrings", reason: "Received wrong colour", status: "approved", requestedAt: "2026-06-15T14:20:00Z", amount: 1299, refundMethod: "Store Credit" },
  { id: "RET-003", orderId: "ORD-2026-0003", customerName: "Meera Patel", customerEmail: "meera@example.com", productName: "Pearl Butterfly Choker", reason: "Product quality not as expected", status: "refunded", requestedAt: "2026-06-10T09:00:00Z", amount: 1999, refundMethod: "Bank Transfer" },
  { id: "RET-004", orderId: "ORD-2026-0004", customerName: "Kavya Nair", customerEmail: "kavya@example.com", productName: "Royal Rose Gold Bangles Set", reason: "Duplicate order placed", status: "rejected", requestedAt: "2026-06-12T16:45:00Z", amount: 2299, refundMethod: "N/A" },
];

const STATUS_CONFIG: Record<ReturnStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "text-yellow-400 bg-yellow-400/10" },
  approved: { label: "Approved", cls: "text-blue-400 bg-blue-400/10" },
  rejected: { label: "Rejected", cls: "text-red-400 bg-red-400/10" },
  refunded: { label: "Refunded", cls: "text-green-400 bg-green-400/10" },
};

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState(DEMO_RETURNS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | ReturnStatus>("all");
  const [selected, setSelected] = useState<ReturnRequest | null>(null);

  const filtered = returns.filter(r => {
    const matchSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) || r.orderId.includes(search) || r.productName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: ReturnStatus) => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null);
    toast.success(`Return ${status}!`);
  };

  const pendingCount = returns.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">Returns & Refunds</h1>
          <p className="text-xs font-body text-ivory/30 mt-1">{pendingCount > 0 && <span className="text-yellow-400 font-semibold">{pendingCount} pending · </span>}{returns.length} total requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["pending", "approved", "rejected", "refunded"] as ReturnStatus[]).map(s => {
          const count = returns.filter(r => r.status === s).length;
          const { label, cls } = STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
              className={`bg-white/5 border rounded-xl p-4 text-left transition-all ${filterStatus === s ? "border-champagne/40" : "border-white/5 hover:border-white/10"}`}>
              <p className={`font-display text-3xl ${cls.split(" ")[0]}`}>{count}</p>
              <p className="text-xs font-body text-ivory/30 mt-0.5">{label}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order, customer..." className="w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body pl-9 pr-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/40" />
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead className="border-b border-white/5">
              <tr className="text-ivory/30 tracking-widest uppercase">
                <th className="text-left px-5 py-3">Return ID</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <motion.tr key={r.id} layout className="border-b border-white/5 last:border-0 hover:bg-white/3 cursor-pointer transition-colors" onClick={() => setSelected(r)}>
                  <td className="px-5 py-3">
                    <p className="text-champagne font-mono">{r.id}</p>
                    <p className="text-ivory/30 text-[10px]">{r.orderId}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-ivory/80">{r.customerName}</p>
                    <p className="text-ivory/30">{r.customerEmail}</p>
                  </td>
                  <td className="px-5 py-3 text-ivory/60 max-w-[160px] truncate">{r.productName}</td>
                  <td className="px-5 py-3 text-champagne font-semibold">₹{r.amount.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[r.status].cls}`}>{STATUS_CONFIG[r.status].label}</span>
                  </td>
                  <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                    {r.status === "pending" && (
                      <div className="flex gap-1.5">
                        <button onClick={() => updateStatus(r.id, "approved")} className="p-1.5 bg-green-400/10 text-green-400 hover:bg-green-400/20 rounded transition-colors"><Check size={13} /></button>
                        <button onClick={() => updateStatus(r.id, "rejected")} className="p-1.5 bg-red-400/10 text-red-400 hover:bg-red-400/20 rounded transition-colors"><X size={13} /></button>
                      </div>
                    )}
                    {r.status === "approved" && (
                      <button onClick={() => updateStatus(r.id, "refunded")} className="text-[10px] font-body text-blue-400 border border-blue-400/30 px-2.5 py-1 rounded hover:bg-blue-400/10 transition-colors">
                        Mark Refunded
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-[#1A1409] border border-champagne/20 rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl text-ivory/90">Return Details</h2>
                <button onClick={() => setSelected(null)}><X size={18} className="text-ivory/40" /></button>
              </div>
              <div className="space-y-3 text-sm font-body">
                {[
                  ["Return ID", selected.id],
                  ["Order ID", selected.orderId],
                  ["Customer", selected.customerName],
                  ["Email", selected.customerEmail],
                  ["Product", selected.productName],
                  ["Reason", selected.reason],
                  ["Refund Method", selected.refundMethod],
                  ["Amount", `₹${selected.amount.toLocaleString()}`],
                  ["Requested", new Date(selected.requestedAt).toLocaleString("en-IN")],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="text-ivory/30 w-28 flex-shrink-0">{k}:</span>
                    <span className="text-ivory/70">{v}</span>
                  </div>
                ))}
              </div>
              {selected.status === "pending" && (
                <div className="flex gap-3 mt-6">
                  <button onClick={() => { updateStatus(selected.id, "approved"); setSelected(null); }} className="flex-1 py-2.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs font-body font-semibold hover:bg-green-500/30 transition-colors">
                    ✓ Approve Return
                  </button>
                  <button onClick={() => { updateStatus(selected.id, "rejected"); setSelected(null); }} className="flex-1 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-body font-semibold hover:bg-red-500/30 transition-colors">
                    ✗ Reject Return
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
