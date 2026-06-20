"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "luxury" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  luxury:
    "bg-gradient-to-r from-[#FF3E7A] via-[#FFB800] to-[#FF3E7A] text-white border-transparent shadow-[0_4px_15px_rgba(255,62,122,0.4)] hover:shadow-[0_8px_30px_rgba(255,62,122,0.6)] hover:-translate-y-1 active:translate-y-0 font-bold",
  outline:
    "bg-white text-[#E05A7A] border-2 border-[#E05A7A] hover:bg-gradient-to-r hover:from-[#FF3E7A] hover:to-[#FFB800] hover:text-white hover:border-transparent hover:shadow-[0_6px_20px_rgba(255,62,122,0.4)] hover:-translate-y-0.5 font-bold",
  ghost:
    "bg-transparent text-obsidian hover:bg-champagne/10 border border-obsidian/20 hover:border-champagne hover:text-champagne",
  danger:
    "bg-gradient-to-r from-red-500 to-rose-600 text-white border-transparent shadow-md hover:shadow-lg hover:-translate-y-0.5 font-bold",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-xs",
  lg: "px-10 py-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "luxury", size = "md", loading, fullWidth, className, children, disabled, ...rest },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-body font-semibold tracking-widest uppercase rounded-full transition-all duration-300 overflow-hidden select-none cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          (disabled || loading) && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        disabled={disabled || loading}
        {...rest}
      >
        {/* Shimmer effect */}
        {variant === "luxury" && (
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 pointer-events-none" />
        )}
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
