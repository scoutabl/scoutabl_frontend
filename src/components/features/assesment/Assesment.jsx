import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import PlusIcon from "@/assets/plusIcon.svg?react";
import CreateAiIcon from "@/assets/createAiIcon.svg?react";
import ActiveAssementIcon from "@/assets/activeAssesment.svg?react";
import InvitationSentIcon from "@/assets/invitationSent.svg?react";
import TotalCandidatesIcon from "@/assets/totalCandidatesIcon.svg?react";
import CompletionRateIcon from "@/assets/completionRate.svg?react";
import DotsIcon from "@/assets/dots.svg?react";
import EditIcon from "@/assets/editIcon.svg?react";
import PreviewIcon from "@/assets/previewIcon.svg?react";
import DuplicateIcon from "@/assets/duplicateIcon.svg?react";
import ShareIcon from "@/assets/shareIcon.svg?react";
import SettingsIcon from "@/assets/settingsIcon.svg?react";
import TrashIcon from "@/assets/trashIcon.svg?react";
import { Eye, Trash2 } from "lucide-react";
import { ROUTES } from "../../../lib/routes";
import StatCard from "@/components/ui/cards/stat-card";
import Section from "@/components/common/Section";
import {
  useInfiniteAssessmentPages,
  useAssessmentsSummary,
} from "@/api/assessments/assessment";
import { DEFAULT_LIST_API_PARAMS } from "@/lib/constants";
import AssessmentCard from "@/components/ui/cards/assessment-card";
import { useEnums } from "@/context/EnumsContext";
import PaginatedScroll from "@/components/common/PaginatedScroll";
import SearchInput from "@/components/shared/debounceSearch/SearchInput";
import { debounce } from "@/lib/utils";
import Dropdown from "@/components/ui/dropdown";
import { useUsers } from "@/api/users/users";
import UserAvatarBadge from "@/components/common/UserAvatarBadge";

const Assesment = () => {
  const { resolveEnum } = useEnums();
  const { data: users } = useUsers();
  const [searchParams, setSearchParams] = useState({
    ...DEFAULT_LIST_API_PARAMS,
  });
  const pageSize = DEFAULT_LIST_API_PARAMS.page_size;
  const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } =
    useInfiniteAssessmentPages({ ...searchParams, page_size: pageSize });
  const { data: summary } = useAssessmentsSummary();

  const assessments = data ? data.pages.flatMap((page) => page.results) : [];
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const navigate = useNavigate();

  // Placeholder handlers for linter
  const handleEdit = () => {};
  const removeAssesment = () => {};

  // Infinite scroll handler for PaginatedScroll
  const handleNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const handleSearch = debounce((value) => {
    setSearchParams({ ...searchParams, search: value });
  });

  const options = [
    {
      title: "Active Assessments",
      total: summary?.active_assessments || 0,
      icon: ActiveAssementIcon,
      iconBgColor: "bg-[rgba(0,119,194,0.2)]",
    },
    {
      title: "Invitations Sent",
      total: summary?.invites_sent || 0,
      icon: InvitationSentIcon,
      iconBgColor: "bg-[rgba(139,92,246,0.2)]",
    },
    {
      title: "Total Candidates",
      total: summary?.total_candidates || 0,
      icon: TotalCandidatesIcon,
      iconBgColor: "bg-[rgba(230,131,53,0.2)]",
    },
    {
      title: "Overall Completion Rate",
      total: (summary?.completion_rate || 0) * 100 + "%",
      icon: CompletionRateIcon,
      iconBgColor: "bg-[rgba(139,92,246,0.2)]",
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-greyPrimary">Assesments</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            className="p-3 flex items-center gap-2 rounded-2xl group"
            onClick={() =>
              navigate(ROUTES.ASSESSMENT_CREATE.replace(":stepId", "1"))
            }
          >
            <div className="h-6 w-6 rounded-full bg-white grid place-content-center">
              <PlusIcon className="text-purplePrimary" />
            </div>
            <span className="text-base font-semibold text-white">
              Create Assesment
            </span>
          </Button>
          <Button
            variant="secondary"
            className="p-3 flex items-center gap-2 rounded-2xl"
          >
            <div className="h-6 w-6 rounded-full grid place-content-center">
              <CreateAiIcon />
            </div>
            <span className="text-base font-semibold">Create using AI</span>
          </Button>
        </div>
      </div>

      {/* flex counter */}
      <Section className="flex flex-row gap-5 w-full justify-center">
        {options.map((option, index) => (
          <StatCard
            key={index}
            stat={option.total}
            label={option.title}
            Icon={option.icon}
            className="w-full"
            iconBgColor={option.iconBgColor}
          />
        ))}
      </Section>
      {/* search Filter & asssesments section */}
      <Section className="flex flex-col gap-6">
        {/* search */}
        <Section className="flex flex-row items-center justify-between bg-white">
          <SearchInput
            placeholder="Search for Assessments"
            onChange={handleSearch}
          />
          <div className="flex flex-row gap-3">
            <Dropdown
              name="Status"
              multiselect
              showSelectAll
              options={[
                {
                  display: "Published",
                  value: resolveEnum("AssessmentStatus.PUBLISHED"),
                },
                {
                  display: "Draft",
                  value: resolveEnum("AssessmentStatus.DRAFT"),
                },
                {
                  display: "Scheduled",
                  value: resolveEnum("AssessmentStatus.SCHEDULED"),
                },
                {
                  display: "Archived",
                  value: resolveEnum("AssessmentStatus.ENDED"),
                },
              ]}
              currentValue={searchParams.status__in}
              onChange={(val) =>
                setSearchParams((prev) => {
                  const next = { ...prev };
                  if (val == null) {
                    delete next.status__in;
                  } else {
                    next.status__in = val;
                  }
                  return next;
                })
              }
            />

            <Dropdown
              name="Owner"
              multiselect
              showSelectAll
              options={[
                ...(users || []).map((user) => ({
                  display: user.username,
                  value: user.id,
                  user,
                })),
              ]}
              currentValue={searchParams.created_by__in || []}
              onChange={(val) =>
                setSearchParams((prev) => {
                  const next = { ...prev };
                  if (
                    val === null ||
                    (Array.isArray(val) && val.includes(null))
                  ) {
                    delete next.created_by__in;
                  } else {
                    next.created_by__in = val;
                  }
                  return next;
                })
              }
              renderOption={({ user, display, isDefault }) =>
                isDefault ? (
                  display
                ) : (
                  <UserAvatarBadge
                    user={user}
                    className="gap-3 py-2"
                    iconClassName="w-10 h-10"
                    showEmail
                  />
                )
              }
            />
          </div>
        </Section>
        {/* Assessments Card  */}
        <PaginatedScroll
          currentPage={data?.pages.length || 1}
          totalCount={data?.pages[0]?.count || 0}
          pageSize={pageSize}
          onNextPage={handleNextPage}
          loading={isFetchingNextPage || isLoading}
          useWindowScroll
        >
          <div className="assesment-grid">
            <AnimatePresence>
              {assessments.map((assesment) => {
                // Status color logic for EntityCard
                const statusMap = {
                  [resolveEnum("AssessmentStatus.PUBLISHED")]: {
                    bg: "bg-[#DDF3E3]",
                    dot: "bg-[#008D0A]",
                    text: "text-[#008D0A]",
                    label: "Published",
                  },
                  [resolveEnum("AssessmentStatus.ENDED")]: {
                    bg: "bg-[#FBDDDD]",
                    dot: "bg-[#EB5757]",
                    text: "text-[#EB5757]",
                    label: "Archived",
                  },
                  [resolveEnum("AssessmentStatus.DRAFT")]: {
                    bg: "bg-[#FFE2CB]",
                    dot: "bg-[#E68335]",
                    text: "text-[#E68335]",
                    label: "Draft",
                  },
                  [resolveEnum("AssessmentStatus.SCHEDULED")]: {
                    bg: "bg-[#97cff7]",
                    dot: "bg-[#0077C2]",
                    text: "text-[#0077C2]",
                    label: "Scheduled",
                  },
                };
                const statusObj = statusMap[assesment.status] || {
                  bg: "bg-gray-200",
                  dot: "bg-gray-400",
                  text: "text-gray-600",
                  label: "Unknown",
                };

                // Title
                const title = assesment.name || "Untitled Assessment";
                // Owner (first moderator username or fallback)

                // Expires (end_date or fallback)
                const expires = assesment.end_date
                  ? new Date(assesment.end_date).toLocaleDateString()
                  : "N/A";
                // Tags (from first test_details.tags or empty)
                const tags = assesment.test_details?.[0]?.tags || [];
                // Candidates (dummy value, as not present)
                const candidates = assesment.total_candidates || 0;

                // Popover menu config (unchanged)
                const popoverMenu = [
                  {
                    icon: (
                      <EditIcon className="text-greyAccent group-hover:text-purplePrimary" />
                    ),
                    label: "Edit",
                    color: "text-greyAccent",
                    hover: "group-hover:text-purplePrimary",
                    key: "edit",
                    rounded: "rounded-tl-2xl rounded-tr-2xl",
                    onClick: () => {
                      handleEdit?.(assesment.id);
                      setOpenPopoverIndex(null);
                    },
                  },
                  {
                    icon: (
                      <Eye className="w-4 h-4 text-greyAccent group-hover:text-purplePrimary" />
                    ),
                    label: "Preview",
                    color: "text-greyAccent",
                    hover: "group-hover:text-purplePrimary",
                    key: "preview",
                    onClick: () => setOpenPopoverIndex(null),
                  },
                  {
                    icon: (
                      <ShareIcon className="text-greyAccent group-hover:text-purplePrimary" />
                    ),
                    label: "Share Preview Link",
                    color: "text-greyAccent",
                    hover: "group-hover:text-purplePrimary",
                    key: "share",
                    onClick: () => setOpenPopoverIndex(null),
                  },
                  {
                    icon: (
                      <InvitationSentIcon className="text-greyAccent group-hover:text-purplePrimary" />
                    ),
                    label: "Invite Candidates",
                    color: "text-greyAccent",
                    hover: "group-hover:text-purplePrimary",
                    key: "invite",
                    onClick: () => setOpenPopoverIndex(null),
                  },
                  {
                    icon: (
                      <DuplicateIcon className="text-greyAccent group-hover:text-purplePrimary" />
                    ),
                    label: "Duplicate",
                    color: "text-greyAccent",
                    hover: "group-hover:text-purplePrimary",
                    key: "duplicate",
                    onClick: () => setOpenPopoverIndex(null),
                  },
                  {
                    icon: (
                      <SettingsIcon className="text-greyAccent group-hover:text-purplePrimary" />
                    ),
                    label: "Settings",
                    color: "text-greyAccent",
                    hover: "group-hover:text-purplePrimary",
                    key: "settings",
                    onClick: () => setOpenPopoverIndex(null),
                  },
                  {
                    icon: (
                      <Trash2 className="w-5 h-5 text-greyAccent group-hover:text-[#EB5757]" />
                    ),
                    label: "Delete Assessment",
                    color: "text-greyAccent",
                    hover: "group-hover:text-[#EB5757]",
                    key: "delete",
                    rounded: "rounded-bl-2xl rounded-br-2xl",
                    onClick: () => {
                      removeAssesment?.(assesment.id);
                      setOpenPopoverIndex(null);
                    },
                  },
                ];

                return (
                  <AssessmentCard
                    key={assesment.id}
                    status={statusObj.label}
                    statusBg={statusObj.bg}
                    statusDot={statusObj.dot}
                    statusText={statusObj.text}
                    title={title}
                    owner={
                      assesment.created_by_details ||
                      assesment.moderator_details?.[0]
                    }
                    expires={expires}
                    tags={tags}
                    candidates={candidates}
                    candidatesIcon={TotalCandidatesIcon}
                    popoverMenu={popoverMenu}
                    popoverOpen={openPopoverIndex === assesment.id}
                    onPopoverOpenChange={(open) =>
                      setOpenPopoverIndex(open ? assesment.id : null)
                    }
                    popoverTrigger={
                      <button className="h-[28px] w-[28px] grid place-content-center rounded-full bg-backgroundPrimary">
                        <DotsIcon />
                      </button>
                    }
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </PaginatedScroll>
      </Section>
    </section>
  );
};

export default Assesment;
