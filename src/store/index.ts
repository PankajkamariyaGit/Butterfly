import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/data";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.discountPrice * i.quantity,
          0
        ),
    }),
    { name: "butterfly-cart" }
  )
);

type WishlistStore = {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (!get().isWishlisted(product.id)) {
          set({ items: [...get().items, product] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((p) => p.id !== productId) }),
      toggle: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
      isWishlisted: (productId) =>
        get().items.some((p) => p.id === productId),
    }),
    { name: "butterfly-wishlist" }
  )
);

/* ─── Role & Permissions ───────────────────────────────────────── */
export type StaffRole = "admin" | "manager" | "staff";

// Which admin nav sections each role can access
export const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  admin: ["*"], // full access
  manager: ["dashboard", "orders", "customers", "returns", "payments", "reviews", "reports"],
  staff: ["orders"],
};

export function hasPermission(role: StaffRole | "customer", section: string): boolean {
  if (role === "customer") return false;
  const perms = ROLE_PERMISSIONS[role as StaffRole] ?? [];
  return perms.includes("*") || perms.includes(section);
}

/* ─── Staff User Store ─────────────────────────────────────────── */
export type StaffUser = {
  id: string;
  name: string;
  email: string;
  password: string; // stored as plain text for demo (no real backend)
  role: StaffRole;
  permissions: string[]; // override defaults if needed
  active: boolean;
  createdAt: string;
  createdBy: string; // admin user id
};

type StaffStore = {
  staff: StaffUser[];
  addStaff: (user: Omit<StaffUser, "id" | "createdAt">) => void;
  updateStaff: (id: string, updates: Partial<StaffUser>) => void;
  removeStaff: (id: string) => void;
  findByEmail: (email: string) => StaffUser | undefined;
};

export const useStaffStore = create<StaffStore>()(
  persist(
    (set, get) => ({
      staff: [],
      addStaff: (user) =>
        set({ staff: [{ ...user, id: "staff-" + Date.now(), createdAt: new Date().toISOString() }, ...get().staff] }),
      updateStaff: (id, updates) =>
        set({ staff: get().staff.map((s) => s.id === id ? { ...s, ...updates } : s) }),
      removeStaff: (id) =>
        set({ staff: get().staff.filter((s) => s.id !== id) }),
      findByEmail: (email) =>
        get().staff.find((s) => s.email.toLowerCase() === email.toLowerCase()),
    }),
    { name: "butterfly-staff" }
  )
);

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "customer" | StaffRole;
  avatar: string;
};

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "butterfly-auth" }
  )
);

/* ─── Order Store ──────────────────────────────────────────────── */
type StoredOrder = {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: { product: Product; quantity: number }[];
  status: "placed" | "confirmed" | "packed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "paid";
  shippingAddress: {
    id: string; name: string; phone: string; line1: string; line2?: string;
    city: string; state: string; pincode: string; isDefault: boolean;
  };
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  placedAt: string;
  updatedAt: string;
  trackingId?: string;
};

type OrderStore = {
  orders: StoredOrder[];
  addOrder: (order: StoredOrder) => void;
  updateStatus: (id: string, status: StoredOrder["status"]) => void;
  getOrderById: (id: string) => StoredOrder | undefined;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      updateStatus: (id, status) =>
        set({ orders: get().orders.map((o) => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o) }),
      getOrderById: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "butterfly-orders" }
  )
);

// ── Recently Viewed Store ────────────────────────────────────────────────────
type RecentlyViewedStore = {
  items: Product[];
  addItem: (product: Product) => void;
  clear: () => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const filtered = get().items.filter((p) => p.id !== product.id);
        set({ items: [product, ...filtered].slice(0, 10) }); // max 10
      },
      clear: () => set({ items: [] }),
    }),
    { name: "butterfly-recently-viewed" }
  )
);

/* ─── Saved Address Store ──────────────────────────────────────── */
export type SavedAddress = {
  id: string;
  email: string;       // keyed by email for lookup
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  savedAt: string;
};

type AddressStore = {
  addresses: SavedAddress[];
  saveAddress: (address: Omit<SavedAddress, "id" | "savedAt">) => void;
  getAddressByEmail: (email: string) => SavedAddress | undefined;
  removeAddress: (id: string) => void;
};

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: [],
      saveAddress: (address) => {
        const existing = get().addresses.find(
          (a) => a.email.toLowerCase() === address.email.toLowerCase()
        );
        const entry: SavedAddress = {
          ...address,
          id: existing?.id ?? Math.random().toString(36).slice(2),
          savedAt: new Date().toISOString(),
        };
        if (existing) {
          set({ addresses: get().addresses.map((a) => a.id === existing.id ? entry : a) });
        } else {
          set({ addresses: [entry, ...get().addresses] });
        }
      },
      getAddressByEmail: (email) =>
        get().addresses.find((a) => a.email.toLowerCase() === email.toLowerCase()),
      removeAddress: (id) =>
        set({ addresses: get().addresses.filter((a) => a.id !== id) }),
    }),
    { name: "butterfly-addresses" }
  )
);
