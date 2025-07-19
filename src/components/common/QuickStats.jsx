import { cn } from "@/lib/utils";
import {
  SCOUTABL_TEXT_SECONDARY,
  SCOUTABL_MUTED_PRIMARY,
} from "@/lib/constants";

const QuickStats = ({ stats }) => {
  return (
    <div className="flex flex-row text-sm">
      {stats.map((stat, index) => (
        <div
          key={stat.key}
          className={cn(
            `flex flex-row gap-1 items-center px-2`,
            `text-[${SCOUTABL_TEXT_SECONDARY}]`,
            index < stats.length - 1 &&
              `border-r-1 border-[${SCOUTABL_MUTED_PRIMARY}]`,
              index === 0 && "pl-0"
          )}
        >
          {stat.icon}
          <span>{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
