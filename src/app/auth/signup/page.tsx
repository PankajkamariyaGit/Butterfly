"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check } from "lucide-react";
import { ButterflyLogo } from "@/components/ui/ButterflyLogo";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Pre-fill from URL params (e.g. coming from track-order page)
  useEffect(() => {
    const email = searchParams.get("email") ?? "";
    const name = searchParams.get("name") ?? "";
    if (email || name) setForm((f) => ({ ...f, email, name }));
  }, [searchParams]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error("Please accept the terms & conditions"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    login({
      id: `u-${Date.now()}`,
      name: form.name,
      email: form.email,
      role: "customer",
      avatar: form.name.charAt(0).toUpperCase(),
    });
    toast.success("Account created! Welcome to Butterfly 🦋");
    router.push("/account");
  };

  const rules = [
    { label: "At least 6 characters", met: form.password.length >= 6 },
    { label: "Passwords match", met: form.password === form.confirm && form.confirm.length > 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-blush flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center"><ButterflyLogo size="lg" /></Link>
          <h1 className="font-display text-3xl text-obsidian mt-6 mb-1">Create Account</h1>
          <p className="text-sm font-body text-mink-light">Join the Butterfly family today</p>
        </div>

        <div className="glass-card rounded-sm p-8 shadow-luxury-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Full Name *</label>
                <input value={form.name} onChange={set("name")} className="luxury-input" placeholder="Your name" required />
              </div>
              <div>
                <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Phone</label>
                <input value={form.phone} onChange={set("phone")} className="luxury-input" placeholder="10-digit" maxLength={10} />
              </div>
            </div>
            <div>
              <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={set("email")} className="luxury-input" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Password *</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} className="luxury-input pr-10" placeholder="Min 6 characters" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mink-light hover:text-champagne">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Confirm Password *</label>
              <input type="password" value={form.confirm} onChange={set("confirm")} className="luxury-input" placeholder="Repeat password" required />
            </div>

            {/* Password rules */}
            {form.password && (
              <div className="space-y-1.5">
                {rules.map((r) => (
                  <div key={r.label} className={`flex items-center gap-2 text-xs font-body ${r.met ? "text-green-600" : "text-mink-light"}`}>
                    <Check size={12} className={r.met ? "text-green-500" : "text-mink-light/40"} />
                    {r.label}
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <span
                onClick={() => setAgreed(!agreed)}
                className={`w-4 h-4 mt-0.5 rounded-sm border flex-shrink-0 flex items-center justify-center transition-all ${agreed ? "bg-champagne border-champagne" : "border-champagne/30"}`}
              >
                {agreed && <Check size={10} className="text-white" />}
              </span>
              <span className="text-xs font-body text-mink-light leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-champagne hover:underline">Terms & Conditions</Link>
                {" "}and{" "}
                <Link href="/privacy-policy" className="text-champagne hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm font-body text-mink-light mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-champagne hover:text-champagne-dark font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-blush flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
