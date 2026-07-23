"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Star display / input.
 * <RatingStars value={4.2} count={12} />                 → read-only with count
 * <RatingStars value={my} onChange={(n) => ...} />       → interactive
 */
export function RatingStars({ value = 0, count, onChange, size = 16, className }) {
  const interactive = typeof onChange === "function";
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(n)}
            className={cn(
              "p-0.5",
              interactive && "cursor-pointer transition-transform hover:scale-110"
            )}
          >
            <Star
              size={size}
              className={
                n <= Math.round(value)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300 dark:text-gray-600"
              }
            />
          </button>
        ))}
      </span>
      {value > 0 && (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {Number(value).toFixed(1)}
          {typeof count === "number" && ` (${count})`}
        </span>
      )}
    </span>
  );
}

export default RatingStars;
