import React, { useEffect, useState } from "react";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";
import AssessmentStep from "@/components/common/AssessmentStep";
import Section from "@/components/common/Section";
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
import {
  SCOUTABL_TEXT_SECONDARY,
  COMMON_VARIANTS,
  SCOUTABL_MUTED_PRIMARY,
} from "@/lib/constants";
import {
  EyeIcon,
  SquareActivityIcon,
  SquareKanbanIcon,
  WeightIcon,
  TrashIcon,
} from "lucide-react";
import { cn, debounce, durationToMinutes } from "@/lib/utils";
import { useUpdateAssessment } from "@/api/assessments/assessment";
import SearchInput from "@/components/shared/debounceSearch/SearchInput";
import Dropdown from "@/components/ui/dropdown";
import { useBootstrap } from "@/context/BootstrapContext";
import { useEnums } from "@/context/EnumsContext";
import ClockIcon from "@/assets/clockIcon.svg?react";
import HistIcon from "@/assets/histIcon.svg?react";
import QuestionIcon from "@/assets/questionIcon.svg?react";
import { useAllTags } from "@/api/misc/tags";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AssessmentTestDetail from "@/components/common/AssessmentTestDetails";
import TestAddDialog from "@/components/common/TestAddDialog";
import QuickStats from "@/components/common/QuickStats";
import ViewDetailsIcon from "@/assets/viewDetailIcon.svg?react";

// TODO: Fetch from API
const MAX_TEST_COUNT = 5;

const ICON_MAP = {
  Popular: <FlameIcon className="size-4" />,
  Recommended: <WheelIcon className="size-4" />,
};

const DURATION_FILTERS = [
  {
    completion_time__lte: 10 * 60,
  },
  {
    completion_time__gte: 10 * 60,
    completion_time__lte: 20 * 60,
  },
  {
    completion_time__gte: 20 * 60,
    completion_time__lte: 30 * 60,
  },
  {
    completion_time__gte: 30 * 60,
    completion_time__lte: 60 * 60,
  },
  {
    completion_time__gte: 60 * 60,
  },
];

const Step2 = () => {
  const [openTestId, setOpenTestId] = useState(null);
  const [openWeightTestId, setOpenWeightTestId] = useState(null);
  const { resolveEnum } = useEnums();
  const { data: allTags } = useAllTags();
  const { assessment, steps, selectedStep, handleStepChange } =
    useAssessmentContext();
  const { mutateAsync: updateAssessment, isPending: isUpdatingAssessment } =
    useUpdateAssessment();
  const { platformLibraryId, organisationLibraryId } = useBootstrap();
  const [searchParams, setSearchParams] = useState({
    ...DEFAULT_LIST_API_PARAMS,
  });
  const [durationFilter, setDurationFilter] = useState();
  const {
    data: assessmentTestsData,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteAssessmentTestPages({ ...searchParams });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      library: platformLibraryId,
    }));
  }, [platformLibraryId]);

  const skillTags =
    allTags?.filter((t) => t.tag_type === resolveEnum("TagType.SKILL")) || [];
  const testTypeTags =
    allTags?.filter((t) => t.tag_type === resolveEnum("TagType.TEST_TYPE")) ||
    [];
  const selectedSkillTags =
    searchParams?.tags__in?.filter((t) =>
      skillTags?.some((st) => st.id === t)
    ) || [];
  const selectedTestTypeTags =
    searchParams?.tags__in?.filter((t) =>
      testTypeTags?.some((tt) => tt.id === t)
    ) || [];

  const tests =
    assessmentTestsData?.pages?.flatMap((page) => page.results) || [];
  const count = assessmentTestsData?.pages?.[0]?.count || 0;

  const selectedTestsById =
    assessment?.test_details.length > 0
      ? assessment.test_details.reduce((acc, test) => {
          acc[test.id] = test;
          return acc;
        }, {})
      : {};
  const testsOrder =
    assessment?.tests_order?.filter((id) => selectedTestsById[id]) ||
    Object.keys(selectedTestsById);
  const selectedTests = testsOrder.map((id) => selectedTestsById[id]);
  const selectedTestIds = (selectedTests || []).map((test) => test.id);

  const TEST_TAGS = ["Recommended", "Popular"];

  const handleAdd = async (testId, weightage, isEdit = false) => {
    if (isUpdatingAssessment) return;
    await updateAssessment({
      assessmentId: assessment.id,
      data: {
        tests: [...selectedTestIds, testId],
        test_weights: {
          ...assessment.test_weights,
          [testId]: weightage,
        },
        tests_order: isEdit
          ? testsOrder
          : [...testsOrder.filter((id) => id !== testId), testId],
      },
    });
    setOpenWeightTestId(null);
  };

  const handleSearch = debounce((value) => {
    setSearchParams((prev) => ({
      ...prev,
      search: value,
    }));
  });

  const handleRemove = async (testId) => {
    if (isUpdatingAssessment) return;
    await updateAssessment({
      assessmentId: assessment.id,
      data: {
        tests: selectedTestIds.filter((test) => test !== testId),
        test_weights: {
          ...assessment.test_weights,
          [testId]: undefined,
        },
      },
    });
  };

  const renderTestDialogs = ({ test, isEdit }) => {
    return (
      <>
        <Dialog
          open={openTestId === test.id}
          onOpenChange={() => setOpenTestId(null)}
        >
          <DialogContent className="w-[80vw] overflow-y-auto p-0 rounded-3xl">
            <DialogTitle hidden>{test.name}</DialogTitle>
            <AssessmentTestDetail test={test} allTags={allTags} />
          </DialogContent>
        </Dialog>
        <Dialog
          open={openWeightTestId === test.id}
          onOpenChange={() => setOpenWeightTestId(null)}
        >
          <DialogContent className="w-180 p-0">
            <DialogTitle hidden>{test.name}</DialogTitle>
            <TestAddDialog
              test={test}
              onAddTest={(...args) => handleAdd(...args, isEdit)}
              disabled={isUpdatingAssessment}
              weight={assessment?.test_weights?.[test.id] || 50}
            />
          </DialogContent>
        </Dialog>
      </>
    );
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
      <Section contentClassName="flex flex-col">
        <Section variant="white" className="p-3" contentClassName="flex flex-col gap-5">
          <div className="flex flex-row gap-3 justify-between">
            {Array.from({ length: MAX_TEST_COUNT }).map((_, index) => {
              const test =
                selectedTests.length > index ? selectedTests[index] : null;
              return (
                <>
                  {test && renderTestDialogs({ test, isEdit: true })}
                  <AddedTest
                    key={index}
                    test={test}
                    order={index + 1}
                    options={[
                      {
                        value: "preview",
                        display: "Preview Test",
                        icon: <EyeIcon className="size-5" />,
                      },
                      {
                        value: "details",
                        display: "View Details",
                        icon: <ViewDetailsIcon className="size-5" />,
                      },
                      {
                        value: "weights",
                        display: "Edit Weightage",
                        icon: <SquareKanbanIcon className="size-5" />,
                      },
                      {
                        value: "remove",
                        display: "Remove Test",
                        icon: <TrashIcon className="size-5" />,
                      },
                    ]}
                    onAction={(val) => {
                      if (val === "preview") {
                        setOpenTestId(test.id);
                      } else if (val === "details") {
                        setOpenTestId(test.id);
                      } else if (val === "weights") {
                        setOpenWeightTestId(test.id);
                      } else if (val === "remove") {
                        handleRemove(test.id);
                      }
                    }}
                  />
                </>
              );
            })}
          </div>
          <div className="flex flex-row justify-between">
            <SearchInput
              placeholder="Search for tests"
              onChange={handleSearch}
            />
            <div className="flex flex-row gap-3">
              <Dropdown
                name="Library"
                variant="outline"
                currentValue={searchParams.library}
                options={[
                  {
                    display: "Scoutabl",
                    value: platformLibraryId,
                  },
                  {
                    display: "My Organisation",
                    value: organisationLibraryId,
                  },
                ]}
                onChange={(val) => {
                  setSearchParams((prev) => ({
                    ...prev,
                    library: val,
                  }));
                }}
              />
              <Dropdown
                name="Skill"
                currentValue={selectedSkillTags}
                multiselect
                showSelectAll
                clearable
                variant="outline"
                options={
                  skillTags?.map((t) => ({
                    display: t.name,
                    value: t.id,
                  })) || []
                }
                onChange={(val) => {
                  setSearchParams((prev) => {
                    const { tags__in, ...rest } = prev;
                    const newTags = [
                      ...(tags__in || []).filter(
                        (t) => !skillTags.some((st) => st.id === t)
                      ),
                      ...val,
                    ];
                    return { ...rest, tags__in: newTags };
                  });
                }}
                className="max-w-[200px]"
              />
              <Dropdown
                name="Type"
                currentValue={selectedTestTypeTags}
                multiselect
                showSelectAll
                clearable
                variant="outline"
                options={testTypeTags?.map((t) => ({
                  display: t.name,
                  value: t.id,
                }))}
                onChange={(val) => {
                  setSearchParams((prev) => {
                    const { tags__in, ...rest } = prev;
                    const newTags = [
                      ...(tags__in || []).filter(
                        (t) => !testTypeTags.some((tt) => tt.id === t)
                      ),
                      ...val,
                    ];
                    return { ...rest, tags__in: newTags };
                  });
                }}
                className="max-w-[200px]"
              />
              <Dropdown
                name="Duration"
                clearable
                variant="outline"
                currentValue={durationFilter}
                options={[
                  {
                    display: "upto 10 min",
                    value: 0,
                  },
                  {
                    display: "10-20 min",
                    value: 1,
                  },
                  {
                    display: "20-30 min",
                    value: 2,
                  },
                  {
                    display: "30-60 min",
                    value: 3,
                  },
                  {
                    display: "over 60 min",
                    value: 4,
                  },
                ]}
                onChange={(val) => {
                  setDurationFilter(val);
                  setSearchParams((prev) => {
                    const {
                      completion_time: _completion_time,
                      completion_time__lte: _completion_time__lte,
                      completion_time__gte: _completion_time__gte,
                      ...rest
                    } = prev;
                    return {
                      ...rest,
                      ...DURATION_FILTERS[val],
                    };
                  });
                }}
              />
            </div>
          </div>
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
                const stats = [
                  {
                    key: "duration",
                    value: `${
                      durationToMinutes(test.completion_time) || 0
                    } min`,
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
                      test.test_type ===
                      resolveEnum("AssessmentTestType.NORMAL")
                        ? "Normal"
                        : "Adaptive",
                    icon: <HistIcon className="size-4" />,
                  },
                ];
                const isAdded = selectedTestIds.includes(test.id);
                const footer = (
                  <div className="flex flex-col gap-4">
                    <QuickStats stats={stats} />
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
                          onClick={() => setOpenTestId(test.id)}
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
                          onClick={() => setOpenWeightTestId(test.id)}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                );

                return (
                  <>
                    {!selectedTestIds.includes(test.id) &&
                      renderTestDialogs({
                        test,
                        openTestId,
                        setOpenTestId,
                        openWeightTestId,
                        setOpenWeightTestId,
                      })}
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
                  </>
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
