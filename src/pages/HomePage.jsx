// import React, { useRef, useEffect, useState } from 'react';
// import avatar1 from '/avatar1.svg';
// import avatar2 from '/avatar2.svg';
// import avatar3 from '/avatar3.svg';
// import avatar4 from '/avatar4.svg';
// import avatar5 from '/avatar5.svg';
// import avatar6 from '/avatar6.svg';
// import avatar7 from '/avatar7.svg';
// import avatar8 from '/avatar8.svg';
// import avatar9 from '/avatar9.svg';
// import plusIcon from '/plusIcon.svg';
// import { motion } from 'framer-motion';

// const HomePage = () => {
//     const [windowSize, setWindowSize] = useState({
//         width: typeof window !== 'undefined' ? window.innerWidth : 0,
//         height: typeof window !== 'undefined' ? window.innerHeight : 0,
//     });

//     useEffect(() => {
//         const handleResize = () => {
//             setWindowSize({
//                 width: window.innerWidth,
//                 height: window.innerHeight,
//             });
//         };
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     // Calculate relative sizes based on the Figma design
//     const baseSize = windowSize.width > 1440 ? 900 : (windowSize.width / 1440) * 900;
//     const circleStyles = {
//         outer: {
//             width: baseSize,
//             height: baseSize,
//             maxWidth: '900px',
//             maxHeight: '900px',
//         },
//         middle: {
//             width: baseSize * (850 / 1000),
//             height: baseSize * (850 / 1000),
//             maxWidth: '850px',
//             maxHeight: '850px',
//         },
//         inner: {
//             width: baseSize * (680 / 1000),
//             height: baseSize * (680 / 1000),
//             maxWidth: '680',
//             maxHeight: '680',
//         }
//     };

//     return (
//         <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 px-4">
//             <div className="relative flex items-center justify-center">
//                 {/* Outermost circle - 1222px */}
//                 <div
//                     className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
//                     style={{
//                         width: `${circleStyles.outer.width}px`,
//                         height: `${circleStyles.outer.height}px`,
//                         maxWidth: circleStyles.outer.maxWidth,
//                         maxHeight: circleStyles.outer.maxHeight,
//                     }}
//                 >
//                     {/* Outer circle avatars */}

//                 </div>

//                 {/* Middle circle - 948px */}
//                 <div
//                     className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
//                     style={{
//                         width: `${circleStyles.middle.width}px`,
//                         height: `${circleStyles.middle.height}px`,
//                         maxWidth: circleStyles.middle.maxWidth,
//                         maxHeight: circleStyles.middle.maxHeight,
//                     }}
//                 >
//                     <motion.img
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, ease: 'easeInOut' }}
//                         src={avatar6}
//                         alt="Avatar 6"
//                         className="absolute"
//                         style={{
//                             width: 88,
//                             height: 88,
//                             top: '10%',
//                             right: '9%',
//                             borderRadius: '50%',
//                             zIndex: 19,
//                         }}
//                     />
//                     <motion.img
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, ease: 'easeInOut' }}
//                         src={avatar7}
//                         alt="Avatar 7"
//                         className="absolute"
//                         style={{
//                             width: 88,
//                             height: 88,
//                             top: '46%',
//                             right: '-11%',
//                             transform: 'translateX(-50%)',
//                             borderRadius: '50%',
//                             zIndex: 19,
//                         }}
//                     />
//                     <motion.img
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, ease: 'easeInOut' }}
//                         src={avatar8}
//                         alt="Avatar 8"
//                         className="absolute"
//                         style={{
//                             width: 88,
//                             height: 88,
//                             top: '50%',
//                             left: '-5%',
//                             borderRadius: '50%',
//                             zIndex: 19,
//                         }}
//                     />
//                     <motion.img
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, ease: 'easeInOut' }}
//                         src={avatar9}
//                         alt="Avatar 9"
//                         className="absolute"
//                         style={{
//                             width: 88,
//                             height: 88,
//                             top: '7%',
//                             left: '13%',
//                             borderRadius: '50%',
//                             zIndex: 19,
//                         }}
//                     />
//                 </div>

//                 {/* Inner circle - 680px */}
//                 <div
//                     className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
//                     style={{
//                         width: `${circleStyles.inner.width}px`,
//                         height: `${circleStyles.inner.height}px`,
//                         maxWidth: circleStyles.inner.maxWidth,
//                         maxHeight: circleStyles.inner.maxHeight,
//                     }}
//                 >
//                     <motion.img
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, ease: 'easeInOut', }}
//                         src={avatar1}
//                         alt="Avatar 1"
//                         className="absolute"
//                         style={{
//                             width: 40,
//                             height: 40,
//                             left: '47%',
//                             top: '0px',
//                             transform: 'translateY(-50%)',
//                             borderRadius: '50%',
//                             zIndex: 20,
//                         }}
//                     />
//                     <motion.img
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, ease: 'easeInOut' }}
//                         src={avatar2}
//                         alt="Avatar 2"
//                         className="absolute"
//                         style={{
//                             width: 40,
//                             height: 40,
//                             right: '2%',
//                             bottom: '21%',
//                             transform: 'translateY(-50%)',
//                             borderRadius: '50%',
//                             border: '2px solid #fff',
//                             boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//                             background: '#E6F9ED',
//                             zIndex: 20,
//                         }}
//                     />
//                     <motion.img
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, ease: 'easeInOut' }}
//                         src={avatar3}
//                         alt="Avatar 3"
//                         className="absolute"
//                         style={{
//                             width: 80,
//                             height: 80,
//                             right: '10%',
//                             top: '88%',
//                             transform: 'translateY(-50%)',
//                             borderRadius: '50%',
//                             zIndex: 20,
//                         }}
//                     />
//                     <motion.img
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, ease: 'easeInOut' }}
//                         src={avatar4}
//                         alt="Avatar 4"
//                         className="absolute"
//                         style={{
//                             width: 80,
//                             height: 80,
//                             left: '15%',
//                             top: '90%',
//                             transform: 'translateY(-50%)',
//                             borderRadius: '50%',
//                             zIndex: 20,
//                         }}
//                     />
//                     <motion.img
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, ease: 'easeInOut' }}
//                         src={avatar5}
//                         alt="Avatar 5"
//                         className="absolute"
//                         style={{
//                             width: 40,
//                             height: 40,
//                             top: '27%',
//                             left: '4%',
//                             transform: 'translateX(-50%)',
//                             borderRadius: '50%',
//                             zIndex: 20,
//                         }}
//                     />

//                     {/* Center content */}
//                     <div
//                         className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center w-full max-w-2xl px-4"
//                         style={{ transform: 'translate(-50%, -50%)', zIndex: 10 }}
//                     >
//                         <h1 className="text-3xl md:text-4xl lg:text-[4rem] font-extrabold mb-6 text-center leading-tight">
//                             Welcome Jake!
//                         </h1>
//                         <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl font-normal">
//                             Hire Beyond Resumes With AI Precision & Blockchain Trust
//                         </p>
//                         <div className="flex items-center justify-center gap-2 my-10">
//                             <span className="text-base text-black font-medium">Already a Pro?</span>
//                             <a href="#" className="text-bases text-[#0084FF] hover:underline">
//                                 Skip the walkthrough
//                             </a>
//                         </div>
//                         <button className="max-w-[317px] max-h-[72px] bg-gradient-custom text-white p-4 rounded-full text-base font-bold shadow-lg flex items-center gap-2 transition-all duration-200">
//                             <img src={plusIcon} alt="plusIcon" className='h-10 w-10' />
//                             Create Your First Assessment
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default HomePage;

// import React, { useEffect, useState } from 'react';
// import avatar1 from '/avatar1.svg';
// import avatar2 from '/avatar2.svg';
// import avatar3 from '/avatar3.svg';
// import avatar4 from '/avatar4.svg';
// import avatar5 from '/avatar5.svg';
// import avatar6 from '/avatar6.svg';
// import avatar7 from '/avatar7.svg';
// import avatar8 from '/avatar8.svg';
// import avatar9 from '/avatar9.svg';
// import plusIcon from '/plusIcon.svg';
// import { motion } from 'framer-motion';

// const HomePage = () => {
//     const [windowSize, setWindowSize] = useState({
//         width: typeof window !== 'undefined' ? window.innerWidth : 0,
//         height: typeof window !== 'undefined' ? window.innerHeight : 0,
//     });

//     useEffect(() => {
//         const handleResize = () => {
//             setWindowSize({
//                 width: window.innerWidth,
//                 height: window.innerHeight,
//             });
//         };
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     // Calculate relative sizes based on the Figma design
//     const baseSize = windowSize.width > 1440 ? 900 : (windowSize.width / 1440) * 900;
//     const circleStyles = {
//         outer: {
//             width: baseSize,
//             height: baseSize,
//             maxWidth: '900px',
//             maxHeight: '900px',
//         },
//         middle: {
//             width: baseSize * (850 / 1000),
//             height: baseSize * (850 / 1000),
//             maxWidth: '850px',
//             maxHeight: '850px',
//         },
//         inner: {
//             width: baseSize * (680 / 1000),
//             height: baseSize * (680 / 1000),
//             maxWidth: '680px',
//             maxHeight: '680px',
//         }
//     };

//     // --- Static positions for middle circle ---
//     const middlePositions = [
//         {
//             style: {
//                 width: 88,
//                 height: 88,
//                 top: '10%',
//                 right: '9%',
//                 borderRadius: '50%',
//                 zIndex: 19,
//             },
//         },
//         {
//             style: {
//                 width: 88,
//                 height: 88,
//                 top: '46%',
//                 right: '-11%',
//                 transform: 'translateX(-50%)',
//                 borderRadius: '50%',
//                 zIndex: 19,
//             },
//         },
//         {
//             style: {
//                 width: 88,
//                 height: 88,
//                 top: '50%',
//                 left: '-5%',
//                 borderRadius: '50%',
//                 zIndex: 19,
//             },
//         },
//         {
//             style: {
//                 width: 88,
//                 height: 88,
//                 top: '7%',
//                 left: '13%',
//                 borderRadius: '50%',
//                 zIndex: 19,
//             },
//         }
//     ];

//     // --- Static positions for inner circle ---
//     const innerPositions = [
//         {
//             style: {
//                 width: 40,
//                 height: 40,
//                 left: '47%',
//                 top: '0px',
//                 transform: 'translateY(-50%)',
//                 borderRadius: '50%',
//                 zIndex: 20,
//             },
//         },
//         {
//             style: {
//                 width: 40,
//                 height: 40,
//                 right: '2%',
//                 bottom: '21%',
//                 transform: 'translateY(-50%)',
//                 borderRadius: '50%',
//                 border: '2px solid #fff',
//                 boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//                 background: '#E6F9ED',
//                 zIndex: 20,
//             },
//         },
//         {
//             style: {
//                 width: 80,
//                 height: 80,
//                 right: '10%',
//                 top: '88%',
//                 transform: 'translateY(-50%)',
//                 borderRadius: '50%',
//                 zIndex: 20,
//             },
//         },
//         {
//             style: {
//                 width: 80,
//                 height: 80,
//                 left: '15%',
//                 top: '90%',
//                 transform: 'translateY(-50%)',
//                 borderRadius: '50%',
//                 zIndex: 20,
//             },
//         },
//         {
//             style: {
//                 width: 40,
//                 height: 40,
//                 top: '27%',
//                 left: '4%',
//                 transform: 'translateX(-50%)',
//                 borderRadius: '50%',
//                 zIndex: 20,
//             },
//         }
//     ];

//     // --- Avatar images for swapping ---
//     const [middleImages, setMiddleImages] = useState([avatar6, avatar7, avatar8, avatar9]);
//     const [innerImages, setInnerImages] = useState([avatar1, avatar2, avatar3, avatar4, avatar5]);

//     // --- Swapping logic ---
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setMiddleImages(prev => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
//             setInnerImages(prev => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
//         }, 2000); // every 2 seconds
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 px-4">
//             <div className="relative flex items-center justify-center">
//                 {/* Outermost circle */}
//                 <div
//                     className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
//                     style={{
//                         width: `${circleStyles.outer.width}px`,
//                         height: `${circleStyles.outer.height}px`,
//                         maxWidth: circleStyles.outer.maxWidth,
//                         maxHeight: circleStyles.outer.maxHeight,
//                     }}
//                 >
//                     {/* Outer circle avatars (if any) */}
//                 </div>

//                 {/* Middle circle */}
//                 <div
//                     className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
//                     style={{
//                         width: `${circleStyles.middle.width}px`,
//                         height: `${circleStyles.middle.height}px`,
//                         maxWidth: circleStyles.middle.maxWidth,
//                         maxHeight: circleStyles.middle.maxHeight,
//                     }}
//                 >
//                     {middlePositions.map((pos, i) => (
//                         <motion.img

//                             key={i}
//                             src={middleImages[i]}
//                             alt={`Middle Avatar ${i}`}
//                             className="absolute"
//                             style={pos.style}
//                             layout
//                             transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                         />
//                     ))}
//                 </div>

//                 {/* Inner circle */}
//                 <div
//                     className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
//                     style={{
//                         width: `${circleStyles.inner.width}px`,
//                         height: `${circleStyles.inner.height}px`,
//                         maxWidth: circleStyles.inner.maxWidth,
//                         maxHeight: circleStyles.inner.maxHeight,
//                     }}
//                 >
//                     {innerPositions.map((pos, i) => (
//                         <motion.img
//                             key={i}
//                             src={innerImages[i]}
//                             alt={`Inner Avatar ${i}`}
//                             className="absolute"
//                             style={pos.style}
//                             layout
//                             transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                         />
//                     ))}

//                     {/* Center content */}
//                     <div
//                         className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center w-full max-w-2xl px-4"
//                         style={{ transform: 'translate(-50%, -50%)', zIndex: 10 }}
//                     >
//                         <h1 className="text-3xl md:text-4xl lg:text-[4rem] font-extrabold mb-6 text-center leading-tight">
//                             Welcome Jake!
//                         </h1>
//                         <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl font-normal">
//                             Hire Beyond Resumes With AI Precision & Blockchain Trust
//                         </p>
//                         <div className="flex items-center justify-center gap-2 my-10">
//                             <span className="text-base text-black font-medium">Already a Pro?</span>
//                             <a href="#" className="text-bases text-[#0084FF] hover:underline">
//                                 Skip the walkthrough
//                             </a>
//                         </div>
//                         <button className="max-w-[317px] max-h-[72px] bg-gradient-custom text-white p-4 rounded-full text-base font-bold shadow-lg flex items-center gap-2 transition-all duration-200">
//                             <img src={plusIcon} alt="plusIcon" className='h-10 w-10' />
//                             Create Your First Assessment
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default HomePage;
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

const HomePage = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

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
    const baseSize = windowSize.width > 1440 ? 900 : (windowSize.width / 1440) * 900;
    const circleStyles = {
        outer: {
            width: baseSize,
            height: baseSize,
            maxWidth: '900px',
            maxHeight: '900px',
        },
        middle: {
            width: baseSize * (850 / 1000),
            height: baseSize * (850 / 1000),
            maxWidth: '850px',
            maxHeight: '850px',
        },
        inner: {
            width: baseSize * (680 / 1000),
            height: baseSize * (680 / 1000),
            maxWidth: '680px',
            maxHeight: '680px',
        }
    };

    // --- Static positions for middle circle ---
    const middlePositions = [
        { style: { width: 80, height: 80, top: '10%', right: '9%', borderRadius: '50%', zIndex: 19 } },
        { style: { width: 80, height: 80, top: '46%', right: '-11%', transform: 'translateX(-50%)', borderRadius: '50%', zIndex: 19 } },
        { style: { width: 80, height: 80, top: '50%', left: '-5%', borderRadius: '50%', zIndex: 19 } },
        { style: { width: 80, height: 88, top: '7%', left: '13%', borderRadius: '50%', zIndex: 19 } }
    ];

    // --- Static positions for inner circle ---
    const innerPositions = [
        { style: { width: 40, height: 40, left: '47%', top: '0px', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: 40, height: 40, right: '2%', bottom: '21%', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: 80, height: 80, right: '10%', top: '88%', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: 80, height: 80, left: '15%', top: '90%', transform: 'translateY(-50%)', borderRadius: '50%', zIndex: 20 } },
        { style: { width: 40, height: 40, top: '27%', left: '4%', transform: 'translateX(-50%)', borderRadius: '50%', zIndex: 20 } }
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
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 px-4">
            <div className="relative flex items-center justify-center">
                {/* Outermost circle */}
                <div
                    className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
                    style={{
                        width: `${circleStyles.outer.width}px`,
                        height: `${circleStyles.outer.height}px`,
                        maxWidth: circleStyles.outer.maxWidth,
                        maxHeight: circleStyles.outer.maxHeight,
                    }}
                />

                {/* Middle circle */}
                <div
                    className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)] overflow-visible"
                    style={{
                        width: `${circleStyles.middle.width}px`,
                        height: `${circleStyles.middle.height}px`,
                        maxWidth: circleStyles.middle.maxWidth,
                        maxHeight: circleStyles.middle.maxHeight,
                    }}
                >
                    <AnimatePresence initial={false}>
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
                                transition={{ duration: 0.5 }}
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
                        maxWidth: circleStyles.inner.maxWidth,
                        maxHeight: circleStyles.inner.maxHeight,
                    }}
                >
                    <AnimatePresence initial={false}>
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
                                transition={{ duration: 0.5 }}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Center content */}
                    <div
                        className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center w-full max-w-2xl px-4"
                        style={{ transform: 'translate(-50%, -50%)', zIndex: 10 }}
                    >
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-center leading-tight">
                            Welcome Jake!
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl font-normal">
                            Hire Beyond Resumes With AI Precision & Blockchain Trust
                        </p>
                        <div className="flex items-center justify-center gap-2 my-10">
                            <span className="text-base text-black font-medium">Already a Pro?</span>
                            <a href="#" className="text-bases text-[#0084FF] hover:underline">
                                Skip the walkthrough
                            </a>
                        </div>
                        <button className="max-w-[317px] max-h-[72px] bg-gradient-custom text-white p-4 rounded-full text-base font-bold shadow-lg flex items-center gap-2 transition-all duration-200">
                            <img src={plusIcon} alt="plusIcon" className='h-10 w-10' />
                            Create Your First Assessment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;