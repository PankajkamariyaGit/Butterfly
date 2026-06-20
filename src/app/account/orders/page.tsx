"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect /account/orders → /account (the account page has an orders tab)
export default function AccountOrdersRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/account");
  }, [router]);
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-champagne border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-sm text-mink-light">Loading your orders…</p>
      </div>
    </div>
  );
}
