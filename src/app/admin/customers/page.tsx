"use client";
import { USERS, ORDERS } from "@/lib/data";
import { useState } from "react";
import { Search, X, ShoppingBag, Mail, Phone, Ban, CheckCircle } from "lucide-react";
import { useOrderStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type CustomerUser = typeof USERS[0] & { blocked?: boolean };

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const { orders: storedOrders } = useOrderStore();
  const allOrders = [...storedOrders, ...ORDERS].reduce((acc, o) => {
    if (!acc.find(x => x.id === o.id)) acc.push(o);
    return acc;
  }, [] as typeof ORDERS);

  const [customers, setCustomers] = useState<CustomerUser[]>(
    USERS.filter(u => u.role === "customer").map(u => ({ ...u, blocked: false }))
  );
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);

  const filtered = customers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBlock = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newBlocked = !c.blocked;
      toast.success(newBlocked ? "Customer blocked" : "Customer unblocked");
      return { ...c, blocked: newBlocked };
    }));
    setSelectedCustomer(prev => prev?.id === id ? { ...prev, blocked: !prev.blocked } : prev);
  };

  const customerOrders = selectedCustomer
    ? allOrders.filter(o => o.userId === selectedCustomer.id || o.customerEmail === selectedCustomer.email)
    : [];

  const statusColor: Record<string, string> = {
    placed: "text-blue-400 bg-blue-400/10",
    confirmed: "text-purple-400 bg-purple-400/10",
    shipped: "text-indigo-400 bg-indigo-400/10",
    delivered: "text-green-400 bg-green-400/10",
    cancelled: "text-red-400 bg-red-400/10",
    packed: "text-yellow-400 bg-yellow-400/10",
    out_for_delivery: "text-orange-400 bg-orange-400/10",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">Customers</h1>
          <p className="text-xs font-body text-ivory/30 mt-1">{customers.length} registered customers</p>
        </div>
        <div className="flex gap-4 text-xs font-body">
          <span className="text-green-400">{customers.filter(c => !c.blocked).length} Active</span>
          <span className="text-red-400">{customers.filter(c => c.blocked).length} Blocked</span>
        </div>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="bg-white/5 border border-white/10 text-ivory/70 text-sm font-body pl-9 pr-4 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50 placeholder:text-ivory/20 w-72" />
      </div>

      <div className="bg-white/5 border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead className="border-b border-white/5">
              <tr className="text-ivory/30 tracking-widest uppercase">
                {["Customer", "Email", "Phone", "Orders", "Total Spent", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map(u => {
                  const cOrders = allOrders.filter(o => o.userId === u.id || o.customerEmail === u.email);
                  const totalSpent = cOrders.reduce((s, o) => s + o.total, 0);
                  return (
                    <motion.tr
                      key={u.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`border-b border-white/5 last:border-0 transition-colors cursor-pointer ${u.blocked ? "opacity-50" : "hover:bg-white/3"}`}
                      onClick={() => setSelectedCustomer(u)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${u.blocked ? "bg-red-500/30" : "bg-gradient-luxury"}`}>{u.avatar}</div>
                          <span className="text-ivory/70">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ivory/50">{u.email}</td>
                      <td className="px-5 py-3 text-ivory/50">{u.phone || "—"}</td>
                      <td className="px-5 py-3 text-champagne font-semibold">{cOrders.length}</td>
                      <td className="px-5 py-3 text-ivory/70">₹{totalSpent.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3 text-ivory/40">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm ${u.blocked ? "text-red-400 bg-red-400/10" : "text-green-400 bg-green-400/10"}`}>
                          {u.blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedCustomer(u)} className="text-champagne/60 hover:text-champagne p-1 transition-colors" title="View Details">
                            <ShoppingBag size={14} />
                          </button>
                          <button onClick={() => toggleBlock(u.id)} className={`p-1 transition-colors ${u.blocked ? "text-green-400/60 hover:text-green-400" : "text-red-400/60 hover:text-red-400"}`} title={u.blocked ? "Unblock" : "Block"}>
                            {u.blocked ? <CheckCircle size={14} /> : <Ban size={14} />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#1A1409] border border-champagne/20 rounded-sm p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${selectedCustomer.blocked ? "bg-red-500/30" : "bg-gradient-luxury"}`}>{selectedCustomer.avatar}</div>
                  <div>
                    <h2 className="font-display text-2xl text-ivory/90">{selectedCustomer.name}</h2>
                    <p className="text-xs font-body text-ivory/40 mt-0.5">Customer since {new Date(selectedCustomer.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-ivory/40 hover:text-ivory"><X size={20} /></button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 rounded-sm p-3 flex items-center gap-3">
                  <Mail size={14} className="text-champagne" />
                  <div>
                    <p className="text-[10px] text-ivory/30 tracking-widest uppercase">Email</p>
                    <p className="text-sm text-ivory/70 font-body">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-sm p-3 flex items-center gap-3">
                  <Phone size={14} className="text-champagne" />
                  <div>
                    <p className="text-[10px] text-ivory/30 tracking-widest uppercase">Phone</p>
                    <p className="text-sm text-ivory/70 font-body">{selectedCustomer.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-sm p-3">
                  <p className="text-[10px] text-ivory/30 tracking-widest uppercase mb-1">Total Orders</p>
                  <p className="text-2xl font-display text-champagne">{customerOrders.length}</p>
                </div>
                <div className="bg-white/5 rounded-sm p-3">
                  <p className="text-[10px] text-ivory/30 tracking-widest uppercase mb-1">Total Spent</p>
                  <p className="text-2xl font-display text-champagne">₹{customerOrders.reduce((s, o) => s + o.total, 0).toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 p-3 bg-white/5 rounded-sm">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm ${selectedCustomer.blocked ? "text-red-400 bg-red-400/10" : "text-green-400 bg-green-400/10"}`}>
                    {selectedCustomer.blocked ? "BLOCKED" : "ACTIVE"}
                  </span>
                  <span className="text-xs text-ivory/40 font-body">{selectedCustomer.blocked ? "Cannot place orders" : "Account is active"}</span>
                </div>
                <button onClick={() => toggleBlock(selectedCustomer.id)} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-sm border transition-colors font-body ${selectedCustomer.blocked ? "border-green-500/40 text-green-400 hover:bg-green-500/10" : "border-red-500/40 text-red-400 hover:bg-red-500/10"}`}>
                  {selectedCustomer.blocked ? <><CheckCircle size={12} /> Unblock</> : <><Ban size={12} /> Block Customer</>}
                </button>
              </div>

              <div>
                <h3 className="font-display text-lg text-ivory/80 mb-4">Order History</h3>
                {customerOrders.length === 0 ? (
                  <p className="text-sm text-ivory/30 font-body text-center py-6">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {customerOrders.map(order => (
                      <div key={order.id} className="bg-white/5 border border-white/5 rounded-sm p-4">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <span className="text-xs font-body text-champagne font-semibold">{order.id}</span>
                          <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm ${statusColor[order.status] || "text-ivory/40 bg-white/5"}`}>
                            {order.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-body text-ivory/50">
                          <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""} · {new Date(order.placedAt).toLocaleDateString("en-IN")}</span>
                          <span className="text-ivory/80 font-semibold">₹{order.total.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
