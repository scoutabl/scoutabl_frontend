import { cn } from "@/lib/utils";
import ChevronDownIcon from "@/assets/chevronDownIcon.svg?react";

const variants = {
  default: "bg-purpleSecondary",
  suggestion: "bg-purpleQuaternary border border-1 border-purplePrimary",
  white: "bg-white",
  primary: "bg-backgroundPrimary",
  transparent: "bg-inherit border-none p-0"
};

const Section = ({
  children,
  className,
  contentClassName,
  header,
  collapsable = false,
  collapsed = false,
  onToggle,
  variant = "default",
  id,
}) => {
  const handleToggle = () => {
    if (collapsable && onToggle) {
      onToggle();
    }
  };

  return (
    <section
      id={id}
      className={cn(
        "rounded-2xl p-5",
        variants[variant],
        className
      )}
    >
      {header && (
        <div className="flex items-center justify-between mb-6">
          {typeof header === "string" ? (
            <h2 className="text-xl font-semibold">{header}</h2>
          ) : (
            header
          )}
          {collapsable && (
            <button onClick={handleToggle} className="flex items-center gap-2">
              <ChevronDownIcon  
                className={cn(
                  "w-6 h-6 text-gray-600 transition-transform border  border-solid border-gray-400 rounded-full",
                  collapsed && "rotate-180"
                )}
              />
            </button>
          )}
        </div>
      )}
      {!collapsed && (
        <div className={cn(header ? "" : "pt-0", contentClassName)}>
          {children}
        </div>
      )}
    </section>
  );
};

export default Section;
