import { Loader2 } from "lucide-react";

export default function Loading({ iconProps }) {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <Loader2
        className="animate-spin text-purplePrimary h-10 w-10"
        {...iconProps}
      />
    </div>
  );
}
