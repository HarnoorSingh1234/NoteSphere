import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[#264143] placeholder:text-[#264143]/50 selection:bg-[#4CAF50] selection:text-white",
        "flex h-9 w-full min-w-0 rounded-[0.4em] border-[0.15em] border-[#264143] bg-white px-3 py-1 text-base text-[#264143] shadow-xs transition-all outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F8F5F2]",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }