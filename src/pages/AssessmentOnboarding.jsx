import React, { useEffect, useState } from "react";
import plusIcon from "/plusIcon.svg";
import { CircleX } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import HomePageModal from "@/components/HomePageModal";
import { toast } from "sonner";
import HomePageAnimation from "@/components/HomePageAnimation";
import { motion } from "framer-motion";

const avatarVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const AssessmentOnboarding = () => {
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    //throw error if no user found in local storage
    //parse userdata string to json
    const user = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user")
    );
    if (!user) {
      // Optionally redirect or show a message
      toast.error("No user found in local storage");
      return;
    }
    setUserFirstName(user?.first_name || "");
    setUserLastName(user?.last_name || "");
    // toast.success('User found in local storage');
  }, [localStorage, sessionStorage]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen">
      <HomePageAnimation
        userFirstName={userFirstName}
        plusIcon={plusIcon}
        setShowModal={setShowModal}
      />
      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50"
              style={{ willChange: "opacity" }}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ willChange: "transform" }}
            >
              <div className="relative">
                <AnimatePresence>
                  <motion.button
                    onClick={() => setShowModal(false)}
                    className="group border-0 outline-none h-6 w-6 grid place-content-center absolute top-[10px] right-[20px] text-greyPrimary hover:text-gray-200 text-2xl z-50 rounded-full p-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                    key="modal-close-button"
                  >
                    <CircleX className="group-hover:text-destructive h-6 w-6" />
                  </motion.button>
                </AnimatePresence>
                <HomePageModal onClose={() => setShowModal(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssessmentOnboarding;
