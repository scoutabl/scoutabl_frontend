import React from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import UserAvatarBadge from "@/components/common/UserAvatarBadge";

/**
 * EntityCard for assessment list
 * @param {Object} props
 * @param {string} props.status
 * @param {string} props.statusBg - Tailwind class for status background
 * @param {string} props.statusDot - Tailwind class for status dot
 * @param {string} props.statusText - Tailwind class for status text
 * @param {string} props.title
 * @param {string} props.owner
 * @param {string} props.expires
 * @param {string[]} props.tags
 * @param {number} props.candidates
 * @param {React.ComponentType} props.candidatesIcon
 * @param {Array} props.popoverMenu - [{icon, label, color, hover, key, rounded, onClick}]
 * @param {boolean} props.popoverOpen
 * @param {function} props.onPopoverOpenChange
 * @param {React.ReactNode} props.popoverTrigger
 * @param {string} [props.className]
 */
const AssessmentCard = ({
  status,
  statusBg = "",
  statusDot = "",
  statusText = "",
  title,
  owner,
  expires,
  tags = [],
  candidates,
  candidatesIcon: CandidatesIcon,
  popoverMenu = [],
  popoverOpen,
  onPopoverOpenChange,
  popoverTrigger,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "py-[18px] px-4 flex flex-col gap-4 rounded-2xl border border-seperatorPrimary bg-white",
        "hover:bg-purpleTertiary hover:border-purplePrimary",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "px-3 py-1 flex items-center gap-[6px] rounded-full",
            statusBg
          )}
        >
          <div className={cn("h-2 w-2 rounded-full", statusDot)} />
          <span className={cn("text-xs font-medium", statusText)}>{status}</span>
        </div>
        <Popover open={popoverOpen} onOpenChange={onPopoverOpenChange}>
          <PopoverTrigger asChild>{popoverTrigger}</PopoverTrigger>
          <PopoverContent className="p-0 flex flex-col max-w-[240px] rounded-2xl bg-white">
            {popoverMenu.map((item, idx, arr) => {
              const isFirst = idx === 0;
              const isLast = idx === arr.length - 1;
              const rounded =
                item.rounded ||
                (isFirst
                  ? "rounded-tl-2xl rounded-tr-2xl"
                  : isLast
                  ? "rounded-bl-2xl rounded-br-2xl"
                  : "");
              return (
                <button
                  onClick={item.onClick}
                  key={item.key}
                  className={cn(
                    "relative py-3 px-4 flex gap-3 items-center group w-full text-left hover:bg-purpleTertiary",
                    { "hover:bg-[#FBDDDD]": item.key === "delete" },
                    rounded
                  )}
                >
                  <div
                    className={cn(
                      "absolute left-0 top-0 h-full w-1 opacity-0 group-hover:opacity-100 bg-purplePrimary",
                      { "bg-[#EB5757]": item.key === "delete" }
                    )}
                  />
                  {item.icon}
                  <span
                    className={`font-medium text-sm text-nowrap ${item.color} ${item.hover}`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-base text-semibold text-greyPrimary text-xl">{title}</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-purplePrimary">Owner</span>
          <UserAvatarBadge user={owner} />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-purplePrimary">Expires</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-greyPrimary">{expires}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tags.map((tag, index) => (
            <div key={index} className="px-3 py-1 bg-blueSecondary rounded-full">
              <span className="text-xs text-greyAccent">{tag}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-1 items-end">
          <span className="text-purplePrimary">
            {CandidatesIcon && <CandidatesIcon className="size-8" />}
            </span>
          <span className="text-3xl text-greyPrimary font-bold leading-none">{candidates}</span>
          <span className="text-sm text-greyAccent">Candidate{candidates > 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AssessmentCard);
