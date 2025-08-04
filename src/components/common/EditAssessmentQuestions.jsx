import React, { useState } from "react";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";
import Section from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import SearchInput from "@/components/shared/debounceSearch/SearchInput";
import QuestionSequenceTable from "@/components/common/QuestionSequenceTable";
import AssessmentQuestionCard from "@/components/ui/cards/assessment-question-card";
import { useInfiniteQuestionPages } from "@/api/assessments/question";
import { debounce } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import { useAllTags } from "@/api/misc/tags";
import { useBootstrap } from "@/context/BootstrapContext";
import { useEnums } from "@/context/EnumsContext";
import Dropdown from "../ui/dropdown";
import PaginatedScroll from "./PaginatedScroll";

const EditAssessmentQuestions = () => {
  /***************************************************************************
   * Context & State                                                         *
   ***************************************************************************/
  const { assessment, updateAssessment, isUpdatingAssessment } =
    useAssessmentContext();
  const { platformLibraryId, organisationLibraryId } = useBootstrap();
  const { data: allTags } = useAllTags();
  const { resolveEnum } = useEnums();

  const [searchParams, setSearchParams] = useState({ search: "", page_size: 10 });

  const skillTags =
    allTags?.filter((t) => t.tag_type === resolveEnum("TagType.SKILL")) || [];
  const selectedSkillTags =
    searchParams?.tags__in?.filter((t) =>
      skillTags.some((st) => st.id === t)
    ) || [];

  // Selected & order helpers -------------------------------------------------
  const selectedQuestionIds = assessment?.custom_questions || [];
  const questionOrder =
    assessment?.custom_questions_order?.filter((id) =>
      selectedQuestionIds.includes(id)
    ) || selectedQuestionIds;

  // Fetch candidate questions list (simple — no infinite scroll)
  const { data: questionsData, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuestionPages({ ...searchParams });

  // Filter out already-selected questions from the library list
  const questions = questionsData?.pages?.flatMap((page) => page.results) || [];

  const availableQuestions = questions.filter(
    (q) => !selectedQuestionIds.includes(q.id)
  );

  /***************************************************************************
   * Handlers                                                                *
   ***************************************************************************/
  const handleSearch = debounce((value) => {
    setSearchParams((prev) => ({ ...prev, search: value }));
  });

  const handleAdd = async (questionId) => {
    if (isUpdatingAssessment) return;
    await updateAssessment({
      assessmentId: assessment.id,
      data: {
        custom_questions: [...selectedQuestionIds, questionId],
        custom_questions_order: [
          ...questionOrder.filter((id) => id !== questionId),
          questionId,
        ],
      },
    });
  };

  /***************************************************************************
   * UI RENDER                                                               *
   ***************************************************************************/
  return (
    <div className="flex flex-col gap-4 h-full">
      <Section
        variant="white"
        className="p-3"
        contentClassName="flex flex-col gap-2"
      >
        <div className="flex flex-row justify-between">
          <SearchInput placeholder="Search for tests" onChange={handleSearch} />
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
            {/* <Dropdown
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
                    ...(tags__in || []).filter((t) => !testTypeTags.some((tt) => tt.id === t)),
                    ...val,
                  ];
                  return { ...rest, tags__in: newTags };
                });
              }}
              className="max-w-[200px]"
            /> */}
          </div>
        </div>
        {/* <div>
        <p className="font-normal   ">{count} Questions Available</p>
        </div> */}
      </Section>
      <div className="flex gap-6 h-full">
        {/* Left — Library + filters */}
        <Section
          className="flex-1"
          variant="transparent"
          contentClassName="h-full"
        >
          {/* List of available questions */}
          <PaginatedScroll
            currentPage={questionsData?.pages.length || 1}
            totalCount={questionsData?.pages[0]?.count || 0}
            pageSize={searchParams.page_size}
            onNextPage={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            loading={isFetchingNextPage || isLoading}
            useWindowScroll
          >
            <div className="flex flex-wrap gap-4 h-full pr-2">
                {isLoading && <p>Loading…</p>}
                {!isLoading && availableQuestions.length === 0 && (
                <p className="text-sm text-gray-400">No questions found.</p>
                )}
                {availableQuestions.map((q) => {
                const footer = (
                    <div className="flex justify-between">
                    <IconButton
                        variant="circleOutline"
                        iconOutline={<EyeIcon className="size-5" />}
                        disabled
                    />
                    <Button
                        size="sm"
                        className="rounded-full bg-purplePrimary hover:bg-purplePrimary/90 text-white"
                        onClick={() => handleAdd(q.id)}
                    >
                        Add
                    </Button>
                    </div>
                );
                return (
                    <AssessmentQuestionCard
                    key={q.id}
                    name={q.title || `Question #${q.id}`}
                    description={q.description}
                    footer={footer}
                    className="basis-[calc(50%-0.5rem)] max-w-[calc(50%-0.5rem)] h-[250px]"
                    />
                );
                })}
            </div>
          </PaginatedScroll>
        </Section>

        {/* Right – mini sequence table */}
        <QuestionSequenceTable
          className="w-[40%] overflow-y-auto h-[fit-content]"
          variant="white"
          assessmentId={assessment?.id}
          onEdit={() => {}}
          minimal
        />
      </div>
    </div>
  );
};

export default React.memo(EditAssessmentQuestions);
