"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { ButterflyLogo } from "@/components/ui/ButterflyLogo";
import { Button } from "@/components/ui/Button";
import { useAuthStore, useStaffStore } from "@/store";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";
  const { login } = useAuthStore();
  const { findByEmail } = useStaffStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    // Demo: admin login
    if (email === "admin@butterfly.com" && password === "admin123") {
      login({ id: "admin1", name: "Admin", email, role: "admin", avatar: "AD" });
      toast.success("Welcome back, Admin! ✨");
      router.push("/admin");
      return;
    }
    // Check staff users created by admin
    const staffUser = findByEmail(email);
    if (staffUser) {
      if (!staffUser.active) {
        toast.error("Your account has been deactivated. Contact admin.");
        setLoading(false);
        return;
      }
      if (staffUser.password === password) {
        login({ id: staffUser.id, name: staffUser.name, email: staffUser.email, role: staffUser.role, avatar: staffUser.name.charAt(0).toUpperCase() });
        toast.success(`Welcome, ${staffUser.name}! ✨`);
        router.push("/admin");
        return;
      }
    }
    // Demo: any other email logs in as customer
    if (password.length >= 6) {
      login({ id: "u-demo", name: email.split("@")[0], email, role: "customer", avatar: email.charAt(0).toUpperCase() });
      toast.success("Welcome back! 🦋");
      router.push(redirect);
      return;
    }
    toast.error("Invalid credentials. Use password with 6+ chars.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-blush flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center">
            <ButterflyLogo size="lg" />
          </Link>
          <h1 className="font-display text-3xl text-obsidian mt-6 mb-1">Welcome Back</h1>
          <p className="text-sm font-body text-mink-light">Sign in to your Butterfly account</p>
        </div>

        <div className="glass-card rounded-sm p-8 shadow-luxury-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="luxury-input" placeholder="your@email.com" autoComplete="email" required />
            </div>
            <div>
              <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="luxury-input pr-10" placeholder="Your password" autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mink-light hover:text-champagne">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-xs font-body text-champagne hover:text-champagne-dark">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" fullWidth size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-champagne/15" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-ivory px-3 text-xs font-body text-mink-light">or continue with</span>
            </div>
          </div>

          {/* Demo hints */}
          <div className="bg-champagne/8 border border-champagne/20 rounded-sm p-3 mb-4">
            <p className="text-[10px] font-body text-mink-light text-center leading-relaxed">
              <span className="font-semibold text-champagne">Demo:</span> admin@butterfly.com / admin123 (Admin) <br />
              Any email + 6-char password (Customer)
            </p>
          </div>

          <p className="text-center text-sm font-body text-mink-light">
            New to Butterfly?{" "}
            <Link href="/auth/signup" className="text-champagne hover:text-champagne-dark font-medium">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
