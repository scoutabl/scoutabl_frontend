import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import bottomBg from "/bottomBackground.svg";
import { Button } from "./ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useEnums } from "@/context/EnumsContext";
import { surveyAPI } from "@/api/onboarding/survey";
import Card from "./ui/card";
import HorizontalCard from "./ui/horizontal-card";
import CodingIcon from '../../public/codingIcon.svg?react';
import BulbIcon from '../../public/bulbIcon.svg?react';
import BreifcaseIcon from '../../public/breifcaseIcon.svg?react';
import RocketIcon from '../../public/rocketIcon.svg?react';
import ArrowIcon from '../../public/arrowIcon.svg?react';
import TerminalIcon from '../../public/terminalIcon.svg?react';

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

const HomePageModal = ({ onClose }) => {
  const { resolveEnum, enumsLoading } = useEnums();
  const [page, setPage] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    surveyAPI.getOrCreateOnboardingConfig().then((config) => {
      setPage(config.extra.assessmentOnboarding.page);
    });
  }, []);

  const SURVEY_PAGES = useMemo(() => {
    const pages = {
      // test: {
      //   title: "Which kind of test fits your #hiring flow?",
      //   subtitle:
      //     "These answers help Scoutabl shape an experience that fits you like a tailored suit",
      //   hint: "minus the stitching",
      //   options: [
      //     {
      //       id: "coding",
      //       title: "Coding Challenges",
      //       description: "Test technical chops and problem-solving",
      //       Icon: CodingIcon,
      //       value: resolveEnum("UserSurveyTestType.CODING_CHALLENGE"),
      //     },
      //     {
      //       id: "soft",
      //       title: "Soft Skills & Personality",
      //       description: "Gauge communication, empathy, and traits",
      //       Icon: BulbIcon,
      //       value: resolveEnum(
      //         "UserSurveyTestType.SOFT_SKILLS_AND_PERSONALITY"
      //       ),
      //     },
      //     {
      //       id: "business",
      //       title: "Business & Case Scenarios",
      //       description: "Assess strategic thinking and decision-making",
      //       Icon: BreifcaseIcon,
      //       value: resolveEnum("UserSurveyTestType.BUSINESS_CASE_SCENARIOS"),
      //     },
      //   ],
        
      // },
      role: {
        title: "Which best describes your #role?",
        subtitle:
          "Your role helps Scoutabl customize the experience to suit your needs —no fine-tuning necessary.",
        hint: "no fine-tuning necessary.",
        options: [
          {
            id: "hiring-manager",
            title: "Hiring Manager / Team Lead",
            description: "Making the final calls on top talent",
            Icon: RocketIcon,
            value: resolveEnum("UserSurveyRole.HIRING_MANAGER"),
          },
          {
            id: "tech-recruiter",
            title: "Tech Recruiter / Engineering",
            description: "Building the dream team from scratch",
            Icon: TerminalIcon,
            value: resolveEnum("UserSurveyRole.TECH_RECRUITER"),
          },
          {
            id: "talent-acquisition",
            title: "HR / Talent Acquisition",
            description: "Streamlining recruitment and people ops",
            Icon: ArrowIcon,
            value: resolveEnum("UserSurveyRole.TALENT_ACQUISITION_SPECIALIST"),
          },
          {
            id: "other",
            title: "Other",
            description: "Founders looking to take charge",
            Icon: RocketIcon,
            value: resolveEnum("UserSurveyRole.OTHER"),
          },
        ],
      },
    };
    return pages;
  }, [enumsLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleNext = () => {
    // if (selectedOption) {
    //   setDirection(1);
    //   setCurrentStep("role");
    // }
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
  const nextDisabled = selectedOptions.length === 0;
  const showHorizontalCard = renderPage && renderPage.options.length > 3;

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
            <motion.div
              className={showHorizontalCard ? "flex flex-wrap gap-6 justify-center items-center z-10" : "flex flex-row items-center justify-between gap-10 z-10"}
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
                          fill={selectedOptions.includes(option.value) ? "#8B5CF6" : undefined}
                          stroke={selectedOptions.includes(option.value) ? "#8B5CF6" : undefined}
                        />
                      )}
                      selected={selectedOptions.includes(option.value)}
                      onClick={() => {
                        if (selectedOptions.includes(option.value)) {
                          setSelectedOptions(
                            selectedOptions.filter((value) => value !== option.value)
                          );
                        } else {
                          setSelectedOptions([...selectedOptions, option.value]);
                        }
                      }}
                    />
                  ))
                : renderPage.options.reduce((rows, option, idx) => {
                    if (idx % 2 === 0) rows.push([option]);
                    else rows[rows.length - 1].push(option);
                    return rows;
                  }, []).map((row, rowIdx) => (
                    <div key={rowIdx} className="flex flex-row justify-center gap-6 w-full mb-4 mx-10">
                      {row.map((option) => (
                        <HorizontalCard
                          key={option.id}
                          title={option.title}
                          description={option.description}
                          Icon={(props) => (
                            <option.Icon
                              {...props}
                              fill={selectedOptions.includes(option.value) ? "#8B5CF6" : undefined}
                              stroke={selectedOptions.includes(option.value) ? "#8B5CF6" : undefined}
                            />
                          )}
                          selected={selectedOptions.includes(option.value)}
                          onClick={() => {
                            if (selectedOptions.includes(option.value)) {
                              setSelectedOptions(
                                selectedOptions.filter((value) => value !== option.value)
                              );
                            } else {
                              setSelectedOptions([...selectedOptions, option.value]);
                            }
                          }}
                        />
                      ))}
                    </div>
                  ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Button
                onClick={handleNext}
                disabled={nextDisabled}
                className={`bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white rounded-full px-3 py-[6px] h-[33px] w-[83px] ${
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
