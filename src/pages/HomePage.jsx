import React, { useEffect, useState } from 'react';
import avatar1 from '/avatar1.svg';
import avatar2 from '/avatar2.svg';
import avatar3 from '/avatar3.svg';
import avatar4 from '/avatar4.svg';
import avatar5 from '/avatar5.svg';
import avatar6 from '/avatar6.svg';
import avatar7 from '/avatar7.svg';
import avatar8 from '/avatar8.svg';
import avatar9 from '/avatar9.svg';
import plusIcon from '/plusIcon.svg';
import { motion, AnimatePresence } from 'framer-motion';
import HomePageModal from '@/components/HomePageModal';
import RichText from '@/components/RichText';
import VideoRecorder from '@/components/common/VideoRecorder';

const HomePage = () => {
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        //throw error if no user found in local storage
        //parse userdata string to json
        const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        if (!user) {
            console.error('No user found in local storage');
            // Optionally redirect or show a message

        }
        setUserFirstName(user?.first_name || '');
        setUserLastName(user?.last_name || '');
        console.table(user)
    }, [localStorage, sessionStorage]);

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
    // Use exact proportions from Figma: outer=1222px, middle=948px, inner=680px at 1440px width
    const calculateResponsiveSize = () => {
        // Calculate base size from viewport width with a reference design width of 1440px
        const designWidth = 1400;
        const outerCircleBaseSize = 1200; // Outer circle size at 1440px

        // Calculate scale factor, with minimum scale to prevent circles from getting too small
        let scaleFactor;
        if (windowSize.width >= 768) {
            // Above 768px, scale proportionally to viewport width
            scaleFactor = Math.min(0.8, windowSize.width / designWidth);
        } else {
            // Below 768px, maintain minimum size (70% of design size at 768px)
            const minScale = 0.7 * (768 / designWidth);
            scaleFactor = Math.max(minScale, windowSize.width / designWidth);
        }

        // Calculate circle sizes using exact Figma proportions
        const outerSize = outerCircleBaseSize * scaleFactor;

        return {
            outer: {
                width: outerSize,
                height: outerSize,
            },
            middle: {
                // Middle circle is 948/1222 ≈ 0.776 of outer circle
                width: outerSize * (950 / 1200),
                height: outerSize * (950 / 1200),
            },
            inner: {
                // Inner circle is 680/1222 ≈ 0.557 of outer circle
                width: outerSize * (720 / 1200),
                height: outerSize * (720 / 1200),
            }
        };
    };

    const circleStyles = calculateResponsiveSize();

    // Calculate avatar sizes based on viewport width
    const getAvatarSize = (baseSize) => {
        if (windowSize.width >= 1440) {
            return baseSize;
        } else if (windowSize.width >= 768) {
            // For screens between 768px and 1440px, scale proportionally
            const scale = windowSize.width / 1440;
            return baseSize === 80 ? baseSize * scale : Math.max(baseSize * scale, baseSize * 0.8);
        } else {
            // For screens below 768px
            // Larger avatars (80px) scale down more
            if (baseSize === 80) {
                return Math.max(baseSize * 0.6, 48); // Minimum size of 48px for larger avatars
            }
            // Smaller avatars (40px) scale down less
            return Math.max(baseSize * 0.8, 32); // Minimum size of 32px for smaller avatars
        }
    };

    // --- Static positions for middle circle ---
    const middlePositions = [
        { style: { width: getAvatarSize(80), height: getAvatarSize(80), top: '10%', right: '9%', borderRadius: '50%', zIndex: 19 } },
        { style: { width: getAvatarSize(80), height: getAvatarSize(80), top: '46%', right: '-11%', transform: 'translateX(-50%)', borderRadius: '50%', zIndex: 19 } },
        { style: { width: getAvatarSize(80), height: getAvatarSize(80), top: '50%', left: '-5%', borderRadius: '50%', zIndex: 19 } },
        { style: { width: getAvatarSize(80), height: getAvatarSize(88), top: '7%', left: '13%', borderRadius: '50%', zIndex: 19 } }
    ];

    // --- Static positions for inner circle ---
    const innerPositions = [
        { style: { width: getAvatarSize(40), height: getAvatarSize(40), left: '47%', top: '0px', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: getAvatarSize(40), height: getAvatarSize(40), right: '2%', bottom: '21%', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: getAvatarSize(80), height: getAvatarSize(80), right: '10%', top: '88%', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: getAvatarSize(80), height: getAvatarSize(80), left: '15%', top: '90%', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: getAvatarSize(40), height: getAvatarSize(40), top: '27%', left: '4%', transform: 'translateX(-50%)', borderRadius: '50%', zIndex: 20 } }
    ];

    // --- Avatar images for swapping ---
    const [middleImages, setMiddleImages] = useState([avatar6, avatar7, avatar8, avatar9]);
    const [innerImages, setInnerImages] = useState([avatar1, avatar2, avatar3, avatar4, avatar5]);
    // For triggering fade out/in
    const [swapKey, setSwapKey] = useState(0);

    // --- Swapping logic ---
    useEffect(() => {
        const interval = setInterval(() => {
            setMiddleImages(prev => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
            setInnerImages(prev => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
            setSwapKey(k => k + 1); // trigger AnimatePresence
        }, 2000); // every 2 seconds
        return () => clearInterval(interval);
    }, []);

    // Animation variants
    const fadeVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    };

    return (

        <div className="relative min-h-screen">
            <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 px-4">
                <div className="relative flex items-center justify-center">
                    {/* Outermost circle */}
                    <div
                        className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
                        style={{
                            width: `${circleStyles.outer.width}px`,
                            height: `${circleStyles.outer.height}px`,
                            maxWidth: '1222px', // Exact size from Figma
                            maxHeight: '1222px',
                        }}
                    />

                    {/* Middle circle */}
                    <div
                        className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
                        style={{
                            width: `${circleStyles.middle.width}px`,
                            height: `${circleStyles.middle.height}px`,
                            maxWidth: '948px', // Exact size from Figma
                            maxHeight: '948px',
                        }}
                    >
                        <AnimatePresence initial={true}>
                            {middlePositions.map((pos, i) => (
                                <motion.img
                                    key={middleImages[i] + swapKey} // unique key for fade
                                    src={middleImages[i]}
                                    alt={`Middle Avatar ${i}`}
                                    className="absolute"
                                    style={pos.style}
                                    variants={fadeVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5, delay: 0.3 + (i * 0.2) }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Inner circle */}
                    <div
                        className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
                        style={{
                            width: `${circleStyles.inner.width}px`,
                            height: `${circleStyles.inner.height}px`,
                            maxWidth: '680px', // Exact size from Figma
                            maxHeight: '680px',
                        }}
                    >
                        <AnimatePresence initial={true}>
                            {innerPositions.map((pos, i) => (
                                <motion.img
                                    key={innerImages[i] + swapKey} // unique key for fade
                                    src={innerImages[i]}
                                    alt={`Inner Avatar ${i}`}
                                    className="absolute"
                                    style={pos.style}
                                    variants={fadeVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5, delay: 0.5 + (i * 0.15) }}
                                />
                            ))}
                        </AnimatePresence>

                        {/* Center content */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center w-full max-w-2xl px-4"
                            style={{ transform: 'translate(-50%, -50%)', zIndex: 10 }}
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
                                className="text-[clamp(1.8rem,_-2.3929rem_+_8.7351vw,_3.5rem)] font-extrabold mb-6 text-center leading-tight">
                                Welcome {userFirstName}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
                                className="text-[clamp(0.8333rem,_0.6429rem_+_0.3968vw,_1rem)] md:max-w-[460px] text-gray-600 text-center max-w-2xl font-normal">
                                Hire Beyond Resumes With AI Precision & Blockchain Trust
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
                                className="flex items-center justify-center gap-2 md:my-6 lg:my-10">
                                <span className="text-base text-black font-medium">Already a Pro?</span>
                                <a href="#" className="text-bases text-[#0084FF] hover:underline">
                                    Skip the walkthrough
                                </a>
                            </motion.div>
                            <motion.button
                                onClick={() => setShowModal(true)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
                                className="md:max-w-[280px] lg:max-w-[317px] lg:max-h-[72px] bg-gradient-custom text-white p-4 rounded-full md:text-sm lg:text-base font-bold shadow-lg flex items-center gap-2 transition-all duration-200 hover:opacity-90">
                                <img src={plusIcon} alt="plusIcon" className='md:h-6 md:w-6 lg:h-10 lg:w-10' />
                                Create Your First Assessment
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div >

            {/* Modal Overlay */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    >
                        <div className="relative">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute -top-12 right-0 text-white hover:text-gray-200 text-2xl z-50"
                            >
                                ×
                            </button>
                            <HomePageModal onClose={() => setShowModal(false)} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    )
}

export default HomePage;


