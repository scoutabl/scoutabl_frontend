// import React from 'react'
// import avatar1 from '/avatar1.svg'
// const HomePage = () => {
//     return (
//         <div className='min-h-screen w-full flex items-center justify-center'>
//             <div className='relative flex flex-col items-center justify-center h-[450px] w-[450px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)]'>
//                 <img src={avatar1} alt='avatar 1' className='absolute top-10 left-0' />
//                 <img src={avatar1} alt='avatar 1' className='absolute -top-6 right-30' />
//                 <img src={avatar1} alt='avatar 1' className='absolute bottom-20 right-0' />
//                 <img src={avatar1} alt='avatar 1' className='absolute bottom-10 left-5' />
//             </div>
//             <div className='relative flex flex-col items-center justify-center h-[650px] w-[650px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)]'>
//                 <img src={avatar1} alt='avatar 1' className='absolute top-50 -left-5' />
//                 <img src={avatar1} alt='avatar 1' className='absolute top-30 -right-5' />

//             </div>
//         </div>
//     )

// }

// export default HomePage

// import React, { useRef, useEffect, useState } from 'react';
// import avatar1 from '/avatar1.svg';
// import avatar2 from '/avatar1.svg';
// import avatar3 from '/avatar1.svg';

// const circles = [
//     {
//         size: 1, // 100% of container
//         avatars: [
//             { img: avatar1, angle: 0 },
//             { img: avatar2, angle: 90 },
//             { img: avatar3, angle: 180 },
//             { img: avatar1, angle: 270 },
//         ],
//     },
//     {
//         size: 0.75, // 75% of container
//         avatars: [
//             { img: avatar2, angle: 20 },
//             { img: avatar3, angle: 135 },
//             { img: avatar1, angle: 225 },
//             { img: avatar2, angle: 315 },
//         ],
//     },
//     {
//         size: 0.55, // 55% of container
//         avatars: [
//             { img: avatar3, angle: 60 },
//             { img: avatar1, angle: 180 },
//             { img: avatar2, angle: 300 },
//         ],
//     },
// ];

// function getPosition(angle, radius) {
//     const rad = (angle - 90) * (Math.PI / 180);
//     const x = radius * Math.cos(rad);
//     const y = radius * Math.sin(rad);
//     return { x, y };
// }

// const HomePage = () => {
//     const containerRef = useRef(null);
//     const [containerSize, setContainerSize] = useState(0);

//     useEffect(() => {
//         function handleResize() {
//             if (containerRef.current) {
//                 setContainerSize(containerRef.current.offsetWidth);
//             }
//         }
//         handleResize();
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     // Responsive avatar size
//     const avatarSize = Math.max(32, Math.min(64, containerSize * 0.07)); // clamp between 32px and 64px

//     return (
//         <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden">
//             <div
//                 ref={containerRef}
//                 className="relative flex items-center justify-center w-full max-w-[90vw] aspect-square"
//                 style={{ minWidth: 300, maxWidth: 700 }}
//             >
//                 {/* Circles */}
//                 {containerSize > 0 &&
//                     circles.map((circle, i) => {
//                         const size = containerSize * circle.size;
//                         return (
//                             <div
//                                 key={i}
//                                 className="absolute left-1/2 top-1/2 rounded-full"
//                                 style={{
//                                     width: size,
//                                     height: size,
//                                     transform: `translate(-50%, -50%)`,
//                                     background:
//                                         'radial-gradient(50% 50% at 50% 50%, rgba(228,228,228,0) 80%, rgba(228,228,228,0.35) 100%)',
//                                     zIndex: 1 + i,
//                                 }}
//                             >
//                                 {/* Avatars on this circle */}
//                                 {circle.avatars.map((avatar, j) => {
//                                     const r = size / 2;
//                                     const { x, y } = getPosition(avatar.angle, r);
//                                     return (
//                                         <img
//                                             key={j}
//                                             src={avatar.img}
//                                             alt={`avatar-${j}`}
//                                             className="absolute"
//                                             style={{
//                                                 left: `calc(50% + ${x}px - ${avatarSize / 2}px)`,
//                                                 top: `calc(50% + ${y}px - ${avatarSize / 2}px)`,
//                                                 width: avatarSize,
//                                                 height: avatarSize,
//                                                 borderRadius: '50%',
//                                                 background: '#E6F9ED',
//                                                 border: '4px solid #fff',
//                                                 boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//                                             }}
//                                         />
//                                     );
//                                 })}
//                             </div>
//                         );
//                     })}

//                 {/* Center content */}
//                 <div
//                     className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center px-2"
//                     style={{ transform: 'translate(-50%, -50%)', zIndex: 10 }}
//                 >
//                     <h1 className="text-2xl md:text-4xl font-bold mb-2 text-center">Welcome Jake!</h1>
//                     <p className="text-base md:text-lg text-gray-500 mb-6 text-center">
//                         Hire Beyond Resumes With AI Precision & Blockchain Trust
//                     </p>
//                     <button className="bg-[#806BFF] hover:bg-[#A669FD] text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-base md:text-lg font-semibold shadow-lg">
//                         Create Your First Assessment
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomePage;

import React, { useRef, useEffect, useState } from 'react';
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
const HomePage = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    // Avatar state for animation
    const [innerAvatars, setInnerAvatars] = useState([
        { src: avatar1, alt: "Avatar 1" },
        { src: avatar2, alt: "Avatar 2" },
        { src: avatar3, alt: "Avatar 3" },
        { src: avatar4, alt: "Avatar 4" },
        { src: avatar5, alt: "Avatar 5" },
    ]);
    const [outerAvatars, setOuterAvatars] = useState([
        { src: avatar7, alt: "Avatar 7" },
        { src: avatar8, alt: "Avatar 8" },
        { src: avatar9, alt: "Avatar 9" },
        { src: avatar6, alt: "Avatar 6" },
    ]);
    const [isFading, setIsFading] = useState(false);

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

    // Animation: swap avatars every 3s
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setIsFading(true);
    //         setTimeout(() => {
    //             setInnerAvatars(prev => {
    //                 const next = [...prev];
    //                 next.push(next.shift());
    //                 return next;
    //             });
    //             setOuterAvatars(prev => {
    //                 const next = [...prev];
    //                 next.push(next.shift());
    //                 return next;
    //             });
    //             setIsFading(false);
    //         }, 400); // fade duration
    //     }, 10000);
    //     return () => clearInterval(interval);
    // }, []);

    // Calculate relative sizes based on the Figma design
    const baseSize = windowSize.width > 1440 ? 1222 : (windowSize.width / 1440) * 1222;
    const circleStyles = {
        outer: {
            width: baseSize,
            height: baseSize,
            maxWidth: '1200px',
            maxHeight: '1200px',
        },
        middle: {
            width: baseSize * (900 / 1200),
            height: baseSize * (900 / 1200),
            maxWidth: '900px',
            maxHeight: '900px',
        },
        inner: {
            width: baseSize * (680 / 1200),
            height: baseSize * (680 / 1200),
            maxWidth: '680',
            maxHeight: '680',
        }
    };

    // Helper to get avatar position on a circle
    function getAvatarPosition(index, total, radius) {
        const angle = (2 * Math.PI * index) / total - Math.PI / 2; // Start from top
        return {
            left: `calc(50% + ${radius * Math.cos(angle)}px)`,
            top: `calc(50% + ${radius * Math.sin(angle)}px)`,
        };
    }

    // Radii for avatar orbits
    const innerRadius = (circleStyles.inner.width / 2) - 60; // px offset for avatar size
    const outerRadius = (circleStyles.middle.width / 2) - 40;
    const avatarSize = 40;

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 px-4">
            <div className="relative flex items-center justify-center">
                {/* Outermost circle - 1222px */}
                <div
                    className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)]"
                    style={{
                        width: `${circleStyles.outer.width}px`,
                        height: `${circleStyles.outer.height}px`,
                        maxWidth: circleStyles.outer.maxWidth,
                        maxHeight: circleStyles.outer.maxHeight,
                    }}
                ></div>

                {/* Middle circle - 948px */}
                <div
                    className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)]"
                    style={{
                        width: `${circleStyles.middle.width}px`,
                        height: `${circleStyles.middle.height}px`,
                        maxWidth: circleStyles.middle.maxWidth,
                        maxHeight: circleStyles.middle.maxHeight,
                    }}
                ></div>

                {/* Inner circle - 680px */}
                <div
                    className="absolute rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(228,_228,_228,_0)_83.85%,_rgba(228,_228,_228,_0.35)_100%)]"
                    style={{
                        width: `${circleStyles.inner.width}px`,
                        height: `${circleStyles.inner.height}px`,
                        maxWidth: circleStyles.inner.maxWidth,
                        maxHeight: circleStyles.inner.maxHeight,
                    }}
                >
                    <div
                        className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center w-full max-w-2xl px-4"
                        style={{ transform: 'translate(-50%, -50%)', zIndex: 10 }}
                    >
                        <h1 className="text-3xl md:text-4xl lg:text-[4rem]  font-extrabold mb-6 text-center leading-tight">
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
                        <button className="bg-gradient-custom text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg flex items-center gap-2 transition-all duration-200">
                            <img src={plusIcon} alt="plusIcon" />
                            Create Your First Assessment
                        </button>
                    </div>
                </div>

                {/* Avatars: Inner circle */}
                {innerAvatars.map((avatar, i) => {
                    const pos = getAvatarPosition(i, innerAvatars.length, innerRadius);
                    return (
                        <img
                            key={avatar.alt}
                            src={avatar.src}
                            alt={avatar.alt}
                            style={{
                                position: 'absolute',
                                ...pos,
                                width: avatarSize,
                                height: avatarSize,
                                borderRadius: '50%',
                                border: '4px solid #fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                background: '#E6F9ED',
                                transform: 'translate(-50%, -50%)',
                                opacity: isFading ? 0 : 1,
                                transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
                                zIndex: 20,
                                maxWidth: "none",
                            }}
                        />
                    );
                })}
                {/* Avatars: Outer circle */}
                {outerAvatars.map((avatar, i) => {
                    const pos = getAvatarPosition(i, outerAvatars.length, outerRadius);
                    return (
                        <img
                            key={avatar.alt}
                            src={avatar.src}
                            alt={avatar.alt}
                            style={{
                                position: 'absolute',
                                ...pos,
                                width: avatarSize,
                                height: avatarSize,
                                borderRadius: '50%',
                                border: '4px solid #fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                background: '#E6F9ED',
                                transform: 'translate(-50%, -50%)',
                                opacity: isFading ? 0 : 1,
                                transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
                                zIndex: 19,
                                maxWidth: 'none',
                            }}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default HomePage;