"use client";

import { motion } from "framer-motion";
import { Ruler } from "lucide-react";

const GUIDE = [
  {
    category: "Rings",
    tip: "Measure the circumference of your finger in mm using a thin strip of paper.",
    sizes: [
      { size: "Size 6", mm: "51.8 mm", indian: "Approx. size 11–12" },
      { size: "Size 7", mm: "54.4 mm", indian: "Approx. size 13–14" },
      { size: "Size 8", mm: "57.1 mm", indian: "Approx. size 15–16" },
      { size: "Size 9", mm: "59.7 mm", indian: "Approx. size 17–18" },
      { size: "Size 10", mm: "62.3 mm", indian: "Approx. size 19–20" },
    ],
  },
  {
    category: "Bangles",
    tip: "Fold your thumb inward and measure the widest part of your hand in cm.",
    sizes: [
      { size: "2/2 (XS)", mm: "5.2 cm", indian: "Very slim wrist" },
      { size: "2/4 (S)", mm: "5.6 cm", indian: "Slim wrist" },
      { size: "2/6 (M)", mm: "6.0 cm", indian: "Average wrist" },
      { size: "2/8 (L)", mm: "6.4 cm", indian: "Wide wrist" },
      { size: "2/10 (XL)", mm: "6.8 cm", indian: "Extra wide wrist" },
    ],
  },
  {
    category: "Necklace Length",
    tip: "Use a flexible measuring tape or a piece of string around your neck.",
    sizes: [
      { size: "Choker", mm: "35–40 cm", indian: "Sits at throat" },
      { size: "Princess", mm: "43–48 cm", indian: "Most popular, sits at collarbone" },
      { size: "Matinee", mm: "50–60 cm", indian: "Mid-chest, great for sarees" },
      { size: "Opera", mm: "70–90 cm", indian: "Long, versatile — can be doubled" },
    ],
  },
];

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-ivory pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">Fit Guide</p>
          <h1 className="font-display text-5xl text-obsidian">Size Guide</h1>
          <p className="font-body text-sm text-mink-light mt-4 max-w-md mx-auto">Find your perfect fit with our easy-to-follow measurements for rings, bangles, and necklaces.</p>
        </motion.div>

        {/* Tip card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-champagne/5 border border-champagne/20 rounded-2xl p-5 flex gap-4 mb-10">
          <Ruler size={20} className="text-champagne shrink-0 mt-0.5" />
          <p className="font-body text-sm text-obsidian/80 leading-relaxed">All measurements are approximate. For the best fit, measure your finger / wrist / neck in the evening when they are slightly larger. When between sizes, choose the larger size.</p>
        </motion.div>

        {/* Tables */}
        <div className="space-y-10">
          {GUIDE.map(({ category, tip, sizes }, idx) => (
            <motion.div key={category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-white border border-champagne/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-champagne/10 flex items-center justify-between">
                <h2 className="font-display text-xl text-obsidian">{category}</h2>
              </div>
              <div className="px-6 py-4 bg-champagne/5">
                <p className="font-body text-xs text-mink-light"><span className="font-semibold text-obsidian">How to measure:</span> {tip}</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-champagne/10">
                    <th className="px-6 py-3 text-left font-body text-[10px] text-champagne tracking-[0.2em] uppercase">Size</th>
                    <th className="px-6 py-3 text-left font-body text-[10px] text-champagne tracking-[0.2em] uppercase">Measurement</th>
                    <th className="px-6 py-3 text-left font-body text-[10px] text-champagne tracking-[0.2em] uppercase">Fits</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((row, i) => (
                    <tr key={row.size} className={i % 2 === 0 ? "bg-pearl/30" : ""}>
                      <td className="px-6 py-3 font-body text-sm font-semibold text-obsidian">{row.size}</td>
                      <td className="px-6 py-3 font-body text-sm text-obsidian/70">{row.mm}</td>
                      <td className="px-6 py-3 font-body text-sm text-mink-light">{row.indian}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ))}
        </div>

        <p className="text-center font-body text-xs text-mink-light mt-10">Still unsure? <a href="/contact" className="text-champagne hover:underline">Chat with our stylist</a> and we&apos;ll help you find the right fit.</p>
      </div>
    </div>
  );
}
