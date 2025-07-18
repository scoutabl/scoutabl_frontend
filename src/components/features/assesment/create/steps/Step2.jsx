import React, { useState } from "react";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";
import AssessmentStep from "@/components/common/AssessmentStep";
import Section from "@/components/common/section";
import AddedTest from "@/components/common/AddedTest";
import {
  DEFAULT_LIST_API_PARAMS,
  SCOUTABL_RED,
  SCOUTABL_TEXT,
} from "@/lib/constants";
import { useInfiniteAssessmentTestPages } from "@/api/assessments/assessment-test";
import PaginatedScroll from "@/components/common/PaginatedScroll";
import AssessmentTestCard from "@/components/ui/cards/assessment-test-card";
import FlameIcon from "@/assets/flameIcon.svg?react";
import WheelIcon from "@/assets/wheelIcon.svg?react";
import { Button } from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { SCOUTABL_TEXT_SECONDARY, COMMON_VARIANTS } from "@/lib/constants";
import { EyeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateAssessment } from "@/api/assessments/assessment";

// TODO: Fetch from API
const MAX_TEST_COUNT = 5;

const ICON_MAP = {
  Popular: <FlameIcon className="size-4" />,
  Recommended: <WheelIcon className="size-4" />,
};

const Step2 = () => {
  const { assessment, steps, selectedStep, handleStepChange } =
    useAssessmentContext();
  console.log(assessment);
  const { mutateAsync: updateAssessment, isPending: isUpdatingAssessment } =
    useUpdateAssessment();
  const [searchParams] = useState(DEFAULT_LIST_API_PARAMS);
  const {
    data: assessmentTestsData,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteAssessmentTestPages({ ...searchParams });

  const tests =
    assessmentTestsData?.pages?.flatMap((page) => page.results) || [];
  const count = assessmentTestsData?.pages?.[0]?.count || 0;

  const selectedTests = assessment?.test_details || [];
  const selectedTestIds = (selectedTests || []).map((test) => test.id);
  // console.log(searchParams);
  const TEST_TAGS = ["Recommended", "Popular"];

  const handleAdd = async (testId) => {
    if (isUpdatingAssessment) return;
    await updateAssessment({
      assessmentId: assessment.id,
      data: {
        tests: [...selectedTestIds, testId],
      },
    });
  };

  const handleRemove = async (testId) => {
    if (isUpdatingAssessment) return;
    await updateAssessment({
      assessmentId: assessment.id,
      data: {
        tests: selectedTestIds.filter((test) => test !== testId),
      },
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <AssessmentStep
          steps={steps}
          selected={selectedStep}
          onSelect={handleStepChange}
        />
      </div>
      <Section className="flex flex-col">
        <Section className="bg-white flex flex-col p-3">
          <div className="flex flex-row gap-3 justify-between">
            {Array.from({ length: MAX_TEST_COUNT }).map((_, index) => (
              <AddedTest
                key={index}
                test={
                  selectedTests.length > index ? selectedTests[index] : null
                }
                order={index + 1}
              />
            ))}
          </div>
          <div>Filtering tools here</div>
        </Section>
        <div className="flex flex-col py-7">
          <h2 className="font-normal">{count} tests available</h2>

          <PaginatedScroll
            currentPage={assessmentTestsData?.pages.length || 1}
            totalCount={assessmentTestsData?.pages[0]?.count || 0}
            pageSize={searchParams.page_size}
            onNextPage={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            loading={isFetchingNextPage || isLoading}
            useWindowScroll
          >
            <div className="flex flex-row flex-wrap gap-4 justify-center mt-6">
              {tests.map((test) => {
                const isAdded = selectedTestIds.includes(test.id);
                const footer = (
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-row gap-2">
                      <IconButton
                        variant="circleOutline"
                        iconOutline={
                          <EyeIcon
                            className={`size-5 stroke-2 text-[${SCOUTABL_TEXT_SECONDARY}]`}
                          />
                        }
                        className="bg-white rounded-full text-black"
                      />
                      <Button
                        className={cn(
                          "rounded-full bg-white text hover:bg-white",
                          `text-[${SCOUTABL_TEXT_SECONDARY}]`,
                          COMMON_VARIANTS.outline
                        )}
                      >
                        Details
                      </Button>
                    </div>
                    {isAdded ? (
                      <Button
                        className={`text-white rounded-full`}
                        style={{
                          background: SCOUTABL_RED,
                        }}
                        onClick={() => {
                          handleRemove(test.id);
                        }}
                        // disabled={isUpdatingAssessment}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        className="rounded-full"
                        style={{ background: SCOUTABL_TEXT }}
                        onClick={() => handleAdd(test.id)}
                        // disabled={isUpdatingAssessment}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                );

                return (
                  <AssessmentTestCard
                    key={test.id}
                    name={test.name}
                    description={test.description}
                    footer={footer}
                    tags={TEST_TAGS.map((t) => ({
                      text: t,
                      icon: ICON_MAP[t],
                      variant:
                        t === "Recommended" ? "outlinePrimary" : "outline",
                    }))}
                    variant={isAdded ? "selected" : "default"}
                    className="basis-1/3 h-[281px] w-[376px]"
                  />
                );
              })}
            </div>
          </PaginatedScroll>
        </div>
      </Section>
    </div>
  );
};

export default React.memo(Step2);
