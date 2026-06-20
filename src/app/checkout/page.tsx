"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle2, XCircle, CreditCard, Smartphone, Building2, Wallet, QrCode, Truck, Tag, MapPin } from "lucide-react";
import { useCartStore, useAuthStore, useOrderStore, useAddressStore } from "@/store";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

type Step = "address" | "payment" | "confirmation";

type AddressForm = {
  name: string; phone: string; email: string; line1: string; line2: string;
  city: string; state: string; pincode: string;
};

const PAYMENT_METHODS = [
  { id: "cod", icon: Truck, label: "Cash on Delivery", sub: "Pay when your order arrives" },
  { id: "upi", icon: Smartphone, label: "Razorpay UPI", sub: "GPay, PhonePe, Paytm, BHIM" },
  { id: "card", icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, Mastercard, Rupay" },
  { id: "netbanking", icon: Building2, label: "Net Banking", sub: "All major Indian banks" },
  { id: "wallet", icon: Wallet, label: "Wallets", sub: "Paytm, Amazon Pay, Freecharge" },
  { id: "qr", icon: QrCode, label: "Scan & Pay QR", sub: "Any UPI app" },
];

const INDIAN_STATES = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { addOrder } = useOrderStore();
  const { saveAddress, getAddressByEmail } = useAddressStore();
  const [addressLoaded, setAddressLoaded] = useState(false);

  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "checking" | "ok" | "fail">("idle");

  const [address, setAddress] = useState<AddressForm>({
    name: user?.name ?? "",
    phone: "",
    email: user?.email ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Auto-fill saved address when email is known
  useEffect(() => {
    if (addressLoaded) return;
    const email = user?.email ?? "";
    if (!email) return;
    const saved = getAddressByEmail(email);
    if (saved) {
      setAddress({
        name: saved.name,
        phone: saved.phone,
        email: saved.email,
        line1: saved.line1,
        line2: saved.line2 ?? "",
        city: saved.city,
        state: saved.state,
        pincode: saved.pincode,
      });
      toast.success("Saved address loaded", { id: "addr-load", icon: "📍" });
    }
    setAddressLoaded(true);
  }, [user, getAddressByEmail, addressLoaded]);

  const sub = subtotal();
  const COD_FEE = paymentMethod === "cod" ? 49 : 0; // ₹49 handling fee for COD
  const shipping = sub >= 999 ? 0 : 99;
  const total = sub + shipping + COD_FEE - couponDiscount;

  const VALID_COUPONS: Record<string, { type: "percent" | "flat"; value: number; min: number; onlineOnly?: boolean }> = {
    "BUTTERFLY20": { type: "percent", value: 20, min: 1000 },
    "WELCOME200": { type: "flat", value: 200, min: 1500 },
    "BRIDAL15": { type: "percent", value: 15, min: 2000 },
    "FESTIVE10": { type: "percent", value: 10, min: 500 },
    "ONLINE50": { type: "flat", value: 50, min: 0, onlineOnly: true },
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const coupon = VALID_COUPONS[code];
    if (!coupon) { toast.error("Invalid coupon code"); return; }
    if (coupon.onlineOnly && paymentMethod === "cod") { toast.error("This coupon is valid for online payments only"); return; }
    if (sub < coupon.min) { toast.error(`Minimum order ₹${coupon.min} required for this coupon`); return; }
    const disc = coupon.type === "percent" ? Math.round(sub * coupon.value / 100) : coupon.value;
    setCouponDiscount(disc);
    setCouponApplied(code);
    toast.success(`Coupon applied! You save ₹${disc}`);
  };

  const removeCoupon = () => {
    setCouponDiscount(0);
    setCouponApplied("");
    setCouponCode("");
    toast("Coupon removed");
  };

  const checkPincode = async (pin: string) => {
    if (!/^\d{6}$/.test(pin)) return;
    setPincodeStatus("checking");
    // Simulate pincode check (replace with real Shiprocket/Delhivery API)
    await new Promise(r => setTimeout(r, 600));
    const unserviceable = ["110000", "999999"];
    setPincodeStatus(unserviceable.includes(pin) ? "fail" : "ok");
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, email, line1, city, state, pincode } = address;
    if (!name || !phone || !line1 || !city || !state || !pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!isAuthenticated && (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email))) {
      toast.error("Please enter a valid email address to track your order");
      return;
    }
    if (!/^\d{10}$/.test(phone)) { toast.error("Enter a valid 10-digit phone"); return; }
    if (!/^\d{6}$/.test(pincode)) { toast.error("Enter a valid 6-digit pincode"); return; }
    if (pincodeStatus === "fail") { toast.error("Delivery not available at this pincode"); return; }
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800)); // simulate API
    const id = `ORD-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    if (paymentMethod !== "cod") {
      // Simulate 10% chance of failure for demo
      if (Math.random() < 0.1) {
        setPaymentFailed(true);
        setLoading(false);
        return;
      }
    }

    // Save order to persistent store so it shows in account & admin
    addOrder({
      id,
      userId: user?.id ?? "guest",
      customerName: address.name,
      customerEmail: user?.email ?? address.email,
      items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
      status: "placed",
      paymentMethod: paymentMethod === "cod" ? "cod" : "razorpay",
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      shippingAddress: {
        id: "addr-" + Date.now(),
        name: address.name,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: false,
      },
      subtotal: sub,
      shipping,
      discount: couponDiscount,
      total,
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingId: `BFY${Math.floor(Math.random() * 900000000) + 100000000}IN`,
    });

    // Persist address so it auto-fills next time (keyed by email)
    const emailKey = user?.email ?? address.email;
    if (emailKey) {
      saveAddress({
        email: emailKey,
        name: address.name,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: true,
      });
    }

    setOrderId(id);
    clearCart();
    setStep("confirmation");
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-obsidian mb-4">Your cart is empty</p>
          <Link href="/products"><Button>Shop Now</Button></Link>
        </div>
      </div>
    );
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-10">
      {(["address", "payment", "confirmation"] as Step[]).map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <div className={`flex items-center gap-2 ${step === s || (i < ["address","payment","confirmation"].indexOf(step)) ? "text-champagne" : "text-mink-light/40"}`}>
            <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold font-body transition-all ${
              ["address","payment","confirmation"].indexOf(step) > i
                ? "bg-champagne border-champagne text-white"
                : step === s
                ? "border-champagne text-champagne"
                : "border-mink-light/30 text-mink-light/40"
            }`}>{i + 1}</span>
            <span className="text-xs font-body font-medium tracking-wider capitalize hidden sm:block">
              {s === "address" ? "Address" : s === "payment" ? "Payment" : "Confirmed"}
            </span>
          </div>
          {i < 2 && <div className={`w-8 sm:w-16 h-px ${["address","payment","confirmation"].indexOf(step) > i ? "bg-champagne" : "bg-mink-light/20"}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-4xl text-obsidian text-center mb-2">Checkout</h1>
        <p className="text-sm font-body text-mink-light text-center mb-6">Secure & encrypted checkout</p>

        {/* Trust badges strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 py-4 px-4 bg-white border border-champagne/10 rounded-2xl">
          {[
            { icon: "🔒", label: "SSL Secured", sub: "256-bit encryption" },
            { icon: "✅", label: "Verified Seller", sub: "GST registered" },
            { icon: "🔄", label: "Easy Returns", sub: "7-day hassle-free" },
            { icon: "🚚", label: "Fast Delivery", sub: "2-5 business days" },
            { icon: "💳", label: "Safe Payments", sub: "Razorpay secured" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-lg">{b.icon}</span>
              <div>
                <p className="text-[10px] font-body font-semibold text-obsidian">{b.label}</p>
                <p className="text-[9px] font-body text-mink-light/60">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <StepIndicator />

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* ── STEP 1: ADDRESS ── */}
              {step === "address" && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {!isAuthenticated && (
                    <div className="glass-card rounded-sm p-5 mb-6 flex items-center justify-between flex-wrap gap-4">
                      <p className="text-sm font-body text-mink">
                        Have an account? Login for faster checkout.
                      </p>
                      <Link href="/auth/login?redirect=/checkout">
                        <Button variant="outline" size="sm">Login</Button>
                      </Link>
                    </div>
                  )}

                  <div className="glass-card rounded-sm p-6">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                      <h2 className="font-display text-2xl text-obsidian">Shipping Address</h2>
                      {/* Show "Use saved address" button if a saved address exists for this email */}
                      {(() => {
                        const emailKey = user?.email ?? address.email;
                        const saved = emailKey ? getAddressByEmail(emailKey) : undefined;
                        return saved ? (
                          <button
                            type="button"
                            onClick={() => {
                              setAddress({ name: saved.name, phone: saved.phone, email: saved.email, line1: saved.line1, line2: saved.line2 ?? "", city: saved.city, state: saved.state, pincode: saved.pincode });
                              toast.success("Saved address loaded", { icon: "📍" });
                            }}
                            className="flex items-center gap-1.5 text-xs font-body text-champagne border border-champagne/30 px-3 py-1.5 rounded-full hover:bg-champagne/10 transition-colors"
                          >
                            <MapPin size={12} /> Use Saved Address
                          </button>
                        ) : null;
                      })()}
                    </div>
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Full Name *</label>
                          <input value={address.name} onChange={(e) => setAddress({...address, name: e.target.value})} className="luxury-input" placeholder="As on shipping label" required />
                        </div>
                        <div>
                          <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Phone *</label>
                          <input value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} className="luxury-input" placeholder="10-digit mobile" maxLength={10} required />
                        </div>
                      </div>
                      {!isAuthenticated && (
                        <div>
                          <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Email Address * <span className="normal-case text-champagne">(required to track your order)</span></label>
                          <input
                            type="email"
                            value={address.email}
                            onChange={(e) => setAddress({...address, email: e.target.value})}
                            className="luxury-input"
                            placeholder="you@example.com"
                            required
                          />
                          <p className="text-[10px] font-body text-mink-light mt-1">You&apos;ll use this email to track your order on the Track Order page.</p>
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Address Line 1 *</label>
                        <input value={address.line1} onChange={(e) => setAddress({...address, line1: e.target.value})} className="luxury-input" placeholder="House/Flat no., Street" required />
                      </div>
                      <div>
                        <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Address Line 2</label>
                        <input value={address.line2} onChange={(e) => setAddress({...address, line2: e.target.value})} className="luxury-input" placeholder="Landmark, Area (optional)" />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">City *</label>
                          <input value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="luxury-input" placeholder="City" required />
                        </div>
                        <div>
                          <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">State *</label>
                          <select value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="luxury-input" required>
                            <option value="">Select state</option>
                            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Pincode *</label>
                          <input
                            value={address.pincode}
                            onChange={(e) => {
                              setAddress({...address, pincode: e.target.value});
                              setPincodeStatus("idle");
                              if (e.target.value.length === 6) checkPincode(e.target.value);
                            }}
                            className="luxury-input"
                            placeholder="6 digits"
                            maxLength={6}
                            required
                          />
                          {pincodeStatus === "checking" && <p className="text-xs text-mink mt-1 font-body">Checking availability...</p>}
                          {pincodeStatus === "ok" && <p className="text-xs text-green-600 mt-1 font-body flex items-center gap-1"><MapPin size={10} /> Delivery available at this pincode</p>}
                          {pincodeStatus === "fail" && <p className="text-xs text-red-500 mt-1 font-body flex items-center gap-1"><MapPin size={10} /> Delivery not available at this pincode</p>}
                        </div>
                      </div>
                      <p className="text-[10px] font-body text-mink-light/60 flex items-center gap-1.5">
                        <MapPin size={10} className="text-champagne/60" />
                        Your address will be saved automatically for faster checkout next time.
                      </p>
                      <Button type="submit" fullWidth size="lg" className="mt-2">
                        Continue to Payment <ChevronRight size={16} />
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: PAYMENT ── */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {paymentFailed && (
                    <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-6 flex gap-3 items-start">
                      <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-body font-semibold text-red-700">Payment Failed</p>
                        <p className="text-xs font-body text-red-600 mt-0.5">Your payment could not be processed. Please try again or choose a different method.</p>
                      </div>
                    </div>
                  )}

                  <div className="glass-card rounded-sm p-6 mb-6">
                    <h2 className="font-display text-2xl text-obsidian mb-6">Payment Method</h2>
                    {/* Online payment nudge banner */}
                    <div className="mb-4 p-3.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-sm flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">🎁</span>
                      <div>
                        <p className="text-sm font-body font-semibold text-green-800">Pay online & save ₹50!</p>
                        <p className="text-xs font-body text-green-700 mt-0.5">Use code <span className="font-bold tracking-wider bg-green-100 px-1.5 py-0.5 rounded">ONLINE50</span> at checkout — valid on all online payment methods. COD attracts a ₹49 handling fee.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon;
                        const isCOD = method.id === "cod";
                        return (
                          <label key={method.id} className={`flex items-center gap-4 p-4 rounded-sm border-2 cursor-pointer transition-all ${paymentMethod === method.id ? "border-champagne bg-champagne/5" : "border-champagne/15 hover:border-champagne/40"}`}>
                            <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="sr-only" />
                            <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 ${paymentMethod === method.id ? "bg-champagne text-white" : "bg-ivory-dark text-mink-light"}`}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-body font-semibold text-obsidian">{method.label}</p>
                              <p className="text-xs font-body text-mink-light">{method.sub}</p>
                              {isCOD && <p className="text-[10px] font-body text-orange-500 mt-0.5 font-semibold">+₹49 handling fee applies</p>}
                            </div>
                            {!isCOD && (
                              <span className="text-[9px] font-body font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full whitespace-nowrap">USE ONLINE50</span>
                            )}
                            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${paymentMethod === method.id ? "border-champagne" : "border-mink-light/40"}`}>
                              {paymentMethod === method.id && <span className="w-2 h-2 rounded-full bg-champagne" />}
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {paymentMethod === "cod" && (
                      <div className="mt-4 p-3.5 bg-orange-50 border border-orange-200 rounded-sm flex gap-3 items-start">
                        <span className="text-base flex-shrink-0">⚠️</span>
                        <p className="text-xs font-body text-orange-700">
                          COD orders have a <strong>₹49 handling fee</strong> and a higher return rate, which increases delivery time. Switch to online payment and use <strong>ONLINE50</strong> to save ₹50 instead!
                        </p>
                      </div>
                    )}
                    {paymentMethod !== "cod" && (
                      <div className="mt-4 p-4 bg-champagne/8 border border-champagne/20 rounded-sm">
                        <p className="text-xs font-body text-mink-light">
                          🔒 You will be redirected to Razorpay&apos;s secure payment gateway to complete your payment.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("address")}>
                      ← Back
                    </Button>
                    <Button fullWidth size="lg" onClick={handlePlaceOrder} loading={loading}>
                      {loading ? "Processing..." : `Place Order · ₹${total.toLocaleString()}`}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: CONFIRMATION ── */}
              {step === "confirmation" && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 size={40} className="text-green-500" />
                  </motion.div>
                  <h2 className="font-display text-4xl text-obsidian mb-3">
                    Order Placed! 🦋
                  </h2>
                  <p className="text-sm font-body text-mink-light mb-2">
                    Thank you for your order. We&apos;re preparing your jewellery with love.
                  </p>
                  <div className="inline-flex flex-col items-center gap-2 mb-8">
                    <p className="text-xs font-body text-champagne font-semibold tracking-widest uppercase">
                      Order ID: {orderId}
                    </p>
                    <button
                      onClick={() => { navigator.clipboard.writeText(orderId); toast.success("Order ID copied!"); }}
                      className="text-[10px] font-body text-mink-light underline hover:text-champagne transition-colors"
                    >
                      Copy Order ID
                    </button>
                  </div>
                  {!isAuthenticated && (
                    <div className="bg-champagne/10 border border-champagne/30 rounded-sm p-4 max-w-sm mx-auto mb-6 text-left">
                      <p className="text-xs font-body font-semibold text-champagne-dark mb-1">📦 Save this to track your order</p>
                      <p className="text-[11px] font-body text-mink-light">
                        You ordered as a guest. To track your order, go to <strong>Track Order</strong> and enter your
                        <strong> Order ID</strong>, <strong>email</strong> ({address.email}), or <strong>phone number</strong> ({address.phone}).
                      </p>
                    </div>
                  )}
                  <div className="glass-card rounded-sm p-5 max-w-sm mx-auto mb-8 text-left space-y-2">
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-mink-light">Delivering to</span>
                      <span className="text-obsidian font-medium">{address.city}, {address.state}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-mink-light">Payment</span>
                      <span className="text-obsidian font-medium capitalize">{paymentMethod === "cod" ? "Cash on Delivery" : "Paid via Razorpay"}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-mink-light">Estimated delivery</span>
                      <span className="text-obsidian font-medium">3–5 business days</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/account/orders"><Button variant="outline">View Orders</Button></Link>
                    <Link href="/products"><Button>Continue Shopping</Button></Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary sidebar */}
          {step !== "confirmation" && (
            <div className="lg:col-span-1">
              <div className="glass-card rounded-sm p-5 sticky top-28">
                <h3 className="font-display text-xl text-obsidian mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-sm overflow-hidden bg-pearl flex-shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-champagne text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-body text-obsidian leading-tight line-clamp-2">{product.name}</p>
                        <p className="text-sm font-body font-semibold text-champagne mt-1">
                          ₹{(product.discountPrice * quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-champagne/15 pt-4 space-y-2">
                  <div className="flex justify-between text-sm font-body text-mink">
                    <span>Subtotal</span><span>₹{sub.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body text-mink">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  {COD_FEE > 0 && (
                    <div className="flex justify-between text-sm font-body text-orange-600">
                      <span>COD Handling Fee</span><span>+₹{COD_FEE}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm font-body text-green-600 font-semibold">
                      <span className="flex items-center gap-1"><Tag size={10}/> {couponApplied}</span>
                      <span>−₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold font-body text-obsidian pt-2 border-t border-champagne/15">
                    <span>Total</span>
                    <span className="font-display text-xl text-champagne">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Coupon field */}
                {step === "payment" && !couponApplied && (
                  <div className="mt-4 flex gap-2">
                    <input
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="flex-1 bg-white/70 border border-champagne/20 text-obsidian text-xs font-body px-3 py-2 rounded-sm focus:outline-none focus:border-champagne/50 placeholder:text-mink/50"
                    />
                    <button onClick={applyCoupon} className="bg-champagne text-white text-xs font-body font-semibold px-3 py-2 rounded-sm hover:bg-champagne/90 transition-colors">
                      Apply
                    </button>
                  </div>
                )}
                {couponApplied && (
                  <div className="mt-4 flex items-center justify-between text-xs font-body">
                    <span className="text-green-600 font-semibold flex items-center gap-1"><Tag size={10}/> {couponApplied} applied</span>
                    <button onClick={removeCoupon} className="text-red-400 hover:text-red-500">Remove</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
