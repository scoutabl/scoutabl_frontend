"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

function TooltipProvider({ delayDuration = 0, ...props }) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

export function CustomTooltip({
  message,
  className = "",
  maxWidth = "240px",
  sideOffset = 4,
  delayDuration = 0,
  ...props
}) {
  if (!message) return null

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        {/* Trigger with Help Icon */}
        <TooltipPrimitive.Trigger asChild>
          <button
            type="button"
            aria-label="Help"
            className="p-0 m-0 bg-transparent border-0 inline-flex items-center"
          >
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </button>
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={sideOffset}
            className={cn(
              "z-50 rounded-md px-3 py-1.5 text-xs bg-gray-700 text-white shadow-md animate-in fade-in-0 zoom-in-95 " +
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 " +
                "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 " +
                "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className
            )}
            style={{
              maxWidth: maxWidth,
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              display: "inline-block",
            }}
            {...props}
          >
            <div className="whitespace-normal break-words text-sm leading-snug">
              {message}
            </div>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  )
}
