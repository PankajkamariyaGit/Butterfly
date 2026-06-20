"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, AlertTriangle, TrendingDown, Search, ArrowUpDown } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import toast from "react-hot-toast";

export default function AdminInventoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(PRODUCTS.map(p => [p.id, p.stock]))
  );

  const products = useMemo(() => {
    let list = PRODUCTS.map(p => ({ ...p, stock: stocks[p.id] ?? p.stock }));
    if (filter === "low") list = list.filter(p => p.stock > 0 && p.stock <= 10);
    if (filter === "out") list = list.filter(p => p.stock === 0);
    if (search.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.includes(search));
    return list;
  }, [stocks, filter, search]);

  const totalProducts = PRODUCTS.length;
  const inStock = Object.values(stocks).filter(s => s > 10).length;
  const lowStock = Object.values(stocks).filter(s => s > 0 && s <= 10).length;
  const outOfStock = Object.values(stocks).filter(s => s === 0).length;

  const updateStock = (id: string, val: string) => {
    const n = parseInt(val);
    if (!isNaN(n) && n >= 0) setStocks(prev => ({ ...prev, [id]: n }));
  };

  const saveStock = (id: string) => {
    toast.success("Stock updated!");
  };

  const FILTERS = [
    { key: "all", label: "All Products", count: totalProducts },
    { key: "low", label: "Low Stock (≤10)", count: lowStock, color: "text-yellow-400" },
    { key: "out", label: "Out of Stock", count: outOfStock, color: "text-red-400" },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ivory/90">Inventory</h1>
        <p className="text-xs font-body text-ivory/30 mt-1">Track and manage product stock levels</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: totalProducts, icon: Package, color: "text-champagne", bg: "bg-champagne/10" },
          { label: "In Stock", value: inStock, icon: TrendingDown, color: "text-green-400", bg: "bg-green-400/10" },
          { label: "Low Stock", value: lowStock, icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-400/10" },
          { label: "Out of Stock", value: outOfStock, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white/5 border border-white/5 rounded-xl p-4">
            <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={16} className={color} />
            </div>
            <p className={`font-display text-3xl ${color}`}>{value}</p>
            <p className="text-xs font-body text-ivory/30 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 text-xs font-body transition-colors ${filter === f.key ? "bg-champagne/20 text-champagne" : "text-ivory/40 hover:text-ivory/70"}`}>
              {f.label} <span className={`ml-1 font-bold ${"color" in f ? f.color : ""}`}>{f.count}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or SKU..." className="w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-champagne/40" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead className="border-b border-white/5">
              <tr className="text-ivory/30 tracking-widest uppercase">
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">SKU</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Current Stock</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const stock = stocks[p.id] ?? p.stock;
                const status = stock === 0 ? { label: "Out of Stock", cls: "text-red-400 bg-red-400/10" }
                  : stock <= 5 ? { label: "Critical", cls: "text-red-400 bg-red-400/10" }
                  : stock <= 10 ? { label: "Low Stock", cls: "text-yellow-400 bg-yellow-400/10" }
                  : { label: "In Stock", cls: "text-green-400 bg-green-400/10" };
                return (
                  <motion.tr key={p.id} layout className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 text-ivory/80 font-medium">{p.name}</td>
                    <td className="px-5 py-3 text-ivory/40 font-mono">{p.sku}</td>
                    <td className="px-5 py-3 text-ivory/50">{p.category}</td>
                    <td className="px-5 py-3">
                      <span className={`font-bold text-base ${stock === 0 ? "text-red-400" : stock <= 10 ? "text-yellow-400" : "text-green-400"}`}>{stock}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${status.cls}`}>{status.label}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={stocks[p.id] ?? p.stock}
                          onChange={e => updateStock(p.id, e.target.value)}
                          className="w-20 bg-white/10 border border-white/10 text-ivory/70 text-xs font-body px-2 py-1.5 rounded focus:outline-none focus:border-champagne/50 text-center"
                        />
                        <button onClick={() => saveStock(p.id)} className="text-[10px] font-body text-champagne border border-champagne/30 px-2.5 py-1.5 rounded hover:bg-champagne/10 transition-colors">
                          Update
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="py-16 text-center">
            <ArrowUpDown size={28} className="text-ivory/10 mx-auto mb-3" />
            <p className="font-body text-sm text-ivory/30">No products match your filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
