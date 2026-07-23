"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              `
                [--aurora:repeating-linear-gradient(100deg, #F472B6 10%, #A3BFFA 15%, #93C5FD 20%, #FBCFE8 25%, #93C5FD 30%)]
                [background-image:var(--aurora)]
                [background-size:300%, 200%]
                [background-position:50% 50%,50% 50%]
                filter blur-[10px]
                after:content-[""] after:absolute after:inset-0 after:[background-image:var(--aurora)] 
                after:[background-size:200%, 100%]
                after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
                pointer-events-none
                absolute -inset-[10px] opacity-50 will-change-transform`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
