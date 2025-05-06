import React, { useState, useRef, useEffect } from 'react'
import codingIcon from '/codingIcon.svg'
import bulbIcon from '/bulbIcon.svg'
import breifcaseIcon from '/breifcaseIcon.svg'
import bottomBg from '/bottomBackground.svg'
import rocketIcon from '/rocketIcon.svg'
import arrowIcon from '/arrowIcon.svg'
import userIcon from '/userIcon.svg'
import { Button } from './ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const HomePageModal = ({ onClose }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentStep, setCurrentStep] = useState('test');
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleNext = () => {
        if (selectedOption) {
            setCurrentStep('role');
        }
    };

    const handleBack = () => {
        setCurrentStep('test');
    };

    const handleRoleSelect = (roleId) => {
        console.log('Selected role:', roleId);
        console.log('Selected test type:', selectedOption);
        onClose();
    };

    const options = [
        {
            id: 'coding',
            title: 'Coding Challenges',
            description: 'Test technical chops and problem-solving',
            icon: codingIcon
        },
        {
            id: 'soft',
            title: 'Soft Skills & Personality',
            description: 'Gauge communication, empathy, and traits',
            icon: bulbIcon
        },
        {
            id: 'business',
            title: 'Business & Case Scenarios',
            description: 'Assess strategic thinking and decision-making',
            icon: breifcaseIcon
        }
    ];

    const roles = [
        {
            id: 'founder',
            title: 'Founder',
            description: 'Building the dream team from scratch',
            icon: rocketIcon
        },
        {
            id: 'hiring_manager',
            title: 'Hiring Manager',
            description: 'Making the final calls on the talent',
            icon: arrowIcon
        },
        {
            id: 'recruiter',
            title: 'Recruiter',
            description: 'Streamlining recruitment and hiring',
            icon: userIcon
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0, },
        show: {
            opacity: 1,
            transition: {
                duration: 1,
                staggerChildren: 0.3,
                when: "beforeChildren"
            }
        }
    };

    // const itemVariants = {
    //     hidden: {
    //         opacity: 0,
    //         y: 20
    //     },
    //     show: {
    //         opacity: 1,
    //         y: 0,
    //         transition: {
    //             duration: 0.4,
    //             ease: "easeOut"
    //         }
    //     }
    // };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, transition: { duration: 0.5 }, y: 0 },
    }

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='relative w-[1139px] h-[644px] rounded-[16px] flex flex-col items-center justify-center mx-auto [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] overflow-hidden bg-white'
            ref={modalRef}
        >
            <AnimatePresence mode="wait">
                {currentStep === 'test' ? (
                    <motion.div
                        key="test-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className='flex flex-col items-center justify-center gap-[52px]'
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <h2 className='text-[32px] font-light pb-3'>Which kind of test fits your <span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text'>#hiring flow?</span></h2>
                            <p className='text-[#5C5C5C] text-sm font-medium text-center'>These answers help Scoutabl shape an experience that fits you like a tailored suit—minus the stitching</p>
                        </motion.div>
                        <motion.div
                            className='flex items-center justify-between gap-10'
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {options.map((option) => (
                                <motion.div
                                    key={option.id}
                                    variants={itemVariants}
                                    onClick={() => setSelectedOption(option.id)}
                                    className={`group rounded-[16px] cursor-pointer transition-all duration-300 border border-transparent p-px bg-gradient-to-r ${selectedOption === option.id
                                        ? 'from-[#806BFF] to-[#A669FD]'
                                        : 'from-transparent to-transparent hover:from-[#806BFF] hover:to-[#A669FD]'
                                        }`}
                                >
                                    <div className='h-full w-full px-[22px] py-[41px] flex flex-col items-center justify-center gap-2 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] border-black/10 rounded-[16px] bg-white'>
                                        <img
                                            src={option.icon}
                                            alt={`${option.title} Icon`}
                                            className={`w-10 h-10 pb-2 transition-colors duration-300 ${selectedOption === option.id
                                                ? '[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                                : 'group-hover:[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                                }`}
                                        />
                                        <h3 className='text-xs font-semibold text-[#333333]'>{option.title}</h3>
                                        <span className='font-normal text-[10px] text-[#5C5C5C] text-center'>{option.description}</span>
                                    </div>
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
                                className={`bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white rounded-full px-3 py-[6px] h-[33px] w-[83px] ${!selectedOption && 'opacity-50 cursor-not-allowed'}`}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="role-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center gap-[52px]"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <h2 className="text-[32px] font-light pb-3">Which best describes your <span className="bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text">#role</span>?</h2>
                            <p className="text-[#5C5C5C] text-sm font-medium text-center">
                                Your role helps Scoutabl customize the experience to suit your needs
                                <br />
                                —no fine-tuning necessary.
                            </p>
                        </motion.div>

                        {/* <motion.div
                            className='flex items-center justify-between gap-10'
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {roles.map((option) => (
                                <motion.div
                                    key={option.id}
                                    variants={itemVariants}
                                    onClick={() => setSelectedOption(option.id)}
                                    className={`group max-w-[213px] max-h-[192px] rounded-[16px] cursor-pointer transition-all duration-300 border border-transparent ${selectedOption === option.id
                                        ? 'bg-gradient-to-r from-[#806BFF] to-[#A669FD] p-px'
                                        : 'hover:bg-gradient-to-r hover:from-[#806BFF] hover:to-[#A669FD] hover:p-px'
                                        }`}
                                >
                                    <div className='h-full w-full px-[22px] py-[41px] flex flex-col items-center justify-center gap-2 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] border-black/10 rounded-[16px] bg-white'>
                                        <img
                                            src={option.icon}
                                            alt={`${option.title} Icon`}
                                            className={`w-10 h-10 pb-2 transition-colors duration-300 ${selectedOption === option.id
                                                ? '[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                                : 'group-hover:[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                                }`}
                                        />
                                        <h3 className='text-xs font-semibold text-[#333333]'>{option.title}</h3>
                                        <span className='font-normal text-[10px] text-[#5C5C5C] text-center'>{option.description}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div> */}
                        <motion.div
                            className='flex items-center justify-between gap-10'
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {roles.map((option) => (
                                <motion.div
                                    key={option.id}
                                    variants={itemVariants}
                                    onClick={() => setSelectedOption(option.id)}
                                    className={`group rounded-[16px] cursor-pointer transition-all duration-300 border border-transparent p-px bg-gradient-to-r ${selectedOption === option.id
                                        ? 'from-[#806BFF] to-[#A669FD]'
                                        : 'from-transparent to-transparent hover:from-[#806BFF] hover:to-[#A669FD]'
                                        }`}
                                >
                                    <div className='h-full w-full px-[22px] py-[41px] flex flex-col items-center justify-center gap-2 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] border-black/10 rounded-[16px] bg-white'>
                                        <img
                                            src={option.icon}
                                            alt={`${option.title} Icon`}
                                            className={`w-10 h-10 pb-2 transition-colors duration-300 ${selectedOption === option.id
                                                ? '[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                                : 'group-hover:[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                                }`}
                                        />
                                        <h3 className='text-xs font-semibold text-[#333333]'>{option.title}</h3>
                                        <span className='font-normal text-[10px] text-[#5C5C5C] text-center text-nowrap'>{option.description}</span>
                                    </div>
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
                                onClick={() => handleRoleSelect('default')}
                                className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white rounded-full px-3 py-[6px] h-[33px] w-[83px]"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <img src={bottomBg} alt="Bottom Background" className='absolute bottom-0 right-0' />
        </motion.div>
    )
}

export default HomePageModal