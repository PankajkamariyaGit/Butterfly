"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Star,
  Settings, LogOut, Menu, X, ChevronRight, Bell, AlertTriangle, ShoppingBag, UserPlus,
  Layers, Archive, RotateCcw, CreditCard, BarChart2, Mail, MessageCircle, Monitor, Shield,
} from "lucide-react";
import { ButterflyLogo } from "@/components/ui/ButterflyLogo";
import { useAuthStore, useOrderStore, hasPermission, StaffRole } from "@/store";
import { PRODUCTS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, section: "dashboard" },
  { href: "/admin/products", label: "Products", icon: Package, section: "products" },
  { href: "/admin/categories", label: "Categories", icon: Layers, section: "categories" },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, section: "orders" },
  { href: "/admin/customers", label: "Customers", icon: Users, section: "customers" },
  { href: "/admin/inventory", label: "Inventory", icon: Archive, section: "inventory" },
  { href: "/admin/returns", label: "Returns & Refunds", icon: RotateCcw, section: "returns" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, section: "payments" },
  { href: "/admin/coupons", label: "Coupons", icon: Tag, section: "coupons" },
  { href: "/admin/reviews", label: "Reviews", icon: Star, section: "reviews" },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail, section: "newsletter" },
  { href: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle, section: "whatsapp" },
  { href: "/admin/reports", label: "Reports", icon: BarChart2, section: "reports" },
  { href: "/admin/homepage", label: "Homepage", icon: Monitor, section: "homepage" },
  { href: "/admin/users", label: "Manage Users", icon: Shield, section: "users" },
  { href: "/admin/settings", label: "Settings", icon: Settings, section: "settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { orders: storedOrders } = useOrderStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Build notifications from real data
  const lowStockProducts = PRODUCTS.filter(p => p.stock < 5);
  const recentOrders = storedOrders.slice(-3).reverse();
  const notifications = [
    ...recentOrders.map(o => ({
      id: o.id,
      type: "order" as const,
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      title: `New order ${o.id}`,
      desc: `₹${o.total.toLocaleString("en-IN")} by ${o.customerName}`,
      time: new Date(o.placedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    })),
    ...lowStockProducts.map(p => ({
      id: p.id,
      type: "stock" as const,
      icon: AlertTriangle,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      title: `Low stock: ${p.name}`,
      desc: `Only ${p.stock} units remaining`,
      time: "Now",
    })),
    {
      id: "new-user",
      type: "user" as const,
      icon: UserPlus,
      color: "text-green-400",
      bg: "bg-green-400/10",
      title: "New customer registered",
      desc: "Priya Sharma joined Butterfly",
      time: "2h ago",
    },
  ];

  // Wait for Zustand to hydrate from localStorage before checking auth
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0F0D08] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-champagne/30 border-t-champagne animate-spin" />
      </div>
    );
  }

  // Auth guard — allow admin, manager, staff
  const allowedRoles = ["admin", "manager", "staff"];
  if (!isAuthenticated || !allowedRoles.includes(user?.role ?? "")) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
        <div className="text-center">
          <ButterflyLogo size="lg" className="justify-center mb-8" />
          <p className="text-sm font-body text-ivory/60 mb-6">Admin access required</p>
          <Link
            href="/auth/login"
            className="btn-luxury inline-block"
          >
            Sign In as Admin
          </Link>
        </div>
      </div>
    );
  }

  // After guard, user is guaranteed non-null
  const authUser = user!;

  return (
    <div className="min-h-screen bg-[#0F0D08] flex">
      {/* Sidebar */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-obsidian border-r border-champagne/10 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Logo */}
          <div className="p-6 border-b border-champagne/10">
            <ButterflyLogo size="sm" />
            <p className="text-[10px] font-body text-champagne/50 tracking-[0.2em] uppercase mt-1 ml-1">
              Admin Panel
            </p>
          </div>

          {/* Nav — filtered by role permissions */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {NAV.filter(({ section }) => hasPermission(authUser.role as StaffRole, section)).map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-body transition-all",
                    active
                      ? "bg-champagne/15 text-champagne border-l-2 border-champagne"
                      : "text-ivory/50 hover:bg-white/5 hover:text-ivory/80"
                  )}
                >
                  <Icon size={16} />
                  {label}
                  {active && <ChevronRight size={12} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-champagne/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-luxury flex items-center justify-center text-white text-xs font-bold">
                {authUser.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-body font-semibold text-ivory/80 truncate">{authUser.name}</p>
                <p className="text-[10px] font-body text-ivory/40 truncate">{authUser.email}</p>
                <span className={cn(
                  "inline-block text-[9px] font-body font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded mt-0.5",
                  authUser.role === "admin" ? "bg-champagne/20 text-champagne" :
                  authUser.role === "manager" ? "bg-blue-400/20 text-blue-400" :
                  "bg-green-400/20 text-green-400"
                )}>
                  {authUser.role}
                </span>
              </div>
            </div>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="flex items-center gap-2 text-xs font-body text-ivory/40 hover:text-rose-gold transition-colors w-full"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </aside>
      </>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-obsidian border-b border-champagne/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-ivory/60 hover:text-ivory p-1"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-xs font-body text-ivory/40">
            {NAV.find((n) => n.href === pathname || (pathname.startsWith(n.href) && n.href !== "/admin"))?.label ?? "Dashboard"}
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative text-ivory/40 hover:text-ivory transition-colors p-1"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-gold rounded-full text-[8px] flex items-center justify-center text-white font-bold">
                    {notifications.length > 9 ? "9+" : notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-[#1A1409] border border-champagne/20 rounded-sm shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <p className="text-xs font-body font-semibold text-ivory/80 tracking-wider">Notifications</p>
                        <button onClick={() => setNotifOpen(false)} className="text-ivory/30 hover:text-ivory"><X size={14} /></button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-xs font-body text-ivory/30 text-center py-8">No new notifications</p>
                        ) : (
                          notifications.map(n => {
                            const Icon = n.icon;
                            return (
                              <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors">
                                <div className={`w-7 h-7 rounded-full ${n.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                  <Icon size={13} className={n.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-body text-ivory/80 font-semibold truncate">{n.title}</p>
                                  <p className="text-[10px] font-body text-ivory/40 mt-0.5 truncate">{n.desc}</p>
                                </div>
                                <span className="text-[9px] font-body text-ivory/20 flex-shrink-0 mt-0.5">{n.time}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="px-4 py-2.5 border-t border-white/5">
                        <Link href="/admin/orders" onClick={() => setNotifOpen(false)} className="text-[10px] font-body text-champagne hover:text-champagne/80 tracking-wider">
                          View all orders →
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <Link href="/" className="text-[10px] font-body text-champagne/60 hover:text-champagne tracking-wider">
              View Store →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto bg-[#0F0D08]">
          {children}
        </main>
      </div>
    </div>
  );
}
