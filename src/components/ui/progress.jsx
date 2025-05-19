import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  max = 100,
  ...props
}) {
  const percentage = max && value ? (value / max) * 100 : 0;
  return (
    (<ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-purplePrimary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }} />
    </ProgressPrimitive.Root>)
  );
}

export { Progress }
