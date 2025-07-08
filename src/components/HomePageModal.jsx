import React, { useState, useRef, useEffect, useMemo } from "react";
import codingIcon from "/codingIcon.svg";
import bulbIcon from "/bulbIcon.svg";
import breifcaseIcon from "/breifcaseIcon.svg";
import bottomBg from "/bottomBackground.svg";
import rocketIcon from "/rocketIcon.svg";
import arrowIcon from "/arrowIcon.svg";
import userIcon from "/userIcon.svg";
import terminalIcon from "/terminalIcon.svg";
import { Button } from "./ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEnums } from "@/context/EnumsContext";
import { surveyAPI } from "@/api/onboarding/survey";
import { useQuery } from "@tanstack/react-query";

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
  const { config, setConfig } = useState(null);
  useEffect(() => {
    surveyAPI.getOnboardingConfig().then((data) => setConfig(data));
  }, []);

  const { page, setPage } = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentStep, setCurrentStep] = useState("test");
  const [direction, setDirection] = useState(0);
  const modalRef = useRef(null);

  const SURVEY_PAGES = useMemo(() => {
    const pages = {
      test: {
        title: "Which kind of test fits your #hiring flow?",
        subtitle:
          "These answers help Scoutabl shape an experience that fits you like a tailored suit—minus the stitching",
        hint: "minus the stitching",
        options: [
          {
            id: "coding",
            title: "Coding Challenges",
            description: "Test technical chops and problem-solving",
            icon: codingIcon,
            value: resolveEnum("UserSurveyTestType.CODING_CHALLENGE"),
          },
          {
            id: "soft",
            title: "Soft Skills & Personality",
            description: "Gauge communication, empathy, and traits",
            icon: bulbIcon,
            value: resolveEnum(
              "UserSurveyTestType.SOFT_SKILLS_AND_PERSONALITY"
            ),
          },
          {
            id: "business",
            title: "Business & Case Scenarios",
            description: "Assess strategic thinking and decision-making",
            icon: breifcaseIcon,
            value: resolveEnum("UserSurveyTestType.BUSINESS_CASE_SCENARIOS"),
          },
        ],
      },
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
            icon: rocketIcon,
            value: resolveEnum("UserSurveyRole.HIRING_MANAGER"),
          },
          {
            id: "tech-recruiter",
            title: "Tech Recruiter / Engineering",
            description: "Building the dream team from scratch",
            icon: terminalIcon,
            value: resolveEnum("UserSurveyRole.TECH_RECRUITER"),
          },
          {
            id: "talent-acquisition",
            title: "HR / Talent Acquisition",
            description: "Streamlining recruitment and people ops",
            icon: arrowIcon,
            value: resolveEnum("UserSurveyRole.TALENT_ACQUISITION_SPECIALIST"),
          },
          {
            id: "other",
            title: "Other",
            description: "Founders looking to take charge",
            icon: rocketIcon,
            value: resolveEnum("UserSurveyRole.OTHER"),
          },
        ],
      },
    };
    console.debug("pages", pages, "enumsLoading", enumsLoading);
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
    if (selectedOption) {
      setDirection(1);
      setCurrentStep("role");
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep("test");
  };

  const handleRoleSelect = (roleId) => {
    onClose();
  };

  const options = [
    {
      id: "coding",
      title: "Coding Challenges",
      description: "Test technical chops and problem-solving",
      icon: codingIcon,
    },
    {
      id: "soft",
      title: "Soft Skills & Personality",
      description: "Gauge communication, empathy, and traits",
      icon: bulbIcon,
    },
    {
      id: "business",
      title: "Business & Case Scenarios",
      description: "Assess strategic thinking and decision-making",
      icon: breifcaseIcon,
    },
  ];

  const roles = [
    {
      id: "founder",
      title: "Founder",
      description: "Building the dream team from scratch",
      icon: rocketIcon,
    },
    {
      id: "hiring_manager",
      title: "Hiring Manager",
      description: "Making the final calls on the talent",
      icon: arrowIcon,
    },
    {
      id: "recruiter",
      title: "Recruiter",
      description: "Streamlining recruitment and hiring",
      icon: userIcon,
    },
  ];

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, transition: { duration: 0.5 }, y: 0 },
  };

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
      <AnimatePresence mode="wait" custom={direction}>
        {currentStep === "test" ? (
          <motion.div
            key="test-content"
            custom={direction}
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
              className="flex flex-col items-center justify-center"
            >
              <motion.h2
                className="text-[32px] font-light pb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Which kind of test fits your{" "}
                <span className="bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text">
                  #hiring flow?
                </span>
              </motion.h2>
              <motion.p
                className="text-[#5C5C5C] text-sm font-medium text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                These answers help Scoutabl shape an experience that fits you
                like a tailored suit—minus the stitching
              </motion.p>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-10"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {options.map((option) => (
                <motion.div
                  key={option.id}
                  variants={itemVariants}
                  onClick={() => setSelectedOption(option.id)}
                  className={cn(
                    "h-full w-full px-[22px] py-[41px] flex flex-col items-center justify-center gap-2 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] border rounded-[16px] bg-white hover:bg-[#FAEEFF] transition-all duration-300 ease-in-out group ",
                    selectedOption === option.id
                      ? "bg-[#FAEEFF] border-[#9B71F7]"
                      : "bg-white border-black/10 hover:border-[#9B71F7]"
                  )}
                >
                  <img
                    src={option.icon}
                    alt={`${option.title} Icon`}
                    className={`w-10 h-10 pb-2 transition-colors duration-300 ${
                      selectedOption === option.id
                        ? "[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]"
                        : "group-hover:[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]"
                    }`}
                  />
                  <h3 className="text-xs font-semibold text-[#333333]">
                    {option.title}
                  </h3>
                  <span className="font-normal text-[10px] text-[#5C5C5C] text-center">
                    {option.description}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 2.5 }}
            >
              <Button
                onClick={handleNext}
                disabled={!selectedOption}
                className={`bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white rounded-full px-3 py-[6px] h-[33px] w-[83px] ${
                  !selectedOption && "opacity-50 cursor-not-allowed"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="role-content"
            custom={direction}
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
            <motion.div className="flex flex-col items-center justify-center">
              <motion.h2
                className="text-[32px] font-light pb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Which best describes your{" "}
                <span className="bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text">
                  #role
                </span>
                ?
              </motion.h2>
              <motion.p
                className="text-[#5C5C5C] text-sm font-medium text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Your role helps Scoutabl customize the experience to suit your
                needs
                <br />
                —no fine-tuning necessary.
              </motion.p>
            </motion.div>
            <motion.div
              className="flex items-center justify-between gap-10 w-full"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {roles.map((option) => (
                <motion.div
                  key={option.id}
                  variants={itemVariants}
                  onClick={() => setSelectedOption(option.id)}
                  className={cn(
                    "flex-1 min-w-[213px] px-[22px] py-[41px] flex flex-col items-center justify-center gap-2 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] border rounded-[16px] bg-white hover:bg-[#FAEEFF] transition-all duration-300 ease-in-out group ",
                    selectedOption === option.id
                      ? "bg-[#FAEEFF] border-[#9B71F7]"
                      : "bg-white border-black/10 hover:border-[#9B71F7]"
                  )}
                >
                  <img
                    src={option.icon}
                    alt={`${option.title} Icon`}
                    className={`w-10 h-10 pb-2 transition-colors duration-300 ${
                      selectedOption === option.id
                        ? "[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]"
                        : "group-hover:[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]"
                    }`}
                  />
                  <h3 className="text-xs font-semibold text-[#333333]">
                    {option.title}
                  </h3>
                  <span className="font-normal text-[10px] text-[#5C5C5C] text-center text-nowrap">
                    {option.description}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 2.5 }}
            >
              <Button
                onClick={handleBack}
                className="bg-white hover:bg-gray-50 text-[#333333] rounded-full px-3 py-[6px] h-[33px] border border-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => handleRoleSelect("default")}
                className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white rounded-full px-3 py-[6px] h-[33px] w-[83px]"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
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
