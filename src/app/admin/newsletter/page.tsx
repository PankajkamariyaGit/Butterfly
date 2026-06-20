"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Mail, Download, Trash2, Search, Users } from "lucide-react";
import toast from "react-hot-toast";

type Subscriber = {
  id: string;
  email: string;
  name?: string;
  source: "newsletter" | "checkout" | "popup";
  joinedAt: string;
  active: boolean;
};

const DEMO_SUBSCRIBERS: Subscriber[] = [
  { id: "sub-1", email: "priya.sharma@gmail.com", name: "Priya Sharma", source: "newsletter", joinedAt: "2026-06-18T10:00:00Z", active: true },
  { id: "sub-2", email: "ananya.reddy@gmail.com", name: "Ananya Reddy", source: "checkout", joinedAt: "2026-06-17T14:30:00Z", active: true },
  { id: "sub-3", email: "meera.patel@gmail.com", source: "popup", joinedAt: "2026-06-16T09:15:00Z", active: true },
  { id: "sub-4", email: "kavya.nair@yahoo.com", name: "Kavya Nair", source: "newsletter", joinedAt: "2026-06-15T11:45:00Z", active: true },
  { id: "sub-5", email: "sneha.kulkarni@gmail.com", source: "checkout", joinedAt: "2026-06-14T16:00:00Z", active: false },
  { id: "sub-6", email: "deepa.menon@gmail.com", name: "Deepa Menon", source: "popup", joinedAt: "2026-06-13T08:30:00Z", active: true },
  { id: "sub-7", email: "ritu.agarwal@gmail.com", name: "Ritu Agarwal", source: "newsletter", joinedAt: "2026-06-12T12:00:00Z", active: true },
  { id: "sub-8", email: "pooja.iyer@gmail.com", source: "checkout", joinedAt: "2026-06-11T15:20:00Z", active: true },
  { id: "sub-9", email: "sunita.pandey@gmail.com", name: "Sunita Pandey", source: "newsletter", joinedAt: "2026-06-10T10:45:00Z", active: false },
  { id: "sub-10", email: "nandini.bose@gmail.com", name: "Nandini Bose", source: "popup", joinedAt: "2026-06-09T14:00:00Z", active: true },
];

const SOURCE_LABELS: Record<Subscriber["source"], string> = {
  newsletter: "Newsletter Footer",
  checkout: "Checkout",
  popup: "Exit-Intent Popup",
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState(DEMO_SUBSCRIBERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");

  const filtered = useMemo(() => {
    let list = subscribers;
    if (filter === "active") list = list.filter(s => s.active);
    if (filter === "unsubscribed") list = list.filter(s => !s.active);
    if (search.trim()) list = list.filter(s => s.email.toLowerCase().includes(search.toLowerCase()) || (s.name ?? "").toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [subscribers, filter, search]);

  const activeCount = subscribers.filter(s => s.active).length;

  const exportCSV = () => {
    const rows = [["Email", "Name", "Source", "Joined", "Status"]];
    filtered.forEach(s => rows.push([s.email, s.name ?? "", SOURCE_LABELS[s.source], new Date(s.joinedAt).toLocaleDateString("en-IN"), s.active ? "Active" : "Unsubscribed"]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `butterfly-subscribers-${Date.now()}.csv`;
    a.click();
    toast.success("CSV exported!");
  };

  const toggleActive = (id: string) => {
    setSubscribers(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const remove = (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    setSubscribers(prev => prev.filter(s => s.id !== id));
    toast.success("Subscriber removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">Newsletter Subscribers</h1>
          <p className="text-xs font-body text-ivory/30 mt-1">{activeCount} active · {subscribers.length} total</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-champagne/10 border border-champagne/30 text-champagne text-xs font-body font-semibold rounded-sm hover:bg-champagne/20 transition-colors">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Subscribers", value: subscribers.length, color: "text-champagne" },
          { label: "Active", value: activeCount, color: "text-green-400" },
          { label: "Unsubscribed", value: subscribers.length - activeCount, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
            <p className={`font-display text-3xl ${color}`}>{value}</p>
            <p className="text-xs font-body text-ivory/30 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-3">
        <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          {(["all", "active", "unsubscribed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-xs font-body capitalize transition-colors ${filter === f ? "bg-champagne/20 text-champagne" : "text-ivory/40 hover:text-ivory/70"}`}>{f}</button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search email or name..." className="w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body pl-9 pr-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/40" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead className="border-b border-white/5">
              <tr className="text-ivory/30 tracking-widest uppercase">
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Source</th>
                <th className="text-left px-5 py-3">Joined</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <motion.tr key={s.id} layout className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-ivory/80">{s.email}</td>
                  <td className="px-5 py-3 text-ivory/50">{s.name ?? "—"}</td>
                  <td className="px-5 py-3 text-ivory/40">{SOURCE_LABELS[s.source]}</td>
                  <td className="px-5 py-3 text-ivory/30">{new Date(s.joinedAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.active ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>
                      {s.active ? "Active" : "Unsub"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleActive(s.id)} className={`text-[10px] font-body px-2 py-1 rounded border transition-colors ${s.active ? "text-red-400 border-red-400/30 hover:bg-red-400/10" : "text-green-400 border-green-400/30 hover:bg-green-400/10"}`}>
                        {s.active ? "Unsub" : "Resubscribe"}
                      </button>
                      <button onClick={() => remove(s.id)} className="text-ivory/20 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Users size={24} className="text-ivory/10 mx-auto mb-3" />
              <p className="font-body text-sm text-ivory/30">No subscribers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
