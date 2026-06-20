"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, ArrowRight, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ButterflyLogo } from "@/components/ui/ButterflyLogo";
import { useCartStore, useWishlistStore, useAuthStore } from "@/store";
import { cn } from "@/lib/utils";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/products?filter=new" },
  {
    label: "Collections",
    href: "/products",
    children: [
      { label: "Bridal Collection", href: "/products?category=bridal-collection" },
      { label: "Necklaces", href: "/products?category=necklaces" },
      { label: "Earrings", href: "/products?category=earrings" },
      { label: "Bangles", href: "/products?category=bangles" },
      { label: "Rings", href: "/products?category=rings" },
      { label: "Hair Accessories", href: "/products?category=hair-accessories" },
      { label: "Anklets", href: "/products?category=anklets" },
    ],
  },
  { label: "Bridal", href: "/products?category=bridal-collection" },
  { label: "Bestsellers", href: "/products?filter=bestseller" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [announcementText, setAnnouncementText] = useState("✦ Free shipping on orders above ₹999 | Use code BUTTERFLY20 for 20% off ✦");
  const [bannerActive, setBannerActive] = useState(true);

  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Smart search suggestions
  const suggestions = searchQuery.trim().length >= 1
    ? PRODUCTS
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const categorySuggestions = searchQuery.trim().length >= 1
    ? CATEGORIES.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 2)
    : [];

  const TRENDING_SEARCHES = ["Bridal Necklace Set", "Gold Earrings", "Pearl Choker", "Maang Tikka", "Bangles Set"];

  const handleSearchSubmit = (q?: string) => {
    const query = q ?? searchQuery;
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Load announcement from settings
    try {
      const stored = localStorage.getItem("butterfly-settings");
      if (stored) {
        const s = JSON.parse(stored);
        if (s.announcementBanner) setAnnouncementText(s.announcementBanner);
        if (s.bannerActive === false) setBannerActive(false);
      }
    } catch {}
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <>
      {/* Announcement Bar */}
      {bannerActive && (
        <div className="bg-obsidian text-champagne-light text-center text-[11px] font-body tracking-[0.2em] uppercase py-2 px-4">
          {announcementText}
        </div>
      )}

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-ivory/95 backdrop-blur-xl shadow-luxury border-b border-champagne/10"
            : "bg-ivory/90 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-mink hover:text-champagne transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <ButterflyLogo size="md" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 text-sm font-body font-medium tracking-widest uppercase transition-colors duration-200",
                      pathname === link.href ? "text-champagne" : "text-mink hover:text-champagne"
                    )}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        size={12}
                        className={cn(
                          "transition-transform duration-200",
                          openDropdown === link.label && "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {/* Underline */}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px bg-gradient-luxury transition-all duration-300",
                      pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />

                  {/* Dropdown */}
                  {link.children && (
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-52 glass-card rounded-sm py-2 shadow-luxury-lg"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-5 py-2.5 text-xs font-body tracking-wider text-mink hover:text-champagne hover:bg-champagne/5 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-mink hover:text-champagne transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-mink hover:text-rose-gold transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-gold text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-mink hover:text-champagne transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-champagne text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>

              {/* Account */}
              {isAuthenticated ? (
                <div className="relative group hidden sm:block">
                  <button className="flex items-center gap-1.5 p-2 text-mink hover:text-champagne transition-colors">
                    <div className="w-7 h-7 bg-gradient-luxury rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      {user?.name.charAt(0)}
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-44 glass-card rounded-sm py-2 shadow-luxury-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <Link href="/account" className="block px-4 py-2 text-xs text-mink hover:text-champagne font-body tracking-wider">
                      My Account
                    </Link>
                    <Link href="/account/orders" className="block px-4 py-2 text-xs text-mink hover:text-champagne font-body tracking-wider">
                      My Orders
                    </Link>
                    <Link href="/account/wishlist" className="block px-4 py-2 text-xs text-mink hover:text-champagne font-body tracking-wider">
                      Wishlist
                    </Link>
                    {user?.role === "admin" && (
                      <Link href="/admin" className="block px-4 py-2 text-xs text-champagne hover:text-champagne-dark font-body font-semibold tracking-wider border-t border-champagne/20 mt-1 pt-2">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-xs text-mink-light hover:text-rose-gold font-body tracking-wider border-t border-champagne/20 mt-1 pt-2"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:flex p-2 text-mink hover:text-champagne transition-colors"
                  aria-label="Login"
                >
                  <User size={20} />
                </Link>
              )}
            </div>
          </div>

          {/* Search Overlay — full-screen modal, works on all screen sizes */}
          <AnimatePresence>
            {searchOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-[200]"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                />
                {/* Search panel — drops from top */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed top-0 left-0 right-0 z-[210] bg-ivory shadow-luxury-lg"
                >
                  <div className="max-w-2xl mx-auto px-4 py-5">
                    {/* Input row */}
                    <div className="relative flex items-center gap-3">
                      <Search size={18} className="absolute left-4 text-mink-light pointer-events-none" />
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search jewellery, collections..."
                        className="w-full bg-pearl border border-champagne/20 text-obsidian text-sm font-body pl-11 pr-11 py-3 rounded-full focus:outline-none focus:border-champagne/60 placeholder:text-mink-light/60"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSearchSubmit();
                          if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
                        }}
                      />
                      <button
                        onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                        className="absolute right-4 text-mink-light hover:text-obsidian transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Suggestions panel */}
                    <div className="mt-4 max-h-[60vh] overflow-y-auto">
                      {/* Trending — shown when no query */}
                      {searchQuery.length === 0 && (
                        <div className="mb-4">
                          <p className="text-[9px] font-body text-champagne tracking-[0.3em] uppercase flex items-center gap-1.5 mb-3">
                            <TrendingUp size={10} /> Trending Searches
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {TRENDING_SEARCHES.map((t) => (
                              <button
                                key={t}
                                onClick={() => handleSearchSubmit(t)}
                                className="text-xs font-body text-mink px-3 py-1.5 bg-pearl border border-champagne/20 rounded-full hover:bg-champagne hover:text-white hover:border-champagne transition-colors"
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Category suggestions */}
                      {categorySuggestions.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[9px] font-body text-champagne/60 tracking-[0.3em] uppercase mb-2">Collections</p>
                          {categorySuggestions.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => { router.push(`/products?category=${c.slug}`); setSearchOpen(false); setSearchQuery(""); }}
                              className="flex items-center gap-2 w-full py-2 text-left text-sm font-body text-mink hover:text-champagne transition-colors"
                            >
                              <ArrowRight size={10} className="text-champagne/40 flex-shrink-0" /> {c.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Product suggestions */}
                      {suggestions.length > 0 && (
                        <div>
                          <p className="text-[9px] font-body text-champagne/60 tracking-[0.3em] uppercase mb-2">Products</p>
                          <div className="space-y-1">
                            {suggestions.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => { router.push(`/products/${p.slug}`); setSearchOpen(false); setSearchQuery(""); }}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-pearl transition-colors text-left"
                              >
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-pearl">
                                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" unoptimized />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-body font-medium text-obsidian truncate">{p.name}</p>
                                  <p className="text-xs font-body text-champagne">₹{p.discountPrice.toLocaleString()}</p>
                                </div>
                                {p.badge && (
                                  <span className="text-[9px] font-body bg-champagne/10 text-champagne px-2 py-0.5 rounded-full flex-shrink-0">{p.badge}</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* View all */}
                      {searchQuery.length > 0 && (
                        <button
                          onClick={() => handleSearchSubmit()}
                          className="flex items-center gap-2 w-full mt-3 pt-3 border-t border-champagne/15 text-sm font-body text-champagne hover:text-champagne-dark transition-colors"
                        >
                          <Search size={13} /> View all results for &ldquo;{searchQuery}&rdquo;
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-champagne/15 bg-ivory overflow-hidden"
            >
              <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      className="block py-3 text-sm font-body font-medium tracking-widest uppercase text-mink hover:text-champagne transition-colors border-b border-champagne/10"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="pl-4">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block py-2 text-xs font-body text-mink-light hover:text-champagne transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-3 flex gap-4">
                  {isAuthenticated ? (
                    <>
                      <Link href="/account" className="text-sm font-body text-mink hover:text-champagne" onClick={() => setMobileOpen(false)}>Account</Link>
                      <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm font-body text-mink-light hover:text-rose-gold">Logout</button>
                    </>
                  ) : (
                    <Link href="/auth/login" className="text-sm font-body text-mink hover:text-champagne" onClick={() => setMobileOpen(false)}>Login / Sign Up</Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
