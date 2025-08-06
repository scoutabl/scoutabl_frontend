import React from "react";
import TickIcon from "@/assets/tick.svg?react";
import MultiSelect from "@/assets/multiSelect.svg?react";
import RatingIcon from "@/assets/ratingIcon.svg?react";
import RearrangeIcon from "@/assets/rearrangeIcon.svg?react";
import NumericInputIcon from "@/assets/numericInputIcon.svg?react";
import EssayIcon from "@/assets/essayIcon.svg?react";
import CodeIcon from "@/assets/codeIcon.svg?react";
import MsExcelIcon from "@/assets/msExcelIcon.svg?react";
import GoogleSheetsIcon from "@/assets/googleSheetsIcon.svg?react";
import VideoIcon from "@/assets/videoIcon.svg?react";
import AudioIcon from "@/assets/audioIcon.svg?react";

// Question type definitions moved to this component
const questionTypeConfigs = {
  "single-select": {
    name: "Single Select",
    icon: <TickIcon />,
    bg: "#D8FEE3",
    text: "#13482A",
  },
  "multiple-select": {
    name: "Multiple Select",
    icon: <MultiSelect />,
    bg: "#FEEDD9",
    text: "#BD7500",
  },
  rating: {
    name: "Rating",
    icon: <RatingIcon />,
    bg: "#E8E5FF",
    text: "#3B2A91",
  },
  rearrange: {
    name: "Rearrange",
    icon: <RearrangeIcon className="h-3 w-3" />,
    bg: "#95D1D2",
    text: "#2F5D5E",
  },
  "numeric-input": {
    name: "Numeric Input",
    icon: <NumericInputIcon />,
    bg: "#C18DAC",
    text: "#643B53",
  },
  essay: {
    name: "Essay",
    icon: <EssayIcon />,
    bg: "#A98878",
    text: "#64483B",
  },
  code: {
    name: "Code",
    icon: <CodeIcon className="h-3 w-3" />,
    bg: "#8893D1",
    text: "#192569",
  },
  "ms-excel": {
    name: "MS Excel",
    icon: <MsExcelIcon />,
    bg: "#E9755B",
    text: "#692819",
  },
  "google-sheets": {
    name: "Google Sheets",
    icon: <GoogleSheetsIcon />,
    bg: "#5DDD87",
    text: "#1C4B2B",
  },
  video: {
    name: "Video",
    icon: <VideoIcon />,
    bg: "#D8FFFE",
    text: "#0A615F",
  },
  audio: {
    name: "Audio",
    icon: <AudioIcon />,
    bg: "#FFFFDE",
    text: "#5C7D0E",
  },
};

const QuestionTypeTag = ({
  type,
  className = "",
  iconClassName = "",
  textClassName = "",
  hideIcon = false,
}) => {
  const config = questionTypeConfigs[type];

  if (!config) {
    return (
      <div
        className={`font-medium text-sm px-2 py-1 rounded-full bg-gray-200 text-gray-700 ${className}`}
      >
        Unknown
      </div>
    );
  }

  return (
    <div
      className={`font-medium text-sm rounded-full px-[6px] py-[5.5px] flex items-center gap-[6px] ${className}`}
      style={{
        background: config.bg,
        color: config.text,
      }}
    >
      {!hideIcon && (
        <div
          className={`w-[18px] h-[18px] flex items-center justify-center rounded-full ${iconClassName}`}
          style={{
            background: config.text,
          }}
        >
          {React.cloneElement(config.icon, {
            style: {
              color: config.bg,
              width: 12,
              height: 12,
            },
          })}
        </div>
      )}
      <span className={`text-sm font-medium ${textClassName}`}>
        {config.name}
      </span>
    </div>
  );
};

export default QuestionTypeTag;
