import { useEnums } from "@/context/EnumsContext";
import {
  SCOUTABL_PINK,
  SCOUTABL_PURPLE,
  SCOUTABL_TEXT,
  SCOUTABL_TEXT_SECONDARY,
} from "@/lib/constants";
import { cn, durationToMinutes } from "@/lib/utils";
import Section from "./Section";
import ClockIcon from "@/assets/clockIcon.svg?react";
import HistIcon from "@/assets/histIcon.svg?react";
import QuestionIcon from "@/assets/questionIcon.svg?react";
import { LanguagesIcon } from "lucide-react";
import { useAllTags } from "@/api/misc/tags";
import Chip from "../ui/chip";

const InfoBox = ({ title, description, className = "" }) => {
  return (
    <Section
      className={cn(
        `p-5 flex flex-col gap-3 border border-1 border-[${SCOUTABL_PURPLE}] bg-[${SCOUTABL_PINK}]`,
        className
      )}
    >
      <h3 className="text-md font-semibold">Who is this test for?</h3>
      <p>{description}</p>
    </Section>
  );
};

const AssessmentTestDetail = ({ test }) => {
  const { resolveEnum } = useEnums();
  const { data: allTags } = useAllTags();

  const {
    name,
    description,
    test_relevance,
    test_audience_description,
    completion_time,
    question_count,
    test_type,
    tags,
  } = test;

  const skillTags =
    allTags?.filter((t) => t.tag_type === resolveEnum("TagType.SKILL")) || [];
  const testSkillTags = skillTags.filter((t) => tags.includes(t.id));

  const stats = [
    {
      name: "Time Duration",
      Icon: ClockIcon,
      value: `${durationToMinutes(completion_time)} min`,
    },
    {
      name: "No. of Questions",
      Icon: QuestionIcon,
      value: question_count,
    },
    {
      name: "Test Level",
      Icon: HistIcon,
      value:
        test_type === resolveEnum("AssessmentTestType.NORMAL")
          ? "Normal"
          : "Adaptive",
    },
    {
      name: "Languages",
      Icon: LanguagesIcon,
      value: "English",
    },
  ];

  return (
    <div className={cn("flex flex-col", `text-[${SCOUTABL_TEXT}]`)}>
      <div className="flex flex-row justify-between border-b-1 p-5 pb-3">
        <h1 className="font-semibold">{name}</h1>
      </div>
      <div className="flex flex-row justify-between gap-5 p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <h3>What is this test about?</h3>
            <p className={`text-[${SCOUTABL_TEXT_SECONDARY}]`}>{description}</p>
          </div>
          <div className="flex flex-row gap-4">
            {test_audience_description && (
              <InfoBox
                title="Who is this test for?"
                description={test_audience_description}
                className="basis-1/2"
              />
            )}
            {test_relevance && (
              <InfoBox
                title="How relevant is this test?"
                description={test_relevance}
                className="basis-1/2"
              />
            )}
          </div>
          {testSkillTags?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3>Skills Tested</h3>
              <div className="flex flex-row gap-2 w-[45%] flex-wrap">
                {testSkillTags.map((t) => (
                  <Chip key={t.id} variant="outlinePrimary" className="rounded-full">{t.name}</Chip>
                ))}
              </div>
            </div>
          )}
        </div>
        <Section className="flex flex-col gap-12 bg-white w-[430px] shadow-md">
          {stats.map((s) => (
            <div className="flex flex-col gap-2">
              <s.Icon className="size-8 text-purplePrimary" />
              <h3 className="text-md font-semibold">{s.name}</h3>
              <span className={`text-[${SCOUTABL_TEXT_SECONDARY}]`}>
                {s.value}
              </span>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
};

export default AssessmentTestDetail;
