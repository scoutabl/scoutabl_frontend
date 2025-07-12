import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Loading({ iconProps, className }) {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader2
        className="animate-spin text-purplePrimary h-10 w-10"
        {...iconProps}
      />
    </div>
  );
}
