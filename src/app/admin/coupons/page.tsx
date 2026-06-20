"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { COUPONS, Coupon } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(COUPONS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Coupon, "id" | "usageCount">>({
    code: "", type: "percentage", value: 10, minOrderValue: 0, expiresAt: "", active: true,
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.code || !form.expiresAt) { toast.error("Code and expiry are required"); return; }
    if (editingId) {
      setCoupons((prev) => prev.map((c) => c.id === editingId ? { ...c, ...form } : c));
      toast.success("Coupon updated!");
    } else {
      setCoupons((prev) => [{ ...form, id: `c-${Date.now()}`, usageCount: 0 }, ...prev]);
      toast.success("Coupon created!");
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success("Coupon deleted");
  };

  const openEdit = (c: Coupon) => {
    setForm({ code: c.code, type: c.type, value: c.value, minOrderValue: c.minOrderValue, expiresAt: c.expiresAt, active: c.active });
    setEditingId(c.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">Coupons</h1>
          <p className="text-xs font-body text-ivory/30 mt-1">{coupons.length} active discount codes</p>
        </div>
        <Button onClick={() => { setForm({ code: "", type: "percentage", value: 10, minOrderValue: 0, expiresAt: "", active: true }); setEditingId(null); setShowForm(true); }}>
          <Plus size={14} /> New Coupon
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <motion.div key={c.id} layout className="bg-white/5 border border-white/5 rounded-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-lg font-body font-bold text-champagne tracking-widest">{c.code}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-body font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm ${c.active ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="text-champagne/50 hover:text-champagne p-1"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(c.id)} className="text-red-400/50 hover:text-red-400 p-1"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="space-y-2 text-xs font-body">
              <div className="flex justify-between text-ivory/50">
                <span>Discount</span>
                <span className="text-ivory/80 font-semibold">
                  {c.type === "percentage" ? `${c.value}%` : `₹${c.value}`} off
                </span>
              </div>
              <div className="flex justify-between text-ivory/50">
                <span>Min. Order</span>
                <span className="text-ivory/80">₹{c.minOrderValue}</span>
              </div>
              <div className="flex justify-between text-ivory/50">
                <span>Expires</span>
                <span className="text-ivory/80">{new Date(c.expiresAt).toLocaleDateString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-ivory/50">
                <span>Used</span>
                <span className="text-ivory/80">{c.usageCount} times</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#1A1409] border border-champagne/20 rounded-sm p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-ivory/90">{editingId ? "Edit Coupon" : "New Coupon"}</h2>
                <button onClick={() => setShowForm(false)} className="text-ivory/40 hover:text-ivory"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-body text-ivory/30 tracking-widest uppercase block mb-1.5">Coupon Code</label>
                  <input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} className="w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body px-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50 uppercase" placeholder="e.g. SAVE20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-body text-ivory/30 tracking-widest uppercase block mb-1.5">Type</label>
                    <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full bg-white/5 border border-white/10 text-ivory/60 text-sm font-body px-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-body text-ivory/30 tracking-widest uppercase block mb-1.5">Value</label>
                    <input type="number" value={form.value} onChange={(e) => set("value", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body px-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-body text-ivory/30 tracking-widest uppercase block mb-1.5">Min Order (₹)</label>
                    <input type="number" value={form.minOrderValue} onChange={(e) => set("minOrderValue", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body px-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50" />
                  </div>
                  <div>
                    <label className="text-[10px] font-body text-ivory/30 tracking-widest uppercase block mb-1.5">Expiry Date</label>
                    <input type="date" value={form.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} className="w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body px-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50" />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <span onClick={() => set("active", !form.active)} className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${form.active ? "bg-champagne" : "bg-white/10"}`}>
                    <span className={`w-4 h-4 rounded-full bg-white transition-transform ${form.active ? "translate-x-5" : "translate-x-0"}`} />
                  </span>
                  <span className="text-sm font-body text-ivory/60">Active</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowForm(false)} className="text-ivory/50 border-white/10">Cancel</Button>
                <Button onClick={handleSave}>{editingId ? "Save" : "Create"}</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
