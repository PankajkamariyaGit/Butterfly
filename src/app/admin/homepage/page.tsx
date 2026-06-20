"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, LayoutDashboard, Image as ImageIcon, Star, ShoppingBag, Type, Megaphone } from "lucide-react";
import toast from "react-hot-toast";

type HomepageConfig = {
  heroBannerActive: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroImage: string;
  flashSaleActive: boolean;
  flashSaleText: string;
  flashSaleCode: string;
  bestSellersActive: boolean;
  bestSellersTitle: string;
  newArrivalsActive: boolean;
  newArrivalsTitle: string;
  festiveSectionActive: boolean;
  festiveSectionTitle: string;
  instagramActive: boolean;
  instagramHandle: string;
  promo1Active: boolean;
  promo1Text: string;
  promo1Color: string;
  testimonialSectionActive: boolean;
};

const defaultConfig: HomepageConfig = {
  heroBannerActive: true,
  heroTitle: "Jewellery That Lets You Bloom",
  heroSubtitle: "Discover exclusive pieces crafted for women who celebrate every moment.",
  heroCtaText: "Explore Collection",
  heroImage: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=2000&q=95",
  flashSaleActive: true,
  flashSaleText: "⚡ FLASH SALE — Extra 10% OFF Sitewide",
  flashSaleCode: "FLASH10",
  bestSellersActive: true,
  bestSellersTitle: "Bestsellers",
  newArrivalsActive: true,
  newArrivalsTitle: "New Arrivals",
  festiveSectionActive: true,
  festiveSectionTitle: "Festive Collections",
  instagramActive: true,
  instagramHandle: "@butterfly.jewellery",
  promo1Active: true,
  promo1Text: "Free shipping on all orders above ₹999 | Use code BUTTERFLY20 for 20% off",
  promo1Color: "#1A1409",
  testimonialSectionActive: true,
};

const SECTION_TABS = [
  { id: "hero", label: "Hero Banner", icon: ImageIcon },
  { id: "promo", label: "Promo Bar", icon: Megaphone },
  { id: "flash", label: "Flash Sale", icon: ShoppingBag },
  { id: "sections", label: "Sections", icon: LayoutDashboard },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "instagram", label: "Instagram", icon: Type },
] as const;

export default function AdminHomepagePage() {
  const [config, setConfig] = useState<HomepageConfig>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("butterfly-homepage-config");
      if (stored) return { ...defaultConfig, ...JSON.parse(stored) };
    }
    return defaultConfig;
  });
  const [tab, setTab] = useState<typeof SECTION_TABS[number]["id"]>("hero");
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof HomepageConfig>(k: K, v: HomepageConfig[K]) => setConfig(c => ({ ...c, [k]: v }));

  const handleSave = () => {
    localStorage.setItem("butterfly-homepage-config", JSON.stringify(config));
    setSaved(true);
    toast.success("Homepage settings saved!");
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = "w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body px-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50";
  const labelCls = "text-[10px] font-body text-ivory/30 tracking-widest uppercase block mb-1.5";

  const Toggle = ({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) => (
    <label className="flex items-center gap-3 cursor-pointer mb-4">
      <span onClick={() => onChange(!value)} className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${value ? "bg-champagne" : "bg-white/10"}`}>
        <span className={`w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-5" : ""}`} />
      </span>
      <span className="text-sm font-body text-ivory/60">{label}</span>
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">Homepage Management</h1>
          <p className="text-xs font-body text-ivory/30 mt-1">Edit homepage content without touching code</p>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-white/10 text-ivory/50 text-xs font-body rounded-sm hover:border-champagne/30 hover:text-champagne transition-colors">
            <Eye size={13} /> Preview
          </a>
          <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2 text-xs font-body font-semibold rounded-sm transition-all ${saved ? "bg-green-500 text-white" : "bg-champagne text-obsidian hover:bg-champagne-dark"}`}>
            <Save size={13} /> {saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-white/3 border border-white/5 rounded-lg p-1">
        {SECTION_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-body rounded transition-colors ${tab === t.id ? "bg-champagne/20 text-champagne" : "text-ivory/40 hover:text-ivory/70"}`}>
            <t.icon size={12} /> {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-5">

        {tab === "hero" && (
          <>
            <Toggle value={config.heroBannerActive} onChange={v => set("heroBannerActive", v)} label="Hero Banner Active" />
            <div>
              <label className={labelCls}>Main Heading</label>
              <input value={config.heroTitle} onChange={e => set("heroTitle", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Subtitle Text</label>
              <textarea value={config.heroSubtitle} onChange={e => set("heroSubtitle", e.target.value)} rows={2} className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className={labelCls}>CTA Button Text</label>
              <input value={config.heroCtaText} onChange={e => set("heroCtaText", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Hero Background Image URL</label>
              <input value={config.heroImage} onChange={e => set("heroImage", e.target.value)} placeholder="https://..." className={inputCls} />
              <p className="text-[10px] text-ivory/20 mt-1 font-body">Use high-res images (2000px+ wide) for best quality</p>
            </div>
          </>
        )}

        {tab === "promo" && (
          <>
            <div>
              <label className={labelCls}>Announcement Bar Text</label>
              <input value={config.promo1Text} onChange={e => set("promo1Text", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Background Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={config.promo1Color} onChange={e => set("promo1Color", e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border border-white/10" />
                <input value={config.promo1Color} onChange={e => set("promo1Color", e.target.value)} className={inputCls + " flex-1"} />
              </div>
            </div>
          </>
        )}

        {tab === "flash" && (
          <>
            <Toggle value={config.flashSaleActive} onChange={v => set("flashSaleActive", v)} label="Flash Sale Bar Active" />
            <div>
              <label className={labelCls}>Flash Sale Text</label>
              <input value={config.flashSaleText} onChange={e => set("flashSaleText", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Coupon Code</label>
              <input value={config.flashSaleCode} onChange={e => set("flashSaleCode", e.target.value)} className={inputCls} placeholder="e.g. FLASH10" />
            </div>
          </>
        )}

        {tab === "sections" && (
          <>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 bg-white/3 rounded-lg border border-white/5">
                <Toggle value={config.bestSellersActive} onChange={v => set("bestSellersActive", v)} label="Show Bestsellers Section" />
                <div>
                  <label className={labelCls}>Bestsellers Title</label>
                  <input value={config.bestSellersTitle} onChange={e => set("bestSellersTitle", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="space-y-4 p-4 bg-white/3 rounded-lg border border-white/5">
                <Toggle value={config.newArrivalsActive} onChange={v => set("newArrivalsActive", v)} label="Show New Arrivals Section" />
                <div>
                  <label className={labelCls}>New Arrivals Title</label>
                  <input value={config.newArrivalsTitle} onChange={e => set("newArrivalsTitle", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="space-y-4 p-4 bg-white/3 rounded-lg border border-white/5">
                <Toggle value={config.festiveSectionActive} onChange={v => set("festiveSectionActive", v)} label="Show Festive Collections Section" />
                <div>
                  <label className={labelCls}>Festive Section Title</label>
                  <input value={config.festiveSectionTitle} onChange={e => set("festiveSectionTitle", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="space-y-4 p-4 bg-white/3 rounded-lg border border-white/5">
                <Toggle value={config.testimonialSectionActive} onChange={v => set("testimonialSectionActive", v)} label="Show Testimonials Section" />
              </div>
            </div>
          </>
        )}

        {tab === "testimonials" && (
          <div className="text-center py-8">
            <Star size={28} className="text-champagne/30 mx-auto mb-3" />
            <p className="font-body text-sm text-ivory/40">Testimonials are managed via the <strong className="text-champagne">Reviews</strong> section.</p>
            <p className="text-xs font-body text-ivory/20 mt-1">Approved reviews automatically appear in the homepage testimonials carousel.</p>
          </div>
        )}

        {tab === "instagram" && (
          <>
            <Toggle value={config.instagramActive} onChange={v => set("instagramActive", v)} label="Show Instagram Gallery Section" />
            <div>
              <label className={labelCls}>Instagram Handle</label>
              <input value={config.instagramHandle} onChange={e => set("instagramHandle", e.target.value)} placeholder="@butterfly.jewellery" className={inputCls} />
            </div>
            <p className="text-xs font-body text-ivory/30 bg-white/5 rounded-lg p-3">
              💡 Connect a real Instagram API to auto-pull latest posts. Currently shows curated UGC gallery.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
