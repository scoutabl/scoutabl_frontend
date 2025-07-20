import QuickStats from "./QuickStats";
import { cn, durationToMinutes } from "@/lib/utils";
import ClockIcon from "@/assets/clockIcon.svg?react";
import HistIcon from "@/assets/histIcon.svg?react";
import QuestionIcon from "@/assets/questionIcon.svg?react";
import { useEnums } from "@/context/EnumsContext";
import Section from "./Section";
import { SCOUTABL_TEXT_SECONDARY } from "@/lib/constants";
import { Slider } from "../ui/slider";
import { useState } from "react";
import Chip from "../ui/chip";
import { Button } from "../ui/button";

const TestAddDialog = ({ test, onAddTest, weight = 50, disabled = false }) => {
  const { resolveEnum } = useEnums();
  const [sliderValue, setSliderValue] = useState([weight]);

  const stats = [
    {
      key: "duration",
      value: `${durationToMinutes(test.completion_time) || 0} min`,
      icon: <ClockIcon className="size-4" />,
    },
    {
      key: "qustions",
      value: `${test.question_count} questions`,
      icon: <QuestionIcon className="size-4" />,
    },
    {
      key: "type",
      value:
        test.test_type === resolveEnum("AssessmentTestType.NORMAL")
          ? "Normal"
          : "Adaptive",
      icon: <HistIcon className="size-4" />,
    },
  ];

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-purplePrimary">{test.name}</h2>
        <QuickStats stats={stats} />
      </div>
      <Section className="flex flex-col gap-2">
        <h3 className={cn("text-md font-semibold")}>Test Info</h3>
        <Section className="flex flex-col gap-2 bg-white">
          <p className={`text-[${SCOUTABL_TEXT_SECONDARY}]`}>
            {test.description}
          </p>
        </Section>
      </Section>
      <div className="flex flex-col gap-3">
        <h3 className="text-md font-semibold">Test Weightage</h3>
        <div className="flex flex-row gap-3 items-center">
          <Slider
            value={sliderValue}
            max={100}
            step={10}
            className={cn("w-[70%]")}
            onValueChange={handleSliderChange}
          />
          {/* Display the current slider value */}
          <Chip className="text-white bg-greyPrimary">{sliderValue[0]}</Chip>
        </div>
        <div className="flex items-center justify-center mt-5">
          <Button
            className="rounded-full bg-purplePrimary hover:bg-purplePrimary w-30"
            onClick={() => onAddTest(test.id, sliderValue[0])}
            disabled={disabled}
          >
            Add Test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestAddDialog;
