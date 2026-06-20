"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  count?: number;
  className?: string;
};

export function StarRating({ rating, max = 5, size = 14, showValue, count, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < Math.floor(rating)
                ? "fill-champagne text-champagne"
                : i < rating
                ? "fill-champagne/50 text-champagne"
                : "fill-none text-mink-light/40"
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-body text-mink font-medium">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs font-body text-mink-light">({count})</span>
      )}
    </div>
  );
}
