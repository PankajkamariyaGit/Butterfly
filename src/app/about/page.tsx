"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ButterflyIcon } from "@/components/ui/ButterflyLogo";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const TEAM = [
  { name: "Pankaj Kamariya", role: "Co-Founder", avatar: "PK" },
  { name: "Deepak Porwal", role: "Co-Founder", avatar: "DP" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600&q=85"
          alt="About Butterfly"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-obsidian/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-body text-champagne tracking-[0.3em] uppercase mb-3">✦ Our Story</p>
            <h1 className="font-display text-5xl sm:text-6xl text-white">About Butterfly</h1>
            <div className="w-16 h-px bg-champagne mx-auto mt-4" />
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-body text-champagne tracking-[0.3em] uppercase mb-4">✦ Our Mission</p>
            <h2 className="font-display text-4xl text-obsidian mb-6">Luxury for Every Woman</h2>
            <div className="space-y-4 text-sm font-body text-mink-light leading-relaxed">
              <p>
                Butterfly was founded in 2021 with a single, passionate vision: to make premium jewellery
                accessible to every woman who deserves to feel like royalty.
              </p>
              <p>
                We craft exquisite artificial jewellery that mirrors the beauty of fine jewellery —
                without the hefty price tag. Every piece is designed with love, attention to detail,
                and the modern Indian woman in mind.
              </p>
              <p>
                From intimate mehendi ceremonies to grand bridal receptions, from everyday elegance
                to festive celebrations — we have a piece crafted for every moment of your beautiful life.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-luxury-xl">
              <Image
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=85"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card rounded-sm p-4 shadow-luxury hidden sm:block">
              <ButterflyIcon size={32} />
              <p className="font-display text-2xl text-champagne mt-1">2021</p>
              <p className="text-xs font-body text-mink-light">Founded</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-pearl px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-4xl text-obsidian mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: "💎", title: "Premium Quality", desc: "Every piece undergoes rigorous quality checks. We use tarnish-resistant, hypoallergenic materials for lasting beauty." },
              { icon: "🦋", title: "Feminine & Inclusive", desc: "Designed for every woman — every skin tone, every occasion, every style. Beauty has no boundaries at Butterfly." },
              { icon: "📦", title: "Luxury Experience", desc: "From our website to our packaging to our products — we obsess over every detail of your experience." },
            ].map((v) => (
              <div key={v.title} className="glass-card rounded-sm p-6 text-center">
                <span className="text-4xl">{v.icon}</span>
                <h3 className="font-display text-xl text-obsidian mt-4 mb-3">{v.title}</h3>
                <p className="text-sm font-body text-mink-light leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <h2 className="font-display text-4xl text-obsidian mb-12">Meet the Team</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {TEAM.map((m) => (
            <div key={m.name} className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-luxury flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {m.avatar}
              </div>
              <h3 className="font-display text-xl text-obsidian">{m.name}</h3>
              <p className="text-xs font-body text-mink-light tracking-wider mt-1">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-obsidian text-center px-4">
        <ButterflyIcon size={50} className="mx-auto mb-6 opacity-40" />
        <h2 className="font-display text-3xl text-ivory mb-4">Begin Your Butterfly Journey</h2>
        <p className="text-sm font-body text-ivory/50 mb-8 max-w-md mx-auto">Explore our collections and find the perfect piece for every occasion.</p>
        <Link href="/products"><Button size="lg">Shop Now <ArrowRight size={16} /></Button></Link>
      </section>
    </div>
  );
}
