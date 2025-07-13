import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { SCOUTABL_BLACK, SCOUTABL_PURPLE } from "@/lib/constants";

/**
 * CategoryCard component for displaying a styled card with header, title, content, and footer.
 * @param {object} props
 * @param {React.ReactNode} props.header - The header section (icon, badge, etc.)
 * @param {React.ReactNode} props.title - The title section (main heading)
 * @param {React.ReactNode} props.content - The main content (description, tags, etc.)
 * @param {React.ReactNode} props.footer - The footer section (actions, links, etc.)
 * @param {string} props.className - Additional className for the card
 */
const CategoryCard = ({
  header,
  title,
  content,
  footer,
  value = null,
  onClick = () => {},
  selected = false,
  className = "",
}) => {
  return (
    <div
      onClick={() => onClick(value)}
      className={cn(
        "flex flex-col rounded-2xl bg-white/70 shadow-md p-6 w-[300px] min-w-[220px] max-w-[340px] min-h-[340px] transition-all border border-[#E5E7EB] hover:shadow-lg hover:bg-[#FAEEFF] hover:cursor-pointer",
        selected
          ? "bg-[#FAEEFF] border-[#9B71F7]"
          : "bg-white border-black/10 hover:border-[#9B71F7]",
        className
      )}
      style={{
        boxShadow: "0 4px 24px 0 rgba(80, 63, 205, 0.06)",
        backdropFilter: "blur(2px)",
      }}
    >
      {header && (
        <div className="mb-4 flex items-center justify-between">{header}</div>
      )}
      {title && (
        <div
          className="mb-4 text-xl font-semibold"
          style={{
            color: selected ? SCOUTABL_PURPLE : "#000",
          }}
        >
          {title}
        </div>
      )}
      {content && (
        <div className="flex-1 mb-4 text-sm text-[#4B5563]">{content}</div>
      )}
      {footer && <div className="mt-auto pt-2">{footer}</div>}
    </div>
  );
};

CategoryCard.propTypes = {
  header: PropTypes.node,
  title: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
};

export default CategoryCard;
