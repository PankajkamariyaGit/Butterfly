"use client";
import { useState } from "react";
import { REVIEWS, PRODUCTS } from "@/lib/data";
import { Check, X, Trash2, Star, Filter, BookmarkCheck } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

type ReviewWithFeatured = typeof REVIEWS[0] & { featured?: boolean };

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithFeatured[]>(REVIEWS);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const approve = (id: string) => { setReviews(r => r.map(v => v.id === id ? { ...v, approved: true } : v)); toast.success("Review approved"); };
  const reject = (id: string) => { setReviews(r => r.map(v => v.id === id ? { ...v, approved: false } : v)); toast.success("Review hidden"); };
  const del = (id: string) => { setReviews(r => r.filter(v => v.id !== id)); toast.success("Review deleted"); };
  const toggleFeatured = (id: string) => {
    setReviews(r => r.map(v => v.id === id ? { ...v, featured: !v.featured } : v));
    const rev = reviews.find(r => r.id === id);
    toast.success(rev?.featured ? "Removed from featured" : "Marked as featured!");
  };

  const filtered = reviews.filter(r => {
    if (filter === "pending" && r.approved) return false;
    if (filter === "approved" && !r.approved) return false;
    if (ratingFilter && r.rating !== ratingFilter) return false;
    return true;
  });

  const pendingCount = reviews.filter(r => !r.approved).length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">Reviews</h1>
          <p className="text-xs font-body text-ivory/30 mt-1">{reviews.length} total · {pendingCount} pending · ⭐ {avgRating} avg</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Status filter */}
          {(["all", "pending", "approved"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-body px-3 py-1.5 rounded-sm border transition-colors capitalize ${filter === f ? "bg-champagne/20 border-champagne/50 text-champagne" : "border-white/10 text-ivory/40 hover:text-ivory/70"}`}
            >
              {f} {f === "pending" && pendingCount > 0 && <span className="ml-1 bg-rose-gold text-white text-[9px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
            </button>
          ))}
          {/* Star filter */}
          <div className="flex items-center gap-1 border border-white/10 rounded-sm px-2">
            <Filter size={10} className="text-ivory/30" />
            {[5, 4, 3, 2, 1].map(n => (
              <button key={n} onClick={() => setRatingFilter(ratingFilter === n ? null : n)} className={`text-xs px-1 py-1 transition-colors ${ratingFilter === n ? "text-champagne" : "text-ivory/30 hover:text-ivory/60"}`}>
                {n}★
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-ivory/30 font-body text-center py-10">No reviews match the filter</p>
        )}
        {filtered.map(r => {
          const product = PRODUCTS.find(p => p.id === r.productId);
          return (
            <div key={r.id} className={`bg-white/5 border rounded-sm p-5 transition-colors ${!r.approved ? "border-yellow-400/20" : "border-white/5"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="w-8 h-8 rounded-full bg-gradient-luxury flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{r.avatar}</div>
                    <div>
                      <p className="text-sm font-body font-semibold text-ivory/80">{r.user}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={10} fill={i < r.rating ? "#D4A017" : "none"} stroke={i < r.rating ? "#D4A017" : "rgba(255,255,255,0.2)"} />
                        ))}
                      </div>
                    </div>
                    <span className={`text-[10px] font-body font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm ${r.approved ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
                      {r.approved ? "Approved" : "Pending"}
                    </span>
                    {product && (
                      <span className="text-[10px] font-body text-champagne/60 bg-champagne/5 border border-champagne/15 px-2 py-0.5 rounded-sm">
                        {product.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-body text-ivory/60 italic mb-2">&ldquo;{r.comment}&rdquo;</p>
                  {r.photos && r.photos.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2 mb-2">
                      {r.photos.map((photo, i) => (
                        <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/10">
                          <Image src={photo} alt={`Review photo ${i+1}`} fill className="object-cover" unoptimized />
                        </div>
                      ))}
                    </div>
                  )}
                  {r.videoUrl && (
                    <a href={r.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-body text-red-400/70 hover:text-red-400 border border-red-400/20 px-2 py-1 rounded mb-2 transition-colors">
                      ▶ View Video Review
                    </a>
                  )}
                  <p className="text-[10px] font-body text-ivory/20">{new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => toggleFeatured(r.id)} className={`p-1.5 border rounded-sm transition-colors ${r.featured ? "text-champagne border-champagne/40 bg-champagne/10" : "text-ivory/20 border-white/10 hover:text-champagne hover:border-champagne/30"}`} title={r.featured ? "Remove from Featured" : "Mark as Featured"}>
                    <BookmarkCheck size={14} />
                  </button>
                  {!r.approved && (
                    <button onClick={() => approve(r.id)} className="text-green-400/60 hover:text-green-400 p-1.5 border border-green-400/20 rounded-sm hover:bg-green-400/5 transition-colors" title="Approve">
                      <Check size={14} />
                    </button>
                  )}
                  {r.approved && (
                    <button onClick={() => reject(r.id)} className="text-yellow-400/60 hover:text-yellow-400 p-1.5 border border-yellow-400/20 rounded-sm hover:bg-yellow-400/5 transition-colors" title="Hide">
                      <X size={14} />
                    </button>
                  )}
                  <button onClick={() => del(r.id)} className="text-red-400/60 hover:text-red-400 p-1.5 border border-red-400/20 rounded-sm hover:bg-red-400/5 transition-colors" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
