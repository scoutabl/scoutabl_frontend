import { cn } from "@/lib/utils";

const Section = ({ children, className }) => {
  return (
    <div className={cn("p-5 rounded-xl bg-purpleSecondary", className)}>
      {children}
    </div>
  );
};

export default Section;
