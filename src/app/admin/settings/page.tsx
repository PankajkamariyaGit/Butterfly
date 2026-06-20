"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { Save, RefreshCw } from "lucide-react";

const DEFAULT_SETTINGS = {
  storeName: "Butterfly Fine Jewellery",
  tagline: "Where Every Woman Blooms",
  contactEmail: "support@butterfly.in",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  address: "Mumbai, Maharashtra, India",
  instagram: "@butterfly_jewellery",
  facebook: "ButterflyJewellery",
  youtube: "ButterflyJewels",
  pinterest: "butterfly_jewellery",
  shippingCharge: 99,
  freeShippingAbove: 999,
  codEnabled: true,
  codLimit: 5000,
  razorpayKey: "rzp_test_xxxxxxxxxxxx",
  razorpaySecret: "",
  gstRate: 3,
  gstNumber: "27AABCU9603R1ZX",
  returnDays: 7,
  announcementBanner: "🎉 Free shipping on orders above ₹999! Use code BUTTERFLY20 for 20% off.",
  bannerActive: true,
  notificationEmail: "admin@butterfly.in",
  lowStockThreshold: 5,
  metaTitle: "Butterfly — Premium Artificial Jewellery India",
  metaDescription: "Shop luxury artificial jewellery — necklaces, earrings, bangles, rings crafted with love in India.",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("butterfly-settings");
      if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    } catch {}
  }, []);

  const set = (k: string, v: unknown) => { setSettings(s => ({ ...s, [k]: v })); setSaved(false); };

  const save = () => {
    try {
      localStorage.setItem("butterfly-settings", JSON.stringify(settings));
      setSaved(true);
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const reset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("butterfly-settings");
    setSaved(false);
    toast.success("Settings reset to defaults");
  };
  const inputCls = "w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body px-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50";
  const labelCls = "text-[10px] font-body text-ivory/30 tracking-widest uppercase block mb-1.5";

  const Toggle = ({ k, label }: { k: string; label: string }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <span onClick={() => set(k, !(settings as Record<string, unknown>)[k])} className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${(settings as Record<string, unknown>)[k] ? "bg-champagne" : "bg-white/10"}`}>
        <span className={`w-4 h-4 rounded-full bg-white transition-transform ${(settings as Record<string, unknown>)[k] ? "translate-x-5" : "translate-x-0"}`} />
      </span>
      <span className="text-sm font-body text-ivory/60">{label}</span>
    </label>
  );

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">Settings</h1>
          <p className="text-xs font-body text-ivory/30 mt-1">Configure your store preferences — saved to browser storage</p>
        </div>
        <div className="flex gap-3">
          <button onClick={reset} className="flex items-center gap-2 text-xs text-ivory/40 hover:text-ivory/70 font-body px-3 py-2 border border-white/10 rounded-sm transition-colors">
            <RefreshCw size={12} /> Reset Defaults
          </button>
          <button onClick={save} className={`flex items-center gap-2 text-xs font-body px-4 py-2 rounded-sm transition-all ${saved ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-champagne text-obsidian border border-champagne hover:bg-champagne/90"}`}>
            <Save size={12} /> {saved ? "Saved ✓" : "Save All Settings"}
          </button>
        </div>
      </div>

      {/* Store Information */}
      <div className="bg-white/5 border border-white/5 rounded-sm p-6">
        <h2 className="font-display text-xl text-ivory/80 mb-5">Store Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Store Name", key: "storeName", type: "text" },
            { label: "Tagline", key: "tagline", type: "text" },
            { label: "Contact Email", key: "contactEmail", type: "email" },
            { label: "Phone Number", key: "phone", type: "text" },
            { label: "WhatsApp Number", key: "whatsapp", type: "text" },
          ].map(f => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <input type={f.type} value={(settings as Record<string, unknown>)[f.key] as string} onChange={e => set(f.key, e.target.value)} className={inputCls} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className={labelCls}>Store Address</label>
            <input type="text" value={settings.address} onChange={e => set("address", e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="bg-white/5 border border-white/5 rounded-sm p-6">
        <h2 className="font-display text-xl text-ivory/80 mb-5">Announcement Banner</h2>
        <div className="space-y-4">
          <Toggle k="bannerActive" label="Show announcement banner on site" />
          <div>
            <label className={labelCls}>Banner Text</label>
            <input type="text" value={settings.announcementBanner} onChange={e => set("announcementBanner", e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white/5 border border-white/5 rounded-sm p-6">
        <h2 className="font-display text-xl text-ivory/80 mb-5">Social Media</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Instagram Handle", key: "instagram" },
            { label: "Facebook Page", key: "facebook" },
            { label: "YouTube Channel", key: "youtube" },
            { label: "Pinterest", key: "pinterest" },
          ].map(f => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <input type="text" value={(settings as Record<string, unknown>)[f.key] as string} onChange={e => set(f.key, e.target.value)} className={inputCls} />
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Delivery */}
      <div className="bg-white/5 border border-white/5 rounded-sm p-6">
        <h2 className="font-display text-xl text-ivory/80 mb-5">Shipping & Delivery</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Shipping Charge (₹)</label>
            <input type="number" value={settings.shippingCharge} onChange={e => set("shippingCharge", Number(e.target.value))} className={inputCls} min={0} />
          </div>
          <div>
            <label className={labelCls}>Free Shipping Above (₹)</label>
            <input type="number" value={settings.freeShippingAbove} onChange={e => set("freeShippingAbove", Number(e.target.value))} className={inputCls} min={0} />
          </div>
          <div>
            <label className={labelCls}>Return Window (Days)</label>
            <input type="number" value={settings.returnDays} onChange={e => set("returnDays", Number(e.target.value))} className={inputCls} min={0} max={30} />
          </div>
          <div>
            <label className={labelCls}>Low Stock Alert Threshold</label>
            <input type="number" value={settings.lowStockThreshold} onChange={e => set("lowStockThreshold", Number(e.target.value))} className={inputCls} min={1} />
          </div>
        </div>
      </div>

      {/* Payments & GST */}
      <div className="bg-white/5 border border-white/5 rounded-sm p-6">
        <h2 className="font-display text-xl text-ivory/80 mb-5">Payments & GST</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Razorpay Key ID", key: "razorpayKey", type: "text" },
            { label: "Razorpay Secret Key", key: "razorpaySecret", type: "password" },
            { label: "GST Rate (%)", key: "gstRate", type: "number" },
            { label: "GST Number (GSTIN)", key: "gstNumber", type: "text" },
          ].map(f => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <input type={f.type} value={(settings as Record<string, unknown>)[f.key] as string} onChange={e => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)} className={inputCls} />
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-4">
          <Toggle k="codEnabled" label="Cash on Delivery Enabled" />
          {settings.codEnabled && (
            <div>
              <label className={labelCls}>COD Maximum Order Limit (₹)</label>
              <input type="number" value={settings.codLimit} onChange={e => set("codLimit", Number(e.target.value))} className={`${inputCls} max-w-[200px]`} min={0} />
            </div>
          )}
        </div>
      </div>

      {/* SEO & Meta */}
      <div className="bg-white/5 border border-white/5 rounded-sm p-6">
        <h2 className="font-display text-xl text-ivory/80 mb-5">SEO & Meta</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Meta Title</label>
            <input type="text" value={settings.metaTitle} onChange={e => set("metaTitle", e.target.value)} className={inputCls} maxLength={70} />
            <p className="text-[10px] text-ivory/20 mt-1">{settings.metaTitle.length}/70 characters</p>
          </div>
          <div>
            <label className={labelCls}>Meta Description</label>
            <textarea value={settings.metaDescription} onChange={e => set("metaDescription", e.target.value)} rows={2} maxLength={160} className={`${inputCls} resize-none`} />
            <p className="text-[10px] text-ivory/20 mt-1">{settings.metaDescription.length}/160 characters</p>
          </div>
          <div>
            <label className={labelCls}>Notification Email</label>
            <input type="email" value={settings.notificationEmail} onChange={e => set("notificationEmail", e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button onClick={reset} className="flex items-center gap-2 text-xs text-ivory/40 hover:text-ivory/70 font-body px-4 py-2 border border-white/10 rounded-sm transition-colors">
          <RefreshCw size={12} /> Reset to Defaults
        </button>
        <Button onClick={save}><Save size={14} /> Save All Settings</Button>
      </div>
    </div>
  );
}
