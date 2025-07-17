import React, { useState } from "react";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";
import AssessmentStep from "@/components/common/AssessmentStep";
import Section from "@/components/common/section";
import AddedTest from "@/components/common/AddedTest";
import { DEFAULT_LIST_API_PARAMS } from "@/lib/constants";
import { useInfiniteAssessmentTestPages } from "@/api/assessments/assessment-test";
import PaginatedScroll from "@/components/common/PaginatedScroll";
import AssessmentTestCard from "@/components/ui/cards/assessment-test-card";

// TODO: Fetch from API
const MAX_TEST_COUNT = 5;

const Step2 = () => {
  const { assessment, steps, selectedStep, handleStepChange } =
    useAssessmentContext();
  const [searchParams, setSearchParams] = useState(DEFAULT_LIST_API_PARAMS);
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
  // console.log(searchParams);

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
              {tests.map((test) => (
                <AssessmentTestCard
                  key={test.id}
                  name={test.name}
                  description={test.description}
                  footer={<p>footer</p>}
                  tags={[{text: "Recommended"}]}
                  className="basis-1/3 h-[281px] w-[376px]"
                />
              ))}
            </div>
          </PaginatedScroll>
        </div>
      </Section>
    </div>
  );
};

export default React.memo(Step2);
