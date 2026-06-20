"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, ChevronDown, Printer, FileText, Truck, RefreshCw } from "lucide-react";
import { ORDERS } from "@/lib/data";
import Image from "next/image";
import toast from "react-hot-toast";
import { useOrderStore } from "@/store";

const STATUS_OPTIONS = ["placed", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  placed: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  packed: "text-purple-400 bg-purple-400/10",
  shipped: "text-cyan-400 bg-cyan-400/10",
  out_for_delivery: "text-orange-400 bg-orange-400/10",
  delivered: "text-green-400 bg-green-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

export default function AdminOrdersPage() {
  const { orders: storedOrders, updateStatus: updateStoredStatus } = useOrderStore();
  const [hydrated, setHydrated] = useState(false);

  // One-time hydration flag — set after first render so Zustand localStorage is read
  useEffect(() => { setHydrated(true); }, []);

  // Merge live store orders (newest first) with static demo orders, dedup by id
  const allOrders = [...(hydrated ? storedOrders : []), ...ORDERS].reduce<typeof ORDERS>((acc, o) => {
    if (!acc.find((x) => x.id === o.id)) acc.push(o as typeof ORDERS[0]);
    return acc;
  }, []);

  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});
  const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({});
  const [couriers, setCouriers] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Merge local status overrides
  const orders = allOrders.map(o => localStatuses[o.id] ? { ...o, status: localStatuses[o.id] as typeof o.status } : o);

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: string) => {
    setLocalStatuses(prev => ({ ...prev, [id]: status }));
    updateStoredStatus(id, status as Parameters<typeof updateStoredStatus>[1]);
    toast.success("Order status updated");
  };

  const generateInvoiceHTML = (order: typeof orders[0]) => {
    const date = new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const invoiceNum = `INV-${order.id}`;
    const gst = Math.round(order.subtotal * 0.03);
    const itemRows = order.items.map(({ product, quantity }) => {
      const unit = product.discountPrice;
      const total = unit * quantity;
      return `<tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ede8;">
          <div style="font-weight:600;color:#1a1512;">${product.name}</div>
          <div style="font-size:11px;color:#8b6f5e;margin-top:2px;">${product.category}</div>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ede8;text-align:center;color:#4a3728;">${quantity}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ede8;text-align:right;color:#4a3728;">₹${unit.toLocaleString("en-IN")}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ede8;text-align:right;font-weight:600;color:#C9A84C;">₹${total.toLocaleString("en-IN")}</td>
      </tr>`;
    }).join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${invoiceNum}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; background: #FDFBF7; color: #1a1512; }
    .page { max-width: 800px; margin: 0 auto; padding: 48px 40px; }
    @media print { body { background: white; } .no-print { display: none; } }
  </style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:32px;border-bottom:3px solid #C9A84C;margin-bottom:32px;">
    <div>
      <div style="font-size:28px;font-weight:700;color:#C9A84C;letter-spacing:0.15em;">BUTTERFLY</div>
      <div style="font-size:11px;color:#8b6f5e;letter-spacing:0.2em;margin-top:2px;">FINE JEWELLERY</div>
      <div style="margin-top:12px;font-size:12px;color:#6b5040;line-height:1.8;">
        123 Jewellery Lane, Zaveri Bazaar<br/>Mumbai, Maharashtra – 400 003<br/>
        GST No: 27AABCB1234A1Z5<br/>
        support@butterfly.com &nbsp;|&nbsp; +91 98765 43210
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:22px;font-weight:700;color:#1a1512;letter-spacing:0.05em;">INVOICE</div>
      <div style="margin-top:8px;font-size:12px;color:#6b5040;line-height:2;">
        <strong>Invoice No:</strong> ${invoiceNum}<br/>
        <strong>Date:</strong> ${date}<br/>
        <strong>Order ID:</strong> ${order.id}
      </div>
      <div style="margin-top:12px;display:inline-block;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
        ${order.paymentStatus === "paid" ? "background:#dcfce7;color:#16a34a;" : "background:#fef9c3;color:#ca8a04;"}">
        ${order.paymentStatus === "paid" ? "PAID" : "PAYMENT PENDING"}
      </div>
    </div>
  </div>

  <!-- Bill To / Ship To -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px;">
    <div>
      <div style="font-size:10px;font-weight:700;letter-spacing:0.2em;color:#C9A84C;text-transform:uppercase;margin-bottom:10px;">Bill To</div>
      <div style="font-size:14px;font-weight:700;color:#1a1512;">${order.customerName}</div>
      <div style="font-size:12px;color:#6b5040;margin-top:4px;line-height:1.8;">
        ${order.customerEmail}<br/>${order.shippingAddress.phone}
      </div>
    </div>
    <div>
      <div style="font-size:10px;font-weight:700;letter-spacing:0.2em;color:#C9A84C;text-transform:uppercase;margin-bottom:10px;">Ship To</div>
      <div style="font-size:14px;font-weight:700;color:#1a1512;">${order.shippingAddress.name}</div>
      <div style="font-size:12px;color:#6b5040;margin-top:4px;line-height:1.8;">
        ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ", " + order.shippingAddress.line2 : ""}<br/>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} &ndash; ${order.shippingAddress.pincode}
      </div>
    </div>
  </div>

  <!-- Items Table -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="background:#C9A84C;">
        <th style="padding:12px 16px;text-align:left;color:white;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Item Description</th>
        <th style="padding:12px 16px;text-align:center;color:white;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Qty</th>
        <th style="padding:12px 16px;text-align:right;color:white;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Unit Price</th>
        <th style="padding:12px 16px;text-align:right;color:white;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display:flex;justify-content:flex-end;margin-bottom:32px;">
    <div style="width:280px;">
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0ede8;font-size:13px;color:#6b5040;">
        <span>Subtotal</span><span>₹${order.subtotal.toLocaleString("en-IN")}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0ede8;font-size:13px;color:#6b5040;">
        <span>Shipping</span><span>${order.shipping === 0 ? "Free" : "₹" + order.shipping}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0ede8;font-size:13px;color:#6b5040;">
        <span>GST @ 3%</span><span>₹${gst.toLocaleString("en-IN")}</span>
      </div>
      ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0ede8;font-size:13px;color:#16a34a;"><span>Discount</span><span>&minus;₹${order.discount.toLocaleString("en-IN")}</span></div>` : ""}
      <div style="display:flex;justify-content:space-between;padding:12px 0;background:#C9A84C15;border-radius:4px;padding-left:8px;padding-right:8px;margin-top:4px;">
        <span style="font-size:16px;font-weight:700;color:#1a1512;">Total</span>
        <span style="font-size:18px;font-weight:700;color:#C9A84C;">₹${order.total.toLocaleString("en-IN")}</span>
      </div>
      <div style="font-size:11px;color:#8b6f5e;margin-top:8px;text-align:right;">
        Payment: <strong>${order.paymentMethod.toUpperCase()}</strong>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="border-top:2px solid #C9A84C;padding-top:24px;display:flex;justify-content:space-between;align-items:flex-end;">
    <div>
      <div style="font-size:13px;font-weight:700;color:#1a1512;margin-bottom:4px;">Thank you for your order!</div>
      <div style="font-size:11px;color:#8b6f5e;line-height:1.8;">
        Returns accepted within 7 days of delivery.<br/>
        For support: support@butterfly.com | +91 98765 43210
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:11px;color:#8b6f5e;margin-bottom:4px;">Authorised Signatory</div>
      <div style="font-size:14px;font-style:italic;color:#C9A84C;margin-top:24px;">Butterfly Fine Jewellery</div>
      <div style="height:1px;width:140px;background:#C9A84C;margin-top:4px;margin-left:auto;"></div>
    </div>
  </div>

  <div style="text-align:center;margin-top:32px;font-size:10px;color:#b5a090;letter-spacing:0.15em;">
    ★ BUTTERFLY FINE JEWELLERY — EST. 2019 ★
  </div>
</div>

<div class="no-print" style="text-align:center;margin:20px;">
  <button onclick="window.print()" style="background:#C9A84C;color:white;border:none;padding:12px 32px;border-radius:4px;font-size:14px;cursor:pointer;letter-spacing:0.1em;">Print / Save as PDF</button>
</div>
</body></html>`;
  };

  const downloadInvoice = (order: typeof orders[0]) => {
    const html = generateInvoiceHTML(order);
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `invoice-${order.id}.html`;
    a.click();
    toast.success("Invoice downloaded!");
  };

  const printOrder = (order: typeof orders[0]) => {
    const html = generateInvoiceHTML(order);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">Orders</h1>
              <p className="text-xs font-body text-ivory/30 mt-1">{allOrders.length} total · {storedOrders.length} new orders</p>
        </div>
        <button
          onClick={() => { setHydrated(false); setTimeout(() => setHydrated(true), 50); toast.success("Orders refreshed"); }}
          className="flex items-center gap-1.5 text-[10px] font-body text-ivory/40 border border-white/10 px-3 py-1.5 rounded hover:border-champagne/30 hover:text-champagne transition-colors"
        >
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order ID or customer..." className="bg-white/5 border border-white/10 text-ivory/70 text-sm font-body pl-9 pr-4 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50 placeholder:text-ivory/20 w-64" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none bg-white/5 border border-white/10 text-ivory/60 text-xs font-body pl-3 pr-8 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50 capitalize">
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-ivory/30 pointer-events-none" />
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <motion.div key={order.id} layout className="bg-white/5 border border-white/5 rounded-sm overflow-hidden">
            {/* Header row */}
            <div
              className="flex flex-wrap items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-body font-semibold text-champagne">{order.id}</p>
                <p className="text-xs font-body text-ivory/40 mt-0.5">{order.customerName} · {order.customerEmail}</p>
              </div>
              <span className={`text-[10px] font-body font-semibold tracking-widest uppercase px-2.5 py-1 rounded-sm ${STATUS_COLORS[order.status]}`}>
                {order.status.replace(/_/g, " ")}
              </span>
              <p className="text-sm font-body font-semibold text-ivory/70">₹{order.total.toLocaleString()}</p>
              <div className="relative">
                <select
                  value={order.status}
                  onChange={(e) => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                  onClick={(e) => e.stopPropagation()}
                  className="appearance-none bg-white/5 border border-white/10 text-ivory/50 text-[10px] font-body pl-2 pr-6 py-1.5 rounded-sm focus:outline-none focus:border-champagne/50"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
                <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-ivory/30 pointer-events-none" />
              </div>
              <Eye size={14} className={`text-ivory/30 transition-transform ${expanded === order.id ? "rotate-180" : ""}`} />
            </div>

            {/* Expanded detail */}
            {expanded === order.id && (
              <div className="border-t border-white/5 px-5 py-4 bg-white/3">
                <div className="grid sm:grid-cols-3 gap-5 mb-4 text-xs font-body">
                  <div>
                    <p className="text-ivory/30 tracking-widest uppercase mb-1">Payment</p>
                    <p className="text-ivory/70 capitalize">{order.paymentMethod.replace(/_/g, " ")}</p>
                    <span className={`text-[10px] font-semibold ${order.paymentStatus === "paid" ? "text-green-400" : "text-yellow-400"}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-ivory/30 tracking-widest uppercase mb-1">Ship To</p>
                    <p className="text-ivory/70">{order.shippingAddress.name}</p>
                    <p className="text-ivory/40">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  </div>
                  <div>
                    <p className="text-ivory/30 tracking-widest uppercase mb-1">Placed</p>
                    <p className="text-ivory/70">{new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                </div>

                {/* Tracking fields */}
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-[10px] font-body text-ivory/30 tracking-widest uppercase mb-1">Courier</p>
                    <select value={couriers[order.id] ?? ""} onChange={e => setCouriers(prev => ({ ...prev, [order.id]: e.target.value }))} className="w-full bg-white/5 border border-white/10 text-ivory/60 text-xs font-body px-3 py-2 rounded-sm focus:outline-none focus:border-champagne/40">
                      <option value="">Select courier...</option>
                      {["Delhivery", "Shiprocket", "BlueDart", "DTDC", "Xpressbees", "Ecom Express"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] font-body text-ivory/30 tracking-widest uppercase mb-1">Tracking Number</p>
                    <input value={trackingNumbers[order.id] ?? ""} onChange={e => setTrackingNumbers(prev => ({ ...prev, [order.id]: e.target.value }))} placeholder="Enter tracking number..." className="w-full bg-white/5 border border-white/10 text-ivory/60 text-xs font-body px-3 py-2 rounded-sm focus:outline-none focus:border-champagne/40" />
                  </div>
                </div>
                {(couriers[order.id] || trackingNumbers[order.id]) && (
                  <div className="flex items-center gap-2 mb-4 text-xs font-body text-cyan-400/80 bg-cyan-400/5 border border-cyan-400/15 rounded px-3 py-1.5">
                    <Truck size={12} />
                    {couriers[order.id] && <span>{couriers[order.id]}</span>}
                    {trackingNumbers[order.id] && <span className="font-mono">{trackingNumbers[order.id]}</span>}
                  </div>
                )}

                <div className="flex gap-3 flex-wrap mb-4">
                  {order.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-2">
                      <div className="relative w-10 h-10 rounded-sm overflow-hidden bg-white/5 flex-shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="text-xs font-body">
                        <p className="text-ivory/60 truncate max-w-[120px]">{product.name}</p>
                        <p className="text-ivory/30">×{quantity} · ₹{(product.discountPrice * quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Invoice & Print actions */}
                <div className="flex gap-2 pt-3 border-t border-white/5">
                  <button onClick={() => downloadInvoice(order)} className="flex items-center gap-1.5 text-[10px] font-body text-champagne border border-champagne/30 px-3 py-1.5 rounded hover:bg-champagne/10 transition-colors">
                    <FileText size={11} /> Download Invoice
                  </button>
                  <button onClick={() => printOrder(order)} className="flex items-center gap-1.5 text-[10px] font-body text-ivory/50 border border-white/10 px-3 py-1.5 rounded hover:bg-white/5 transition-colors">
                    <Printer size={11} /> Print
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
