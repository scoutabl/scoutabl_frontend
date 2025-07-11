import React, { useEffect, useState, useMemo } from 'react';
import avatar1 from '/avatar1.svg';
import avatar2 from '/avatar2.svg';
import avatar3 from '/avatar3.svg';
import avatar4 from '/avatar4.svg';
import avatar5 from '/avatar5.svg';
import avatar6 from '/avatar6.svg';
import avatar7 from '/avatar7.svg';
import avatar8 from '/avatar8.svg';
import avatar9 from '/avatar9.svg';
import { motion, AnimatePresence } from 'framer-motion';

const avatarVariants = {
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    },
    hidden: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2 }
    }
};

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay,
            duration: 0.4,
            ease: "easeOut"
        }
    })
};

const MIDDLE_AVATARS = [avatar6, avatar7, avatar8, avatar9];
const INNER_AVATARS = [avatar1, avatar2, avatar3, avatar4, avatar5];

const HomePageAnimation = React.memo(function HomePageAnimation({ userFirstName, plusIcon, setShowModal }) {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
    // Track the current offset for each ring
    const [middleOffset, setMiddleOffset] = useState(0);
    const [innerOffset, setInnerOffset] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate relative sizes based on the Figma design
    const calculateResponsiveSize = () => {
        const designWidth = 1400;
        const outerCircleBaseSize = 1200;
        let scaleFactor;
        if (windowSize.width >= 768) {
            scaleFactor = Math.min(0.8, windowSize.width / designWidth);
        } else {
            const minScale = 0.7 * (768 / designWidth);
            scaleFactor = Math.max(minScale, windowSize.width / designWidth);
        }
        const outerSize = outerCircleBaseSize * scaleFactor;
        return {
            outer: {
                width: outerSize,
                height: outerSize,
            },
            middle: {
                width: outerSize * (950 / 1200),
                height: outerSize * (950 / 1200),
            },
            inner: {
                width: outerSize * (720 / 1200),
                height: outerSize * (720 / 1200),
            }
        };
    };
    const circleStyles = useMemo(calculateResponsiveSize, [windowSize]);

    // Calculate avatar sizes based on viewport width
    const getAvatarSize = (baseSize) => {
        if (windowSize.width >= 1440) {
            return baseSize;
        } else if (windowSize.width >= 768) {
            const scale = windowSize.width / 1440;
            return baseSize === 80 ? baseSize * scale : Math.max(baseSize * scale, baseSize * 0.8);
        } else {
            if (baseSize === 80) {
                return Math.max(baseSize * 0.6, 48);
            }
            return Math.max(baseSize * 0.8, 32);
        }
    };

    // --- Static positions for middle circle ---
    const middlePositions = useMemo(() => [
        { style: { width: getAvatarSize(80), height: getAvatarSize(80), top: '10%', right: '9%', borderRadius: '50%', zIndex: 19 } },
        { style: { width: getAvatarSize(80), height: getAvatarSize(80), top: '46%', right: '-5%', transform: 'translateX(-50%)', borderRadius: '50%', zIndex: 19 } },
        { style: { width: getAvatarSize(80), height: getAvatarSize(80), top: '50%', left: '-5%', borderRadius: '50%', zIndex: 19 } },
        { style: { width: getAvatarSize(80), height: getAvatarSize(88), top: '7%', left: '13%', borderRadius: '50%', zIndex: 19 } }
    ], [windowSize]);

    // --- Static positions for inner circle ---
    const innerPositions = useMemo(() => [
        { style: { width: getAvatarSize(40), height: getAvatarSize(40), left: '47%', top: '-20px', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: getAvatarSize(40), height: getAvatarSize(40), right: '4%', bottom: '21%', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: getAvatarSize(80), height: getAvatarSize(80), right: '20%', top: '88%', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: getAvatarSize(80), height: getAvatarSize(80), left: '15%', bottom: '2%', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: getAvatarSize(40), height: getAvatarSize(40), top: '27%', left: '1%', transform: 'translateX(-50%)', borderRadius: '50%', zIndex: 20 } }
    ], [windowSize]);

    // --- Animation cycle logic ---
    useEffect(() => {
        const interval = setInterval(() => {
            setMiddleOffset((prev) => (prev + 1) % MIDDLE_AVATARS.length);
            setInnerOffset((prev) => (prev + 1) % INNER_AVATARS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Helper to get the avatar index for a given position and offset
    const getAvatarIndex = (baseIdx, offset, total) => (baseIdx - offset + total) % total;

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 px-4">
            <div className="relative flex items-center justify-center">
                {/* Outermost circle */}
                <div
                    className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
                    style={{
                        width: `${circleStyles.outer.width}px`,
                        height: `${circleStyles.outer.height}px`,
                        maxWidth: '1222px',
                        maxHeight: '1222px',
                    }}
                />
                {/* Middle circle */}
                <div
                    className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
                    style={{
                        width: `${circleStyles.middle.width}px`,
                        height: `${circleStyles.middle.height}px`,
                        maxWidth: '948px',
                        maxHeight: '948px',
                    }}
                >
                    {middlePositions.map((pos, i) => (
                        MIDDLE_AVATARS.map((img, j) => {
                            const isVisible = getAvatarIndex(i, middleOffset, MIDDLE_AVATARS.length) === j;
                            return (
                                <motion.img
                                    key={`middle-${i}-${j}`}
                                    src={img}
                                    alt={`Middle Avatar ${j}`}
                                    className="absolute"
                                    style={pos.style}
                                    variants={avatarVariants}
                                    animate={isVisible ? "visible" : "hidden"}
                                    initial={false}
                                    transition={{ duration: 0.5 }}
                                />
                            );
                        })
                    ))}
                </div>
                {/* Inner circle */}
                <div
                    className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible flex items-center justify-center"
                    style={{
                        width: `${circleStyles.inner.width}px`,
                        height: `${circleStyles.inner.height}px`,
                        maxWidth: '680px',
                        maxHeight: '680px',
                    }}
                >
                    {innerPositions.map((pos, i) => (
                        INNER_AVATARS.map((img, j) => {
                            const isVisible = getAvatarIndex(i, innerOffset, INNER_AVATARS.length) === j;
                            return (
                                <motion.img
                                    key={`inner-${i}-${j}`}
                                    src={img}
                                    alt={`Inner Avatar ${j}`}
                                    className="absolute"
                                    style={pos.style}
                                    variants={avatarVariants}
                                    animate={isVisible ? "visible" : "hidden"}
                                    initial={false}
                                    transition={{ duration: 0.5 }}
                                />
                            );
                        })
                    ))}
                    {/* Center content */}
                    <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="relative flex flex-col items-center justify-center w-full px-4"
                    >
                        <motion.h1
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            delay={0.1}
                            className="text-[clamp(2rem,_4vw,_3rem)] font-extrabold mb-6 text-center leading-tight">
                            Welcome {userFirstName}
                        </motion.h1>
                        <motion.p
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            delay={0.2}
                            className="text-[clamp(0.8333rem,_0.6429rem_+_0.3968vw,_1rem)] md:max-w-[460px] text-gray-600 text-center max-w-2xl font-normal">
                            Hire Beyond Resumes With AI Precision & Blockchain Trust
                        </motion.p>
                        <motion.div
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            delay={0.3}
                            className="flex items-center justify-center gap-2 md:my-6 lg:my-10">
                            <span className="text-base text-black font-medium">Already a Pro?</span>
                            <a href="#" className="text-bases text-[#0084FF] hover:underline">
                                Skip the walkthrough
                            </a>
                        </motion.div>
                        <motion.button
                            onClick={() => setShowModal(true)}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            delay={0.4}
                            className="md:max-w-[280px] lg:max-w-[317px] lg:max-h-[72px] bg-gradient-custom text-white p-4 rounded-full md:text-sm lg:text-base font-bold shadow-lg flex items-center gap-2 transition-all duration-200 hover:opacity-90">
                            <img src={plusIcon} alt="plusIcon" className='md:h-6 md:w-6 lg:h-10 lg:w-10' />
                            Create Your First Assessment
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
});

export default HomePageAnimation; 