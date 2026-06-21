"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Search, ToggleLeft, ToggleRight, X, Upload, Youtube, ExternalLink, Loader2 } from "lucide-react";
import { PRODUCTS, Product } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import toast from "react-hot-toast";

type FormState = Omit<Product, "id" | "slug" | "rating" | "reviewCount"> & {
  images: string[];
  videoUrl: string;
};

const EMPTY_FORM: FormState = {
  name: "", price: 0, discountPrice: 0, category: "Earrings", categorySlug: "earrings",
  stock: 0, badge: null, description: "", material: "", careInstructions: "",
  featured: false, bestseller: false, newArrival: false, active: true, sku: "", tags: [],
  images: [""],
  videoUrl: "",
};

const CATEGORY_OPTIONS = [
  { label: "Earrings", slug: "earrings" },
  { label: "Necklaces", slug: "necklaces" },
  { label: "Bangles", slug: "bangles" },
  { label: "Rings", slug: "rings" },
  { label: "Anklets", slug: "anklets" },
  { label: "Hair Accessories", slug: "hair-accessories" },
  { label: "Bridal Collection", slug: "bridal-collection" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        // Fallback to static data if DB not ready
        setProducts(PRODUCTS);
      }
    } catch {
      setProducts(PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, images: [""] });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, price: p.price, discountPrice: p.discountPrice,
      category: p.category, categorySlug: p.categorySlug,
      stock: p.stock, badge: p.badge, description: p.description,
      material: p.material, careInstructions: p.careInstructions,
      featured: p.featured, bestseller: p.bestseller, newArrival: p.newArrival,
      active: p.active, sku: p.sku, tags: p.tags,
      images: p.images.length > 0 ? p.images : [""],
      videoUrl: "",
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  // Handle file upload → upload to server
  const handleFileUpload = async (idx: number, file: File) => {
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return; }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        const newImages = [...form.images];
        newImages[idx] = data.url;
        setForm(f => ({ ...f, images: newImages }));
        toast.success("Image uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
  };

  const addImageSlot = () => {
    if (form.images.length >= 10) { toast.error("Maximum 10 images allowed"); return; }
    setForm(f => ({ ...f, images: [...f.images, ""] }));
  };

  const removeImage = (idx: number) => {
    const newImages = form.images.filter((_, i) => i !== idx);
    setForm(f => ({ ...f, images: newImages.length > 0 ? newImages : [""] }));
  };

  const updateImageUrl = (idx: number, url: string) => {
    const newImages = [...form.images];
    newImages[idx] = url;
    setForm(f => ({ ...f, images: newImages }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    const validImages = form.images.filter(i => i.trim() !== "");
    if (validImages.length === 0) validImages.push("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80");

    const payload = {
      id: editingId || undefined,
      name: form.name, price: form.price, discountPrice: form.discountPrice,
      category: form.category, categorySlug: form.categorySlug,
      stock: form.stock, badge: form.badge, description: form.description,
      material: form.material, careInstructions: form.careInstructions,
      featured: form.featured, bestseller: form.bestseller, newArrival: form.newArrival,
      active: form.active, sku: form.sku, tags: form.tags,
      images: validImages, videoUrl: form.videoUrl,
    };

    try {
      const res = await fetch("/api/products", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success || data.id) {
        toast.success(editingId ? "Product updated!" : "Product added!");
        await fetchProducts();
      } else {
        toast.error(data.error || "Save failed");
      }
    } catch {
      toast.error("Failed to save product");
    }
    setSaving(false);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleActive = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(f => ({ ...f, [k]: v }));

  const inputCls = "w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body px-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50";
  const labelCls = "text-[10px] font-body text-ivory/30 tracking-widest uppercase block mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">Products</h1>
          <p className="text-xs font-body text-ivory/30 mt-1">{products.length} total Â· {products.filter(p => p.active).length} active Â· {products.filter(p => p.stock < 5).length} low stock</p>
        </div>
        <Button onClick={openAdd}><Plus size={14} /> Add Product</Button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full max-w-sm bg-white/5 border border-white/10 text-ivory/70 text-sm font-body pl-9 pr-4 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50 placeholder:text-ivory/20" />
      </div>

      <div className="bg-white/5 border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead className="border-b border-white/5">
              <tr className="text-ivory/30 tracking-widest uppercase">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map(p => (
                  <motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-sm overflow-hidden flex-shrink-0 bg-white/5">
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" unoptimized />
                        </div>
                        <div>
                          <p className="text-ivory/80 font-medium truncate max-w-[160px]">{p.name}</p>
                          <p className="text-ivory/30 text-[10px]">{p.sku} Â· {p.images.length} photo{p.images.length !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ivory/50">{p.category}</td>
                    <td className="px-5 py-3">
                      <span className="text-champagne font-semibold">â‚¹{p.discountPrice.toLocaleString()}</span>
                      <span className="text-ivory/30 ml-1 line-through">â‚¹{p.price.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={p.stock < 5 ? "text-red-400 font-bold" : p.stock < 10 ? "text-yellow-400" : "text-green-400"}>{p.stock}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleActive(p.id)}>
                        {p.active ? <ToggleRight size={20} className="text-green-400" /> : <ToggleLeft size={20} className="text-ivory/20" />}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="text-champagne/60 hover:text-champagne p-1"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-400/60 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#1A1409] border border-champagne/20 rounded-sm p-6 w-full max-w-3xl my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-ivory/90">{editingId ? "Edit Product" : "Add New Product"}</h2>
                <button onClick={() => setShowForm(false)} className="text-ivory/40 hover:text-ivory"><X size={20} /></button>
              </div>

              {/* IMAGES SECTION */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className={labelCls}>Product Images (1â€“10) *</label>
                  <span className="text-[10px] text-ivory/30 font-body">{form.images.filter(i => i).length}/10 added</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-square bg-white/5 border border-white/10 rounded-sm overflow-hidden flex items-center justify-center">
                        {img ? (
                          <Image src={img} alt={`img-${idx}`} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-ivory/20">
                            <Upload size={18} />
                            <span className="text-[9px] font-body">Photo {idx + 1}</span>
                          </div>
                        )}
                      </div>
                      {/* Upload button overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 rounded-sm">
                        <button
                          onClick={() => fileInputRefs.current[idx]?.click()}
                          className="text-[9px] text-white bg-champagne px-2 py-1 rounded font-body"
                        >
                          Upload
                        </button>
                        {img && (
                          <button onClick={() => removeImage(idx)} className="text-[9px] text-white bg-red-500 px-2 py-1 rounded font-body">
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        ref={el => { fileInputRefs.current[idx] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(idx, f); }}
                      />
                    </div>
                  ))}
                  {form.images.length < 10 && (
                    <button onClick={addImageSlot} className="aspect-square bg-white/3 border border-dashed border-white/20 rounded-sm flex flex-col items-center justify-center gap-1 hover:border-champagne/50 hover:bg-champagne/5 transition-colors">
                      <Plus size={18} className="text-ivory/30" />
                      <span className="text-[9px] font-body text-ivory/30">Add Image</span>
                    </button>
                  )}
                </div>
                {/* OR paste URL */}
                <div className="space-y-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-[10px] font-body text-ivory/30 w-5 text-center">{idx + 1}</span>
                      <input
                        type="url"
                        value={img}
                        onChange={e => updateImageUrl(idx, e.target.value)}
                        placeholder={`Image ${idx + 1} URL (or upload above)`}
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* VIDEO SECTION */}
              <div className="mb-6 border border-white/10 rounded-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Youtube size={16} className="text-red-400" />
                  <label className={labelCls + " mb-0"}>Product Video (Optional)</label>
                </div>
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={e => set("videoUrl", e.target.value)}
                  placeholder="YouTube URL: https://youtube.com/watch?v=... or short URL"
                  className={inputCls}
                />
                {form.videoUrl && (
                  <a href={form.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-champagne mt-2 hover:underline">
                    <ExternalLink size={10} /> Preview video
                  </a>
                )}
                <p className="text-[10px] text-ivory/20 mt-1 font-body">Accepts YouTube, Instagram Reel, or direct MP4 URL</p>
              </div>

              {/* PRODUCT DETAILS */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Product Name *</label>
                  <input type="text" value={form.name} onChange={e => set("name", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>SKU</label>
                  <input type="text" value={form.sku} onChange={e => set("sku", e.target.value)} placeholder="e.g. BFY-EAR-001" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>MRP (â‚¹) *</label>
                  <input type="number" value={form.price || ""} onChange={e => set("price", Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Selling Price (â‚¹) *</label>
                  <input type="number" value={form.discountPrice || ""} onChange={e => set("discountPrice", Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={form.category} onChange={e => { const opt = CATEGORY_OPTIONS.find(c => c.label === e.target.value); set("category", e.target.value); if (opt) set("categorySlug", opt.slug); }} className={inputCls}>
                    {CATEGORY_OPTIONS.map(c => <option key={c.slug}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Stock Quantity</label>
                  <input type="number" value={form.stock || ""} onChange={e => set("stock", Number(e.target.value))} className={inputCls} min={0} />
                </div>
                <div>
                  <label className={labelCls}>Material</label>
                  <input type="text" value={form.material} onChange={e => set("material", e.target.value)} placeholder="e.g. Gold-plated brass, Kundan" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Badge</label>
                  <select value={form.badge || ""} onChange={e => set("badge", (e.target.value || null) as Product["badge"])} className={inputCls}>
                    <option value="">No Badge</option>
                    <option>Bestseller</option><option>New Arrival</option>
                    <option>Limited Edition</option><option>Festive Pick</option><option>Trending</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className={inputCls + " resize-none"} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Care Instructions</label>
                  <textarea value={form.careInstructions} onChange={e => set("careInstructions", e.target.value)} rows={2} className={inputCls + " resize-none"} placeholder="e.g. Avoid water and perfume..." />
                </div>
              </div>

              {/* TOGGLES */}
              <div className="flex flex-wrap gap-5 mb-6 p-4 bg-white/3 rounded-sm">
                {(["featured", "bestseller", "newArrival", "active"] as const).map(k => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <span onClick={() => set(k, !form[k])} className={`w-9 h-5 rounded-full transition-all flex items-center px-0.5 ${form[k] ? "bg-champagne" : "bg-white/10"}`}>
                      <span className={`w-4 h-4 rounded-full bg-white transition-transform ${form[k] ? "translate-x-4" : "translate-x-0"}`} />
                    </span>
                    <span className="text-xs font-body text-ivory/60 capitalize">{k === "newArrival" ? "New Arrival" : k}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setShowForm(false)} className="text-ivory/50">Cancel</Button>
                <Button onClick={handleSave}>{editingId ? "Save Changes" : "Add Product"}</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
