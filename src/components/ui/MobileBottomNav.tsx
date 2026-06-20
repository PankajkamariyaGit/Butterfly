"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/store";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/products" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: ShoppingBag, label: "Cart", href: "/cart" },
  { icon: User, label: "Account", href: "/account" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[800] md:hidden bg-ivory/95 backdrop-blur-xl border-t border-champagne/15 safe-bottom">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          const count = href === "/cart" ? totalItems() : href === "/wishlist" ? wishlistItems.length : 0;

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1 min-w-[52px]"
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={isActive ? "text-champagne" : "text-mink-light"}
                />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-rose-gold text-white text-[9px] font-body rounded-full flex items-center justify-center px-0.5">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] font-body tracking-wide ${
                  isActive ? "text-champagne" : "text-mink-light/70"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-champagne"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
