"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer size-5 shrink-0 rounded-[5px] border-1 border-purplePrimary hover:border-purplePrimary group-hover:border-purplePrimary bg-white shadow-sm transition-all duration-300 ease-in outline-none focus-visible:ring-2 focus-visible:ring-purplePrimary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-purplePrimary data-[state=checked]:bg-white data-[state=checked]:text-purplePrimary cursor-pointer",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <div className="size-3 bg-purplePrimary rounded-[3px] pointer-events-none" />

    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
