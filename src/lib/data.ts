export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number;
  category: string;
  categorySlug: string;
  stock: number;
  badge: string | null;
  description: string;
  material: string;
  careInstructions: string;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  active: boolean;
  sku: string;
  tags: string[];
  videoUrl?: string;  // YouTube embed URL for product video
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  featured: boolean;
  productCount: number;
};

export type Review = {
  id: string;
  productId: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
  photos?: string[];          // Customer photo uploads
  videoUrl?: string;          // YouTube / video review URL
  verifiedPurchase?: boolean;
  helpfulCount?: number;
  city?: string;
};

export type Order = {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: { product: Product; quantity: number }[];
  status: "placed" | "confirmed" | "packed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: Address;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  placedAt: string;
  updatedAt: string;
  trackingId?: string;
};

export type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue: number;
  expiresAt: string;
  active: boolean;
  usageCount: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "customer" | "admin";
  createdAt: string;
  blocked: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Butterfly Royale Bridal Necklace Set",
    slug: "butterfly-royale-bridal-necklace-set",
    price: 4999,
    discountPrice: 3999,
    category: "Bridal Collection",
    categorySlug: "bridal-collection",
    stock: 20,
    badge: "Bestseller",
    description:
      "Premium artificial bridal necklace set with rose gold finish, pearl accents, crystal detailing, and matching earrings. Perfect for weddings and festive occasions. This exquisite piece is handcrafted with meticulous attention to detail, featuring lustrous faux pearls and sparkling crystals set in a rose gold-toned base.",
    material: "Rose gold-plated brass, faux pearls, Swarovski-style crystals",
    careInstructions:
      "Store in the provided velvet pouch. Avoid contact with water and perfume. Wipe gently with a soft cloth after use.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1650785468226-e415afc2bd9e?w=800&q=80",
      "https://images.unsplash.com/photo-1614113753022-06b2575e4f4c?w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    ],
    rating: 4.9,
    reviewCount: 128,
    featured: true,
    bestseller: true,
    newArrival: false,
    active: true,
    sku: "BFY-BRD-001",
    tags: ["bridal", "necklace", "rose gold", "pearl", "wedding"],
  },
  {
    id: "2",
    name: "Golden Bloom Statement Earrings",
    slug: "golden-bloom-statement-earrings",
    price: 1499,
    discountPrice: 1199,
    category: "Earrings",
    categorySlug: "earrings",
    stock: 35,
    badge: "New Arrival",
    description:
      "Lightweight luxury statement earrings inspired by floral elegance, designed for parties, sarees, lehengas, and evening wear. Each pair is crafted to make a bold yet graceful statement.",
    material: "Gold-plated brass, enamel accents",
    careInstructions:
      "Keep away from moisture. Store in the pouch provided. Clean with a dry soft cloth.",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1697713465161-d872b22723a2?w=800&q=80",
      "https://images.unsplash.com/photo-1578469488462-96f9af23e4b8?w=800&q=80",
    ],
    rating: 4.7,
    reviewCount: 89,
    featured: true,
    bestseller: false,
    newArrival: true,
    active: true,
    sku: "BFY-EAR-002",
    tags: ["earrings", "gold", "statement", "floral", "party"],
  },
  {
    id: "3",
    name: "Pearl Butterfly Choker",
    slug: "pearl-butterfly-choker",
    price: 2299,
    discountPrice: 1899,
    category: "Necklaces",
    categorySlug: "necklaces",
    stock: 25,
    badge: "Limited Edition",
    description:
      "Elegant pearl choker with butterfly-inspired centerpiece, champagne gold detailing, and a premium feminine finish. The delicate butterfly motif symbolizes transformation and grace.",
    material: "Champagne gold-plated brass, freshwater pearl simulation, crystal accents",
    careInstructions:
      "Handle with care. Avoid pulling the delicate butterfly centerpiece. Store flat in the box provided.",
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
      "https://images.unsplash.com/photo-1614113753022-06b2575e4f4c?w=800&q=80",
      "https://images.unsplash.com/photo-1650785468226-e415afc2bd9e?w=800&q=80",
    ],
    rating: 4.8,
    reviewCount: 64,
    featured: true,
    bestseller: false,
    newArrival: false,
    active: true,
    sku: "BFY-NCK-003",
    tags: ["choker", "pearl", "butterfly", "limited edition", "necklace"],
  },
  {
    id: "4",
    name: "Royal Rose Gold Bangles Set",
    slug: "royal-rose-gold-bangles-set",
    price: 1999,
    discountPrice: 1599,
    category: "Bangles",
    categorySlug: "bangles",
    stock: 40,
    badge: "Festive Pick",
    description:
      "Premium rose gold artificial bangle set crafted for festive outfits, bridal looks, and traditional celebrations. Set of 6 bangles with intricate filigree patterns.",
    material: "Rose gold-plated brass, micro-pave crystal accents",
    careInstructions:
      "Avoid wearing while bathing or swimming. Store in the velvet roll provided. Polish with a jewellery cloth monthly.",
    images: [
      "https://images.unsplash.com/photo-1758995116383-f51775896add?w=800&q=80",
      "https://images.unsplash.com/photo-1758995116288-278d7387cbb6?w=800&q=80",
      "https://images.unsplash.com/photo-1774978239401-7bfaff4207ee?w=800&q=80",
    ],
    rating: 4.6,
    reviewCount: 112,
    featured: false,
    bestseller: true,
    newArrival: false,
    active: true,
    sku: "BFY-BNG-004",
    tags: ["bangles", "rose gold", "festive", "bridal", "set"],
  },
  {
    id: "5",
    name: "Crystal Wings Cocktail Ring",
    slug: "crystal-wings-cocktail-ring",
    price: 899,
    discountPrice: 699,
    category: "Rings",
    categorySlug: "rings",
    stock: 50,
    badge: "Trending",
    description:
      "Luxury cocktail ring with crystal detailing and butterfly wing-inspired design, perfect for modern ethnic and western looks. An adjustable band ensures a perfect fit.",
    material: "Rhodium-plated brass, cubic zirconia crystals",
    careInstructions:
      "Store in the box. Avoid exposure to chemicals. Remove before washing hands.",
    images: [
      "https://images.unsplash.com/photo-1663036471400-6065f5b108e8?w=800&q=80",
      "https://images.unsplash.com/photo-1655707063513-a08dad26440e?w=800&q=80",
      "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&q=80",
    ],
    rating: 4.5,
    reviewCount: 76,
    featured: false,
    bestseller: false,
    newArrival: true,
    active: true,
    sku: "BFY-RNG-005",
    tags: ["ring", "cocktail", "crystal", "butterfly", "trending"],
  },
  {
    id: "6",
    name: "Midnight Lotus Maang Tikka",
    slug: "midnight-lotus-maang-tikka",
    price: 1299,
    discountPrice: 999,
    category: "Hair Accessories",
    categorySlug: "hair-accessories",
    stock: 30,
    badge: "New Arrival",
    description:
      "Stunning maang tikka with midnight blue and gold enamel lotus design. A mesmerizing centrepiece for bridal and festive hair styling.",
    material: "Gold-plated brass, enamel, crystal beads",
    careInstructions: "Store flat. Do not pull the chain. Wipe gently after use.",
    images: [
      "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80",
      "https://images.unsplash.com/photo-1777126413365-f4113a23eeab?w=800&q=80",
    ],
    rating: 4.7,
    reviewCount: 45,
    featured: true,
    bestseller: false,
    newArrival: true,
    active: true,
    sku: "BFY-HAC-006",
    tags: ["maang tikka", "hair accessory", "bridal", "lotus", "gold"],
  },
  {
    id: "7",
    name: "Opulent Kundan Jhumkas",
    slug: "opulent-kundan-jhumkas",
    price: 1799,
    discountPrice: 1499,
    category: "Earrings",
    categorySlug: "earrings",
    stock: 28,
    badge: "Bestseller",
    description:
      "Timeless kundan jhumkas with gold foil work and dangling pearl drops. A classic Indian jewellery staple elevated with premium finish.",
    material: "Gold-plated brass, kundan stones, faux pearl drops",
    careInstructions: "Do not immerse in water. Store separately to avoid scratching.",
    images: [
      "https://images.unsplash.com/photo-1758995119744-6454f091303f?w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    ],
    rating: 4.9,
    reviewCount: 203,
    featured: true,
    bestseller: true,
    newArrival: false,
    active: true,
    sku: "BFY-EAR-007",
    tags: ["jhumka", "kundan", "gold", "earrings", "traditional"],
  },
  {
    id: "8",
    name: "Blush Dreamcatcher Anklet",
    slug: "blush-dreamcatcher-anklet",
    price: 799,
    discountPrice: 649,
    category: "Anklets",
    categorySlug: "anklets",
    stock: 60,
    badge: null,
    description:
      "Delicate rose gold anklet with dreamy charm details. Perfect for summer, beach outfits, and casual festive wear.",
    material: "Rose gold-plated brass, tiny crystal charms",
    careInstructions: "Avoid water. Remove before sleeping.",
    images: [
      "https://images.unsplash.com/photo-1653227908236-36813ab5c30a?w=800&q=80",
      "https://images.unsplash.com/photo-1655707063092-5c4509de41b8?w=800&q=80",
    ],
    rating: 4.4,
    reviewCount: 58,
    featured: false,
    bestseller: false,
    newArrival: false,
    active: true,
    sku: "BFY-ANK-008",
    tags: ["anklet", "rose gold", "charm", "casual", "summer"],
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Bridal Collection",
    slug: "bridal-collection",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    featured: true,
    productCount: 24,
  },
  {
    id: "2",
    name: "Necklaces",
    slug: "necklaces",
    image: "https://images.unsplash.com/photo-1650785468226-e415afc2bd9e?w=600&q=80",
    featured: true,
    productCount: 32,
  },
  {
    id: "3",
    name: "Earrings",
    slug: "earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    featured: true,
    productCount: 45,
  },
  {
    id: "4",
    name: "Bangles",
    slug: "bangles",
    image: "https://images.unsplash.com/photo-1758995116383-f51775896add?w=600&q=80",
    featured: true,
    productCount: 28,
  },
  {
    id: "5",
    name: "Rings",
    slug: "rings",
    image: "https://images.unsplash.com/photo-1663036471400-6065f5b108e8?w=600&q=80",
    featured: false,
    productCount: 19,
  },
  {
    id: "6",
    name: "Hair Accessories",
    slug: "hair-accessories",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&q=80",
    featured: false,
    productCount: 15,
  },
  {
    id: "7",
    name: "Anklets",
    slug: "anklets",
    image: "https://images.unsplash.com/photo-1653227908236-36813ab5c30a?w=600&q=80",
    featured: false,
    productCount: 12,
  },
];

export const REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "1",
    user: "Priya Sharma",
    avatar: "PS",
    rating: 5,
    comment:
      "Absolutely stunning! Wore this for my wedding and received so many compliments. The rose gold finish is exactly as shown and the quality is premium. Worth every rupee!",
    date: "2026-05-15",
    approved: true,
    verifiedPurchase: true,
    helpfulCount: 48,
    city: "Mumbai",
    photos: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
    ],
  },
  {
    id: "r2",
    productId: "1",
    user: "Ananya Reddy",
    avatar: "AR",
    rating: 5,
    comment:
      "The packaging alone made me feel like royalty. The necklace set is breathtaking. Wore it for my sister's sangeet and it was perfect with my lehenga.",
    date: "2026-04-22",
    approved: true,
    verifiedPurchase: true,
    helpfulCount: 32,
    city: "Hyderabad",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "r3",
    productId: "2",
    user: "Deepika Nair",
    avatar: "DN",
    rating: 4,
    comment:
      "Beautiful earrings, super lightweight and comfortable to wear for long hours. The gold finish is very premium-looking.",
    date: "2026-05-30",
    approved: true,
    verifiedPurchase: true,
    helpfulCount: 21,
    city: "Bengaluru",
    photos: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
    ],
  },
  {
    id: "r4",
    productId: "3",
    user: "Kavya Menon",
    avatar: "KM",
    rating: 5,
    comment: "This pearl choker is beyond beautiful. Got it for my engagement shoot and it looked absolutely magical. Quality is top notch!",
    date: "2026-05-10",
    approved: true,
    verifiedPurchase: true,
    helpfulCount: 55,
    city: "Chennai",
    photos: [
      "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80",
    ],
  },
  {
    id: "r5",
    productId: "4",
    user: "Shreya Joshi",
    avatar: "SJ",
    rating: 5,
    comment: "The rose gold bangles set is gorgeous. Wears like actual gold jewellery. Everyone asked if it was real gold!",
    date: "2026-05-02",
    approved: true,
    verifiedPurchase: true,
    helpfulCount: 39,
    city: "Pune",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

export const ORDERS: Order[] = [
  {
    id: "ORD-2026-0001",
    userId: "u1",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
    items: [
      { product: PRODUCTS[0], quantity: 1 },
      { product: PRODUCTS[1], quantity: 2 },
    ],
    status: "delivered",
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    shippingAddress: {
      id: "a1",
      name: "Priya Sharma",
      phone: "9876543210",
      line1: "B-204, Rose Garden Apartments",
      line2: "Near City Mall",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true,
    },
    subtotal: 6397,
    shipping: 0,
    discount: 200,
    total: 6197,
    placedAt: "2026-06-01T10:30:00Z",
    updatedAt: "2026-06-05T14:20:00Z",
    trackingId: "BFY123456789IN",
  },
  {
    id: "ORD-2026-0002",
    userId: "u2",
    customerName: "Ananya Reddy",
    customerEmail: "ananya@example.com",
    items: [{ product: PRODUCTS[2], quantity: 1 }],
    status: "shipped",
    paymentMethod: "cod",
    paymentStatus: "pending",
    shippingAddress: {
      id: "a2",
      name: "Ananya Reddy",
      phone: "9123456789",
      line1: "Flat 12, Sapphire Heights",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500032",
      isDefault: true,
    },
    subtotal: 1899,
    shipping: 99,
    discount: 0,
    total: 1998,
    placedAt: "2026-06-10T08:45:00Z",
    updatedAt: "2026-06-12T11:00:00Z",
    trackingId: "BFY987654321IN",
  },
  {
    id: "ORD-2026-0003",
    userId: "u3",
    customerName: "Meera Joshi",
    customerEmail: "meera@example.com",
    items: [{ product: PRODUCTS[3], quantity: 2 }, { product: PRODUCTS[4], quantity: 1 }],
    status: "placed",
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    shippingAddress: {
      id: "a3",
      name: "Meera Joshi",
      phone: "9988776655",
      line1: "22, Shivaji Nagar",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411005",
      isDefault: true,
    },
    subtotal: 3897,
    shipping: 0,
    discount: 0,
    total: 3897,
    placedAt: "2026-06-18T16:20:00Z",
    updatedAt: "2026-06-18T16:20:00Z",
  },
];

export const COUPONS: Coupon[] = [
  {
    id: "c1",
    code: "BUTTERFLY20",
    type: "percentage",
    value: 20,
    minOrderValue: 1000,
    expiresAt: "2026-12-31",
    active: true,
    usageCount: 45,
  },
  {
    id: "c2",
    code: "WELCOME200",
    type: "fixed",
    value: 200,
    minOrderValue: 1500,
    expiresAt: "2026-09-30",
    active: true,
    usageCount: 12,
  },
  {
    id: "c3",
    code: "BRIDAL15",
    type: "percentage",
    value: 15,
    minOrderValue: 2000,
    expiresAt: "2026-08-31",
    active: true,
    usageCount: 30,
  },
];

export const USERS: User[] = [
  {
    id: "u1",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "9876543210",
    avatar: "PS",
    role: "customer",
    createdAt: "2026-01-15",
    blocked: false,
  },
  {
    id: "u2",
    name: "Ananya Reddy",
    email: "ananya@example.com",
    phone: "9123456789",
    avatar: "AR",
    role: "customer",
    createdAt: "2026-02-20",
    blocked: false,
  },
  {
    id: "u3",
    name: "Meera Joshi",
    email: "meera@example.com",
    phone: "9988776655",
    avatar: "MJ",
    role: "customer",
    createdAt: "2026-03-10",
    blocked: false,
  },
  {
    id: "admin1",
    name: "Admin",
    email: "admin@butterfly.com",
    phone: "9000000000",
    avatar: "AD",
    role: "admin",
    createdAt: "2025-12-01",
    blocked: false,
  },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Priya Mehta",
    location: "Mumbai",
    avatar: "PM",
    rating: 5,
    comment:
      "Butterfly jewellery made my wedding day absolutely magical. The bridal set was worth every penny — exquisite, lightweight, and exactly what I dreamed of.",
    product: "Butterfly Royale Bridal Set",
  },
  {
    id: "t2",
    name: "Roshni Kapoor",
    location: "Delhi",
    avatar: "RK",
    rating: 5,
    comment:
      "I've been buying artificial jewellery for years, but nothing compares to Butterfly's quality. The packaging, the craftsmanship, and the designs are all luxury-level.",
    product: "Pearl Butterfly Choker",
  },
  {
    id: "t3",
    name: "Divya Nambiar",
    location: "Chennai",
    avatar: "DN",
    rating: 5,
    comment:
      "Got so many compliments at the reception! The Golden Bloom earrings are just stunning. Lightweight, gorgeous, and the gold doesn't fade at all.",
    product: "Golden Bloom Statement Earrings",
  },
  {
    id: "t4",
    name: "Sakshi Agarwal",
    location: "Jaipur",
    avatar: "SA",
    rating: 5,
    comment:
      "Perfect gifting option! Ordered the bangle set for my sister's anniversary — the unboxing experience was five-star. She absolutely loved it.",
    product: "Royal Rose Gold Bangles Set",
  },
];
