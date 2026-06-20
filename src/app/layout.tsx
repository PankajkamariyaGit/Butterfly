import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LuxuryCursor from "@/components/ui/LuxuryCursor";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Butterfly — Premium Artificial Jewellery",
    template: "%s | Butterfly Fine Jewellery",
  },
  description:
    "Discover Butterfly's exclusive collection of premium artificial jewellery — bridal sets, statement earrings, necklaces, bangles, and more. Crafted for elegance and celebrations.",
  keywords: [
    "artificial jewellery", "bridal jewellery", "imitation jewellery",
    "gold plated jewellery", "Indian jewellery", "Butterfly jewellery",
    "necklace set", "earrings", "bangles",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Butterfly Fine Jewellery",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ivory text-obsidian antialiased">
        <LuxuryCursor />
        <Header />
        <main className="min-h-screen pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
        <WhatsAppButton />
        <ExitIntentPopup />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
