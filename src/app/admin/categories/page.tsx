"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import toast from "react-hot-toast";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  banner: string;
  description: string;
  active: boolean;
  productCount: number;
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: "c1", name: "Earrings", slug: "earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80", banner: "", description: "Studs, drops, jhumkas and more", active: true, productCount: 48 },
  { id: "c2", name: "Necklace Sets", slug: "necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80", banner: "", description: "Chokers, rani haars, layered necklaces", active: true, productCount: 36 },
  { id: "c3", name: "Bangles", slug: "bangles", image: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80", banner: "", description: "Glass bangles, kadas, stacked sets", active: true, productCount: 29 },
  { id: "c4", name: "Rings", slug: "rings", image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80", banner: "", description: "Statement rings, stacking sets", active: true, productCount: 22 },
  { id: "c5", name: "Bridal Collection", slug: "bridal-collection", image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80", banner: "", description: "Complete bridal jewellery sets", active: true, productCount: 18 },
  { id: "c6", name: "Festive Collection", slug: "festive-collection", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80", banner: "", description: "Diwali, Navratri & festive pieces", active: true, productCount: 31 },
  { id: "c7", name: "Hair Accessories", slug: "hair-accessories", image: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=400&q=80", banner: "", description: "Maang tikka, passa, hair pins", active: true, productCount: 15 },
  { id: "c8", name: "Anklets", slug: "anklets", image: "https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400&q=80", banner: "", description: "Payal, ankle chains", active: true, productCount: 12 },
];

const EMPTY: Category = { id: "", name: "", slug: "", image: "", banner: "", description: "", active: true, productCount: 0 };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Category>(EMPTY);

  const set = <K extends keyof Category>(k: K, v: Category[K]) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm({ ...EMPTY, id: `cat-${Date.now()}` }); setEditing(null); setShowForm(true); };
  const openEdit = (c: Category) => { setForm(c); setEditing(c.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Category name required"); return; }
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
    if (editing) {
      setCategories(prev => prev.map(c => c.id === editing ? { ...form, slug } : c));
      toast.success("Category updated!");
    } else {
      setCategories(prev => [...prev, { ...form, slug, id: `cat-${Date.now()}` }]);
      toast.success("Category added!");
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this category?")) return;
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success("Category deleted");
  };

  const inputCls = "w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body px-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">Categories</h1>
          <p className="text-xs font-body text-ivory/30 mt-1">{categories.length} categories · {categories.filter(c => c.active).length} active</p>
        </div>
        <Button onClick={openAdd}><Plus size={14} /> Add Category</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {categories.map((cat) => (
            <motion.div key={cat.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-champagne/30 transition-colors group">
              <div className="relative h-32 bg-white/3">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={28} className="text-ivory/20" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 right-2">
                  <span className={`text-[9px] font-body px-2 py-0.5 rounded-full font-semibold ${cat.active ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400"}`}>
                    {cat.active ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-body text-sm font-semibold text-ivory/90">{cat.name}</h3>
                    <p className="text-[10px] font-body text-ivory/30 mt-0.5">/{cat.slug}</p>
                    <p className="text-[10px] font-body text-ivory/50 mt-1 line-clamp-1">{cat.description}</p>
                    <p className="text-[10px] font-body text-champagne/60 mt-1">{cat.productCount} products</p>
                  </div>
                  <div className="flex gap-1.5 ml-2">
                    <button onClick={() => openEdit(cat)} className="text-champagne/50 hover:text-champagne p-1 transition-colors"><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-400/50 hover:text-red-400 p-1 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-[#1A1409] border border-champagne/20 rounded-xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-ivory/90">{editing ? "Edit Category" : "Add Category"}</h2>
                <button onClick={() => setShowForm(false)}><X size={18} className="text-ivory/40" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-ivory/30 tracking-widest uppercase block mb-1.5 font-body">Name *</label>
                    <input value={form.name} onChange={e => { set("name", e.target.value); set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-")); }} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-[10px] text-ivory/30 tracking-widest uppercase block mb-1.5 font-body">Slug</label>
                    <input value={form.slug} onChange={e => set("slug", e.target.value)} className={inputCls} placeholder="auto-generated" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-ivory/30 tracking-widest uppercase block mb-1.5 font-body">Description</label>
                  <input value={form.description} onChange={e => set("description", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-[10px] text-ivory/30 tracking-widest uppercase block mb-1.5 font-body">Category Image URL</label>
                  <input value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://..." className={inputCls} />
                  {form.image && (
                    <div className="mt-2 relative h-20 w-32 rounded-lg overflow-hidden">
                      <Image src={form.image} alt="preview" fill className="object-cover" unoptimized />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[10px] text-ivory/30 tracking-widest uppercase block mb-1.5 font-body">Category Banner URL (optional)</label>
                  <input value={form.banner} onChange={e => set("banner", e.target.value)} placeholder="Wide banner image for category page" className={inputCls} />
                </div>
                <div className="flex items-center gap-3">
                  <span onClick={() => set("active", !form.active)} className={`w-9 h-5 rounded-full transition-all flex items-center px-0.5 cursor-pointer ${form.active ? "bg-champagne" : "bg-white/10"}`}>
                    <span className={`w-4 h-4 rounded-full bg-white transition-transform ${form.active ? "translate-x-4" : ""}`} />
                  </span>
                  <span className="text-xs font-body text-ivory/50">{form.active ? "Visible on store" : "Hidden from store"}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <Button variant="ghost" onClick={() => setShowForm(false)} className="text-ivory/50">Cancel</Button>
                <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Category"}</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
