"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Truck, Search, Check, X } from "lucide-react";
import toast from "react-hot-toast";

type PaymentMethod = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  enabled: boolean;
  color: string;
};

type Transaction = {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: string;
  status: "success" | "failed" | "pending";
  date: string;
};

const DEMO_TRANSACTIONS: Transaction[] = [
  { id: "TXN-001", orderId: "ORD-2026-0001", customerName: "Priya Sharma", amount: 4299, method: "UPI", status: "success", date: "2026-06-18T10:30:00Z" },
  { id: "TXN-002", orderId: "ORD-2026-0002", customerName: "Ananya Reddy", amount: 1299, method: "Card", status: "success", date: "2026-06-17T14:20:00Z" },
  { id: "TXN-003", orderId: "ORD-2026-0003", customerName: "Meera Patel", amount: 1999, method: "Razorpay", status: "pending", date: "2026-06-16T09:00:00Z" },
  { id: "TXN-004", orderId: "ORD-2026-0004", customerName: "Kavya Nair", amount: 2299, method: "COD", status: "pending", date: "2026-06-15T16:45:00Z" },
  { id: "TXN-005", orderId: "ORD-2026-0005", customerName: "Sneha Kulkarni", amount: 799, method: "Card", status: "failed", date: "2026-06-14T12:00:00Z" },
  { id: "TXN-006", orderId: "ORD-2026-0006", customerName: "Deepa Menon", amount: 3499, method: "UPI", status: "success", date: "2026-06-13T08:30:00Z" },
  { id: "TXN-007", orderId: "ORD-2026-0007", customerName: "Ritu Agarwal", amount: 1599, method: "Razorpay", status: "success", date: "2026-06-12T15:20:00Z" },
];

const STATUS_CONFIG: Record<Transaction["status"], { label: string; cls: string }> = {
  success: { label: "Success", cls: "text-green-400 bg-green-400/10" },
  failed: { label: "Failed", cls: "text-red-400 bg-red-400/10" },
  pending: { label: "Pending", cls: "text-yellow-400 bg-yellow-400/10" },
};

export default function AdminPaymentsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: "razorpay", name: "Razorpay", icon: CreditCard, description: "Online payments via Razorpay gateway", enabled: true, color: "text-blue-400" },
    { id: "upi", name: "UPI / GPay / PhonePe", icon: Smartphone, description: "Direct UPI payments", enabled: true, color: "text-violet-400" },
    { id: "card", name: "Credit / Debit Card", icon: CreditCard, description: "Visa, Mastercard, Rupay", enabled: true, color: "text-champagne" },
    { id: "cod", name: "Cash on Delivery", icon: Truck, description: "Pay when your order arrives", enabled: true, color: "text-green-400" },
  ]);
  const [transactions] = useState(DEMO_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | Transaction["status"]>("all");

  const toggleMethod = (id: string) => {
    setMethods(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
    const m = methods.find(m => m.id === id);
    toast.success(`${m?.name} ${m?.enabled ? "disabled" : "enabled"}`);
  };

  const filtered = transactions.filter(t => {
    const matchSearch = t.customerName.toLowerCase().includes(search.toLowerCase()) || t.orderId.includes(search) || t.id.includes(search);
    const matchMethod = filterMethod === "all" || t.method === filterMethod;
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchMethod && matchStatus;
  });

  const successAmount = transactions.filter(t => t.status === "success").reduce((s, t) => s + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === "pending").reduce((s, t) => s + t.amount, 0);
  const failedCount = transactions.filter(t => t.status === "failed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ivory/90">Payments</h1>
        <p className="text-xs font-body text-ivory/30 mt-1">Manage payment methods and view transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
          <p className="font-display text-2xl text-green-400">₹{successAmount.toLocaleString()}</p>
          <p className="text-xs font-body text-ivory/40 mt-1">Collected</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
          <p className="font-display text-2xl text-yellow-400">₹{pendingAmount.toLocaleString()}</p>
          <p className="text-xs font-body text-ivory/40 mt-1">Pending</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
          <p className="font-display text-2xl text-red-400">{failedCount}</p>
          <p className="text-xs font-body text-ivory/40 mt-1">Failed Txns</p>
        </div>
      </div>

      {/* Payment methods */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-6">
        <h2 className="font-body text-sm font-semibold text-ivory/70 mb-4">Payment Methods</h2>
        <div className="space-y-3">
          {methods.map(m => (
            <div key={m.id} className="flex items-center justify-between p-4 bg-white/3 border border-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <m.icon size={16} className={m.color} />
                <div>
                  <p className="text-sm font-body font-semibold text-ivory/80">{m.name}</p>
                  <p className="text-[10px] font-body text-ivory/30">{m.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-body ${m.enabled ? "text-green-400" : "text-red-400"}`}>{m.enabled ? "Active" : "Disabled"}</span>
                <span onClick={() => toggleMethod(m.id)} className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 cursor-pointer ${m.enabled ? "bg-green-500" : "bg-white/10"}`}>
                  <span className={`w-4 h-4 rounded-full bg-white transition-transform ${m.enabled ? "translate-x-5" : ""}`} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..." className="w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body pl-9 pr-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/40" />
          </div>
          <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)} className="bg-white/5 border border-white/10 text-ivory/50 text-xs font-body px-3 py-2 rounded-sm focus:outline-none">
            <option value="all">All Methods</option>
            {["UPI", "Card", "Razorpay", "COD"].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)} className="bg-white/5 border border-white/10 text-ivory/50 text-xs font-body px-3 py-2 rounded-sm focus:outline-none">
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead className="border-b border-white/5">
                <tr className="text-ivory/30 tracking-widest uppercase">
                  <th className="text-left px-5 py-3">Txn ID</th>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">Method</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <motion.tr key={t.id} layout className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-champagne font-mono">{t.id}</p>
                      <p className="text-ivory/30 text-[10px]">{t.orderId}</p>
                    </td>
                    <td className="px-5 py-3 text-ivory/70">{t.customerName}</td>
                    <td className="px-5 py-3 text-ivory/80 font-semibold">₹{t.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-ivory/50">{t.method}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[t.status].cls}`}>{STATUS_CONFIG[t.status].label}</span>
                    </td>
                    <td className="px-5 py-3 text-ivory/30">{new Date(t.date).toLocaleDateString("en-IN")}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <CreditCard size={24} className="text-ivory/10 mx-auto mb-3" />
                <p className="font-body text-sm text-ivory/30">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
