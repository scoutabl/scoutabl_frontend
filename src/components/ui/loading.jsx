import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  default: "text-purplePrimary",
  white: "text-white",
};

export default function Loading({
  iconProps,
  variant = "default",
  iconClassName = "",
  className = "",
}) {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader2
        className={cn("animate-spin h-10 w-10", iconClassName, variants[variant])}
        {...iconProps}
      />
    </div>
  );
}
