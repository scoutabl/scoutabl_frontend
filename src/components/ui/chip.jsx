import { cn } from "@/lib/utils";


const variants = {
    default: "text-greyPrimary bg-[#F5F5F5]",
    outline: "border border-primary text-primary bg-white",
    outlinePrimary: "border border-purplePrimary text-purplePrimary bg-white",
}

const Chip = ({ children, className = "", variant = "default", ...rest }) => {
  return (
    <span
      className={cn(
        `block px-3 py-1 mt-auto rounded-md text-sm whitespace-nowrap`,
        variants[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

export default Chip;
