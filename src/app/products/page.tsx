"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, List, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";

type SortOption = "popular" | "newest" | "price-asc" | "price-desc";

const PRICE_RANGES = [
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 – ₹3,500", min: 2000, max: 3500 },
  { label: "Above ₹3,500", min: 3500, max: Infinity },
];

function ProductsInner() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const filterParam = searchParams.get("filter") ?? "";
  const searchParam = searchParams.get("search") ?? "";
  const collectionParam = searchParams.get("collection") ?? "";

  // Map festive collection slugs to category/badge filters
  const COLLECTION_MAP: Record<string, string[]> = {
    "diwali": ["bridal-collection", "bangles", "necklaces"],
    "navratri": ["bangles", "earrings"],
    "karwa-chauth": ["rings", "necklaces", "hair-accessories"],
    "bridal": ["bridal-collection"],
  };

  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortOption>("popular");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState(searchParam);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (filterParam === "new") list = list.filter((p) => p.newArrival);
    if (filterParam === "bestseller") list = list.filter((p) => p.bestseller);
    if (filterParam === "featured") list = list.filter((p) => p.featured);

    // Handle festive collection param
    if (collectionParam && COLLECTION_MAP[collectionParam]) {
      list = list.filter((p) => COLLECTION_MAP[collectionParam].includes(p.categorySlug));
    }

    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.categorySlug));
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      list = list.filter(
        (p) => p.discountPrice >= range.min && p.discountPrice <= range.max
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case "price-desc":
        list.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case "newest":
        list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      default:
        list.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  }, [filterParam, collectionParam, selectedCategories, selectedPriceRange, search, sort]);

  const toggleCategory = useCallback((slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  }, []);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setSearch("");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedPriceRange !== null || search;

  const activeFilterCount = selectedCategories.length + (selectedPriceRange !== null ? 1 : 0);

  const filterPanelJSX = (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-champagne mb-4">Category</h3>
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
              <span
                onClick={() => toggleCategory(cat.slug)}
                className={`w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                  selectedCategories.includes(cat.slug) ? "bg-champagne border-champagne" : "border-champagne/30 group-hover:border-champagne"
                }`}
              >
                {selectedCategories.includes(cat.slug) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span onClick={() => toggleCategory(cat.slug)} className={`text-sm font-body transition-colors ${selectedCategories.includes(cat.slug) ? "text-champagne" : "text-mink group-hover:text-champagne"}`}>
                {cat.name}
              </span>
              <span className="ml-auto text-xs text-mink-light/60">{cat.productCount}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-champagne mb-4">Price Range</h3>
        <div className="space-y-2.5">
          {PRICE_RANGES.map((range, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <span
                onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                  selectedPriceRange === i ? "border-champagne" : "border-champagne/30 group-hover:border-champagne"
                }`}
              >
                {selectedPriceRange === i && <span className="w-2 h-2 rounded-full bg-champagne" />}
              </span>
              <span onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)} className={`text-sm font-body transition-colors ${selectedPriceRange === i ? "text-champagne" : "text-mink group-hover:text-champagne"}`}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      {/* Page Header */}
      <div className="bg-pearl border-b border-champagne/15 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-body text-champagne tracking-[0.3em] uppercase mb-2">
            ✦ Our Collections
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-obsidian">
            {filterParam === "new"
              ? "New Arrivals"
              : filterParam === "bestseller"
              ? "Bestsellers"
              : categoryParam
              ? CATEGORIES.find((c) => c.slug === categoryParam)?.name ?? "Collection"
              : "All Jewellery"}
          </h1>
          <div className="section-divider mt-4" />
          <p className="text-sm font-body text-mink-light mt-4">
            {filtered.length} pieces found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Filter toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-champagne/30 text-xs font-body text-mink tracking-widest uppercase hover:border-champagne hover:text-champagne transition-colors rounded-sm"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-champagne text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Search — flex-1 so it fills remaining row space */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="luxury-input flex-1 min-w-0 py-2.5 text-sm"
          />

          {/* Sort */}
          <div className="relative flex-shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none luxury-input py-2.5 pr-8 text-xs cursor-pointer w-full sm:min-w-[160px]"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-mink-light pointer-events-none" />
          </div>

          {/* Grid/List toggle */}
          <div className="flex border border-champagne/20 rounded-sm overflow-hidden flex-shrink-0">
            <button
              onClick={() => setView("grid")}
              className={`p-2.5 transition-colors ${view === "grid" ? "bg-champagne text-white" : "text-mink hover:text-champagne"}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2.5 transition-colors ${view === "list" ? "bg-champagne text-white" : "text-mink hover:text-champagne"}`}
            >
              <List size={16} />
            </button>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs font-body text-rose-gold hover:text-rose-gold-dark flex items-center gap-1 flex-shrink-0">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* ── Mobile Filter Drawer (bottom sheet) ── */}
        <AnimatePresence>
          {filtersOpen && (
            <>
              {/* Backdrop — simple div, no AnimatePresence */}
              <div
                className="fixed inset-0 bg-black/50 z-[900] lg:hidden"
                onClick={() => setFiltersOpen(false)}
              />
              {/* Bottom sheet — CSS transition only */}
              <div className="fixed bottom-0 left-0 right-0 z-[910] bg-ivory rounded-t-2xl shadow-2xl p-6 pb-24 max-h-[85vh] overflow-y-auto lg:hidden">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl text-obsidian">Filters</h2>
                  <button onClick={() => setFiltersOpen(false)} className="p-2 hover:bg-champagne/10 rounded-full transition-colors">
                    <X size={18} className="text-mink" />
                  </button>
                </div>
                {filterPanelJSX}
                <div className="flex gap-3 mt-8 pt-5 border-t border-champagne/15">
                  {hasActiveFilters && (
                    <button onClick={() => { clearFilters(); setFiltersOpen(false); }} className="flex-1 py-3 border border-champagne/30 text-xs font-body text-mink rounded-sm tracking-widest uppercase hover:border-champagne transition-colors">
                      Clear All
                    </button>
                  )}
                  <button onClick={() => setFiltersOpen(false)} className="flex-1 py-3 bg-champagne text-white text-xs font-body rounded-sm tracking-widest uppercase hover:bg-champagne/90 transition-colors">
                    Show {filtered.length} Results
                  </button>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>

        <div className="flex gap-8">
          {/* ── Desktop Sidebar Filters ── */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.aside
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 256 }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block flex-shrink-0 overflow-hidden"
              >
                <div className="w-64">
                  {filterPanelJSX}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🦋</div>
                <h3 className="font-display text-2xl text-obsidian mb-2">
                  No pieces found
                </h3>
                <p className="text-sm font-body text-mink-light mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-outline-luxury"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className={
                  view === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                    : "flex flex-col gap-5"
                }
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} view={view} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsInner />
    </Suspense>
  );
}
