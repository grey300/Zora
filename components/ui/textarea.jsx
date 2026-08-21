import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        "flex min-h-28 w-full resize-y rounded-xl border border-input bg-background/60 px-3.5 py-3 text-base shadow-sm transition-all placeholder:text-muted-foreground/75 hover:border-emerald-400/50 focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
