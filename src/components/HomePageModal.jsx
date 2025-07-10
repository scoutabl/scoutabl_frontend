import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import bottomBg from "/bottomBackground.svg";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ChevronRight, ChevronLeft, Info } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useEnums } from "@/context/EnumsContext";
import { surveyAPI } from "@/api/onboarding/survey";
import Card from "./ui/card";
import { SCOUTABL_PURPLE } from "@/lib/constants";
import HorizontalCard from "./ui/horizontal-card";
import BulbIcon from "@/assets/bulbIcon.svg?react";
import BreifcaseIcon from "@/assets/breifcaseIcon.svg?react";
import RocketIcon from "@/assets/rocketIcon.svg?react";
import ArrowIcon from "@/assets/arrowIcon.svg?react";
import TerminalIcon from "@/assets/terminalIcon.svg?react";
import InfoIcon from "@/assets/infoIcon.svg?react";
import ChatIcon from "@/assets/chatIcon.svg?react";
import FlagIcon from "@/assets/flagIcon.svg?react";
import LayersIcon from "@/assets/layersIcon.svg?react";
import CodeIcon from "@/assets/codeIcon.svg?react";
import DoubleCheckIcon from "@/assets/doubleCheckIcon.svg?react";
import CirclesIcon from "@/assets/circlesIcon.svg?react";
import CommunityIcon from "@/assets/communityIcon.svg?react";
import UserIcon from "@/assets/userIcon.svg?react";

const modalVariants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

// Pages
const TEST = "test";
const ROLE = "role";
const CAPABILITY = "capability";
const SKILLS = "skills";
const PRIORITOES = "priorities";
const GOALS = "goals";
const LAUNCH = "launch";

// Page types
const CHOICE_PAGE = "choice";
const TEXT_FEEDBACK = "text-feedback";
const CTA = "cta";

const HomePageModal = ({ onClose }) => {
  const { resolveEnum, enumsLoading } = useEnums();
  const [config, setConfig] = useState(null);
  const [userSurvey, setUserSurvey] = useState(null);
  const [page, setPage] = useState(null);
  const [selectedOptionValues, setSelectedOptionValues] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    surveyAPI.getOrCreateOnboardingConfig(ROLE).then((config) => {
      setPage(config.extra?.assessmentOnboarding?.page || ROLE);
      setConfig(config);
      setSelectedOptionValues([]);
    });
    
    surveyAPI.getOrCreateUserSurvey().then((survey) => {
      setUserSurvey(survey);
    });
  }, []);

  useEffect(() => {
    async function getAssessmentRecommendation() {
      if (page === LAUNCH) {
        // TODO: Implement launch page cards and handlers.
        const updatedConfig = await surveyAPI.getAssessmentRecommendation();
        setConfig(updatedConfig);
      }
    }
    getAssessmentRecommendation();
  }, [page])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  
  const SURVEY_PAGES = useMemo(() => {
    const pages = {
      [ROLE]: {
        title: "Which best describes your #role?",
        subtitle:
          "Your role helps Scoutabl customize the experience to suit your needs —no fine-tuning necessary.",
        hint: "no fine-tuning necessary.",
        pageType: CHOICE_PAGE,
        field: "roles",
        multiselect: false,
        disableBack: true,
        options: [
          {
            id: "hiring-manager",
            title: "Hiring Manager / Team Lead",
            description: "Making the final calls on top talent",
            Icon: UserIcon,
            value: resolveEnum("UserSurveyRole.HIRING_MANAGER"),
            nextPage: CAPABILITY,
          },
          {
            id: "tech-recruiter",
            title: "Tech Recruiter / Engineering",
            description: "Building the dream team from scratch",
            Icon: TerminalIcon,
            value: resolveEnum("UserSurveyRole.TECH_RECRUITER"),
            nextPage: SKILLS,
          },
          {
            id: "talent-acquisition",
            title: "HR / Talent Acquisition",
            description: "Streamlining recruitment and people ops",
            Icon: ArrowIcon,
            value: resolveEnum("UserSurveyRole.TALENT_ACQUISITION_SPECIALIST"),
            nextPage: PRIORITOES,
          },
          {
            id: "other",
            title: "Other",
            description: "Founders looking to take charge",
            Icon: RocketIcon,
            value: resolveEnum("UserSurveyRole.OTHER"),
            nextPage: GOALS,
          },
        ],
      },
      [CAPABILITY]: {
        title: "What capability do you want to #evaluate?",
        subtitle:
          "These answers help Scoutabl shape an experience that fits you like a tailored suit",
        hint: "minus the stitching",
        pageType: CHOICE_PAGE,
        field: "capabilities",
        multiselect: true,
        nextPage: LAUNCH,
        prevPage: ROLE,
        options: [
          {
            id: "decision-making",
            title: "Decision Making",
            description: "Measure judgment to empower better outcomes",
            Icon: CirclesIcon,
            value: resolveEnum("UserSurveyCapability.DECISION_MAKING"),
          },
          {
            id: "conflict-resolution",
            title: "Conflict Resolution",
            description:
              "Measure ability to resolve tension & strengthen team dynamics",
            Icon: ChatIcon,
            value: resolveEnum("UserSurveyCapability.CONFLICT_RESOLUTION"),
          },
          {
            id: "leadership",
            title: "Leadership",
            description: "Evaluate real leaders with measurable impact",
            Icon: FlagIcon,
            value: resolveEnum("UserSurveyCapability.LEADERSHIP"),
          },
        ],
      },
      [SKILLS]: {
        title: "What matter most to you in #skills?",
        subtitle:
          "These answers help Scoutabl shape an experience that fits you like a tailored suit",
        hint: "minus the stitching",
        pageType: CHOICE_PAGE,
        field: "skills_technical",
        multiselect: true,
        nextPage: LAUNCH,
        prevPage: ROLE,
        options: [
          {
            id: "dsa",
            title: "Data Structures & Algorithms",
            description:
              "Assess talent through intelligent algorithmic insights",
            Icon: LayersIcon,
            value: resolveEnum("UserSurveyTechnicalSkill.DSA"),
          },
          {
            id: "code-quality",
            title: "Code Quality",
            description: "Hire developers who write clean & organized code",
            Icon: CodeIcon,
            value: resolveEnum("UserSurveyTechnicalSkill.CODE_QUALITY"),
          },
          {
            id: "code-exec",
            title: "Code Execution",
            description:
              "Test executional capabilities that deliver excellence",
            Icon: DoubleCheckIcon,
            value: resolveEnum("UserSurveyTechnicalSkill.CODE_EXECUTION"),
          },
        ],
      },
      [PRIORITOES]: {
        title: "Which tests are typically your top #priorities?",
        subtitle:
          "These answers help Scoutabl shape an experience that fits you like a tailored suit",
        hint: "minus the stitching",
        pageType: CHOICE_PAGE,
        field: "priorities",
        multiselect: true,
        nextPage: LAUNCH,
        prevPage: ROLE,
        options: [
          {
            id: "culture",
            title: "Culture & Psychometric Tests",
            description: "Culture-driven. Science-backed hiring power",
            Icon: CommunityIcon,
            value: resolveEnum(
              "UserSurveyPriorities.CULTURE_AND_PSYCHOMETRICS"
            ),
          },
          {
            id: "emotional",
            title: "Emotional Intelligence Tests",
            description: "Decode emotion. Drive team harmony",
            Icon: BulbIcon,
            value: resolveEnum("UserSurveyPriorities.EMOTIONAL_INTELLIGENCE"),
          },
          {
            id: "role-specific",
            title: "Role Specific Skills Tests",
            description: "Reduce risky bad hires. Build dream teams",
            Icon: BreifcaseIcon,
            value: resolveEnum("UserSurveyPriorities.ROLE_SPECIFIC_SKILLS"),
          },
        ],
      },
      [GOALS]: {
        title: "Tell us what you want to #achieve?",
        subtitle:
          "These answers help Scoutabl shape an experience that fits you like a tailored suit",
        hint: "minus the stitching",
        pageType: TEXT_FEEDBACK,
        field: "goals",
        nextPage: LAUNCH,
        prevPage: ROLE,
      },
      [LAUNCH]: {
        title: "Ready to launch your #assessment?",
        subtitle: "Pick the assessment that suits your hiring goals",
        hint: "You can try others anytime!",
      },
    };
    return pages;
  }, [enumsLoading]);


  const handleNext = async () => {
    setSubmitting(true);
    const nextPage =
      renderPage.options?.find(
        (option) => option.value === selectedOptionValues[0]
      )?.nextPage ||
      renderPage.nextPage ||
      null;
    const field = renderPage.field;
    const pageType = renderPage.pageType;

    let configPayload, surveyPayload;
    if (pageType === CHOICE_PAGE) {
      configPayload = {
        extra: {
          assessmentOnboarding: {
            page: nextPage,
            prevPage: page,
          },
        },
      };
      surveyPayload = {
        [field]: selectedOptionValues,
      }
    } else if (pageType === TEXT_FEEDBACK) {
      surveyPayload = {
        [field]: feedbackText,
      }
      configPayload = {
        extra: {
          assessmentOnboarding: {
            page: nextPage,
            prevPage: page,
          },
        },
      };
    }

    try {
      if (surveyPayload) {
        try {
          const survey = await surveyAPI.updateUserSurvey(userSurvey.id, surveyPayload);
          setUserSurvey(survey);
        } catch (err) {
          console.error(err);
        }
      }

      if (configPayload) {
        try {
          const updatedConfig = await surveyAPI.updateOnboardingConfig(config.id, configPayload);
          setConfig(updatedConfig);
          if (nextPage) {
            setSelectedOptionValues([]);
            setPage(nextPage);
          }
        } catch (err) {
          console.error(err);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    const prevPage =
      renderPage.prevPage || config?.extra?.assessmentOnboarding?.prevPage;
    if (!prevPage) {
      console.warn("No previous page found");
      return;
    }

    setPage(prevPage);
    setSelectedOptionValues([]);
  };

  const getSelectHandler = (option) => {
    return () => {
      if (renderPage.pageType === CHOICE_PAGE) {
        let newOptions;

        if (renderPage.multiselect) {
          if (selectedOptionValues.includes(option.value)) {
            newOptions = selectedOptionValues.filter(
              (value) => value !== option.value
            );
          } else {
            newOptions = [...selectedOptionValues, option.value];
          }
        } else {
          newOptions = [option.value];
        }

        setSelectedOptionValues(newOptions);
      }
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3,
        when: "beforeChildren",
      },
    },
  };

  const renderPage = page != null ? SURVEY_PAGES[page] : null;
  let title1, title2;
  if (renderPage) {
    [title1, title2] = renderPage.title.split("#");
  }
  const nextDisabled =
    (renderPage?.pageType === CHOICE_PAGE &&
      selectedOptionValues.length === 0) ||
    (renderPage?.pageType === TEXT_FEEDBACK && !feedbackText) ||
    submitting;
  const showHorizontalCard = renderPage && renderPage?.options?.length > 3;

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-[1139px] h-[644px] rounded-[16px] flex flex-col items-center justify-center mx-auto [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] overflow-hidden bg-white"
      ref={modalRef}
      style={{ willChange: "transform" }}
    >
      <AnimatePresence mode="wait">
        {renderPage ? (
          <motion.div
            key="test-content"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="flex flex-col items-center justify-center gap-[52px]"
          >
            <motion.div
              // initial={{ opacity: 0, y: 20 }}
              // animate={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <motion.h2
                className="text-[32px] font-light pb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {title1}
                <span className="bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text font-medium">
                  #{title2}
                </span>
              </motion.h2>
              <motion.p
                className="text-[#5C5C5C] font-normal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {renderPage.subtitle}
                <br />
                <motion.span className="italic">
                  — {renderPage.hint}
                </motion.span>
              </motion.p>
            </motion.div>
            {/* Render content based on page type */}
            {renderPage.pageType === CHOICE_PAGE ? (
              <motion.div
                className={
                  showHorizontalCard
                    ? "flex flex-wrap gap-6 justify-center items-center z-10 w-full px-15"
                    : "flex flex-row items-center justify-between gap-10 z-10 w-full px-15"
                }
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {!showHorizontalCard
                  ? renderPage.options.map((option) => (
                      <Card
                        key={option.id}
                        title={option.title}
                        description={option.description}
                        Icon={(props) => (
                          <option.Icon
                            {...props}
                            className={`${selectedOptionValues.includes(option.value) ? "text-purplePrimary" : ""}`}
                          />
                        )}
                        selected={selectedOptionValues.includes(option.value)}
                        onClick={getSelectHandler(option)}
                      />
                    ))
                  : renderPage.options
                      .reduce((rows, option, idx) => {
                        if (idx % 2 === 0) rows.push([option]);
                        else rows[rows.length - 1].push(option);
                        return rows;
                      }, [])
                      .map((row, rowIdx) => (
                        <div
                          key={rowIdx}
                          className="flex flex-row justify-center gap-6 w-full mb-4 mx-10"
                        >
                          {row.map((option) => (
                            <HorizontalCard
                              key={option.id}
                              title={option.title}
                              description={option.description}
                              Icon={(props) => (
                                <option.Icon
                                  {...props}
                                  className={`${selectedOptionValues.includes(option.value) ? "text-purplePrimary" : ""}`}
                                />
                              )}
                              selected={selectedOptionValues.includes(
                                option.value
                              )}
                              onClick={getSelectHandler(option)}
                            />
                          ))}
                        </div>
                      ))}
              </motion.div>
            ) : renderPage.pageType === TEXT_FEEDBACK ? (
              <motion.div className="w-full flex flex-col items-center justify-center z-10">
                <Textarea
                  className="w-[580px] h-[160px] border border-gray-300 rounded-lg p-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Share your hiring goals here..."
                  onChange={(e) => setFeedbackText(e.target.value)}
                  value={feedbackText}
                />
              </motion.div>
            ) : renderPage.pageType === CTA ? (
              <motion.div className="w-full flex flex-col items-center justify-center z-10">
                {/* Dummy content for CTA */}
                <div className="text-2xl font-semibold text-purple-700 mb-2">
                  Call to Action
                </div>
                <div className="text-gray-500">
                  (CTA content coming soon...)
                </div>
              </motion.div>
            ) : null}
            {renderPage.multiselect && (
              <motion.div className="flex flex-row items-center gap-2 text-sm">
                <InfoIcon />
                <motion.p className="text-purplePrimary">
                  You can select multiple options
                </motion.p>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="flex flex-row gap-5 items-center"
            >
              {(renderPage.prevPage ||
                config?.extra?.assessmentOnboarding?.prevPage) && (
                <Button
                  onClick={handleBack}
                  className={`bg-white border border-purplePrimary hover:bg-white text-purplePrimary rounded-full px-3 py-[6px] h-[33px] w-[83px]}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={nextDisabled}
                className={`bg-[${SCOUTABL_PURPLE}] hover:bg-[${SCOUTABL_PURPLE}]/90 text-white rounded-full px-3 py-[6px] h-[33px] w-[83px] ${
                  nextDisabled && "opacity-50 cursor-not-allowed"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <p>TODO: Display Loading Icon</p>
        )}
      </AnimatePresence>

      <motion.img
        src={bottomBg}
        alt="Bottom Background"
        className="absolute bottom-0 right-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          ease: "easeInOut",
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />
    </motion.div>
  );
};

export default HomePageModal;
