"use client";

import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon";
  className?: string;
};

const sizes = {
  sm: { icon: 30, text: "text-lg", tagline: "text-[9px]" },
  md: { icon: 38, text: "text-2xl", tagline: "text-[10px]" },
  lg: { icon: 52, text: "text-3xl", tagline: "text-xs" },
  xl: { icon: 68, text: "text-4xl", tagline: "text-sm" },
};

export function ButterflyLogo({ size = "md", variant = "full", className }: LogoProps) {
  const s = sizes[size];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ButterflyIcon size={s.icon} />
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span
            className={cn("font-display font-semibold tracking-[0.18em]", s.text)}
            style={{
              background: "linear-gradient(120deg, #C9A84C 0%, #FFD700 30%, #FF3E7A 65%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            BUTTERFLY
          </span>
          <span className={cn("font-body tracking-[0.35em] uppercase text-mink-light mt-1", s.tagline)}>
            Fine Jewellery
          </span>
        </div>
      )}
    </div>
  );
}

export function ButterflyIcon({ size = 38, className }: { size?: number; className?: string }) {
  const id = `bfly-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Outer glow */}
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Left wing gradient â€” gold to rose */}
        <linearGradient id={`${id}-wl`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="45%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#FF3E7A" stopOpacity="0.9" />
        </linearGradient>
        {/* Right wing gradient â€” violet to gold */}
        <linearGradient id={`${id}-wr`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#FF3E7A" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0.9" />
        </linearGradient>
        {/* Body gradient */}
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
        {/* Shimmer overlay */}
        <radialGradient id={`${id}-shine`} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* â”€â”€ LEFT UPPER WING â”€â”€ */}
      <path
        d="M40 34 C36 20, 20 8, 8 14 C0 20, 4 34, 14 38 C22 42, 34 40, 40 38 Z"
        fill={`url(#${id}-wl)`}
        filter={`url(#${id}-glow)`}
        opacity="0.96"
      />
      {/* Left upper wing shine */}
      <path
        d="M40 34 C36 20, 20 8, 8 14 C0 20, 4 34, 14 38 C22 42, 34 40, 40 38 Z"
        fill={`url(#${id}-shine)`}
      />

      {/* â”€â”€ LEFT LOWER WING â”€â”€ */}
      <path
        d="M40 38 C30 44, 10 46, 8 56 C6 64, 20 68, 30 60 C36 55, 40 46, 40 42 Z"
        fill={`url(#${id}-wl)`}
        opacity="0.82"
      />

      {/* â”€â”€ RIGHT UPPER WING â”€â”€ */}
      <path
        d="M40 34 C44 20, 60 8, 72 14 C80 20, 76 34, 66 38 C58 42, 46 40, 40 38 Z"
        fill={`url(#${id}-wr)`}
        filter={`url(#${id}-glow)`}
        opacity="0.96"
      />
      {/* Right upper wing shine */}
      <path
        d="M40 34 C44 20, 60 8, 72 14 C80 20, 76 34, 66 38 C58 42, 46 40, 40 38 Z"
        fill={`url(#${id}-shine)`}
      />

      {/* â”€â”€ RIGHT LOWER WING â”€â”€ */}
      <path
        d="M40 38 C50 44, 70 46, 72 56 C74 64, 60 68, 50 60 C44 55, 40 46, 40 42 Z"
        fill={`url(#${id}-wr)`}
        opacity="0.82"
      />

      {/* â”€â”€ WING INNER DETAIL VEINS â”€â”€ */}
      <path d="M40 36 C32 28, 18 18, 12 20" stroke="#FFD700" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" fill="none" />
      <path d="M40 36 C48 28, 62 18, 68 20" stroke="#7C3AED" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" fill="none" />
      <path d="M40 40 C32 48, 14 52, 12 56" stroke="#FF3E7A" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" fill="none" />
      <path d="M40 40 C48 48, 66 52, 68 56" stroke="#C9A84C" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" fill="none" />

      {/* â”€â”€ BODY â”€â”€ */}
      <ellipse cx="40" cy="40" rx="2.8" ry="10" fill={`url(#${id}-body)`} />
      <ellipse cx="40" cy="40" rx="1.2" ry="4" fill="white" opacity="0.3" />

      {/* â”€â”€ ANTENNAE LEFT â”€â”€ */}
      <path d="M39 31 C36 24, 30 18, 27 14" stroke="#FFD700" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="26.5" cy="13" r="2" fill="#FFD700" />
      <circle cx="26.5" cy="13" r="1" fill="white" opacity="0.5" />

      {/* â”€â”€ ANTENNAE RIGHT â”€â”€ */}
      <path d="M41 31 C44 24, 50 18, 53 14" stroke="#7C3AED" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="53.5" cy="13" r="2" fill="#7C3AED" />
      <circle cx="53.5" cy="13" r="1" fill="white" opacity="0.5" />

      {/* â”€â”€ SPARKLE DOTS on wings â”€â”€ */}
      <circle cx="20" cy="24" r="1.8" fill="white" opacity="0.55" />
      <circle cx="60" cy="24" r="1.8" fill="white" opacity="0.55" />
      <circle cx="15" cy="52" r="1.3" fill="white" opacity="0.4" />
      <circle cx="65" cy="52" r="1.3" fill="white" opacity="0.4" />
      <circle cx="28" cy="18" r="1" fill="white" opacity="0.6" />
      <circle cx="52" cy="18" r="1" fill="white" opacity="0.6" />
    </svg>
  );
}


