import {
  SCOUTABL_PURPLE,
  SCOUTABL_MUTED_SECONDARY,
  SCOUTABL_WHITE,
  SCOUTABL_BLACK,
} from "@/lib/constants";

const BoxedIcon = ({
  icon,
  activeBgColor = SCOUTABL_PURPLE,
  inactiveBgColor = SCOUTABL_MUTED_SECONDARY,
  activeFgColor = SCOUTABL_WHITE,
  inactiveFgColor = SCOUTABL_BLACK,
  isActive = false,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-row gap-2 justify-center items-center rounded-lg p-2 w-12 h-12 ${className}`}
      style={{
        backgroundColor: isActive ? activeBgColor : inactiveBgColor,
        color: isActive ? activeFgColor : inactiveFgColor,
      }}
    >
      {icon}
    </div>
  );
};

export default BoxedIcon;
