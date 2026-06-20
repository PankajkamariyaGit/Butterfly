"use client";

import { cn } from "@/lib/utils";

type BadgeProps = {
  label: string;
  className?: string;
};

const badgeStyles: Record<string, string> = {
  Bestseller: "bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-sm",
  "New Arrival": "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm",
  "Limited Edition": "bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-sm",
  "Festive Pick": "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm",
  Trending: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm",
  default: "bg-white/90 text-obsidian border border-champagne/30",
};

export function Badge({ label, className }: BadgeProps) {
  const style = badgeStyles[label] ?? badgeStyles.default;
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 text-[9px] font-body font-bold tracking-widest uppercase rounded-full",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
