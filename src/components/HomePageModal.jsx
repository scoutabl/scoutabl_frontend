import React, { useState } from 'react'
import codingIcon from '/codingIcon.svg'
import bulbIcon from '/bulbIcon.svg'
import breifcaseIcon from '/breifcaseIcon.svg'
import bottomBg from '/bottomBackground.svg'
import { Button } from './ui/button'
import { ChevronRight } from 'lucide-react'

const HomePageModal = () => {
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <div className='relative w-[1139px] h-[644px] rounded-[16px] flex flex-col items-center justify-center mx-auto [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] overflow-hidden'>
            <div className='flex flex-col items-center justify-center gap-[52px]'>
                <div>
                    <h2 className='text-[32px] font-light pb-3'>Which kind of test fits your <span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text'>#hiring flow?</span></h2>
                    <p className='text-[#5C5C5C] text-sm font-medium'>These answers help Scoutabl shape an experience that fits you like a tailored suit—minus the stitching</p>
                </div>
                <div className='flex items-center justify-between gap-10'>
                    <div
                        onClick={() => setSelectedOption('coding')}
                        className={`group max-w-[213px] max-h-[192px] rounded-[16px] cursor-pointer transition-all duration-300 border border-transparent ${selectedOption === 'coding'
                            ? 'bg-gradient-to-r from-[#806BFF] to-[#A669FD] p-px'
                            : 'hover:bg-gradient-to-r hover:from-[#806BFF] hover:to-[#A669FD] hover:p-px'
                            }`}
                    >
                        <div className='h-full w-full px-[22px] py-[41px] flex flex-col items-center justify-center gap-2 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] border-black/10 rounded-[16px] bg-white'>
                            <img
                                src={codingIcon}
                                alt="Coding Icon"
                                className={`w-10 h-10 pb-2 transition-colors duration-300 ${selectedOption === 'coding'
                                    ? '[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                    : 'group-hover:[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                    }`}
                            />
                            <h3 className='text-xs font-semibold text-[#333333]'>Coding Challenges</h3>
                            <span className='font-normal text-[10px] text-[#5C5C5C] text-center'>Test technical chops and problem-solving</span>
                        </div>
                    </div>
                    <div
                        onClick={() => setSelectedOption('soft')}
                        className={`group max-w-[213px] max-h-[192px] rounded-[16px] cursor-pointer transition-all duration-300 border border-transparent ${selectedOption === 'soft'
                            ? 'bg-gradient-to-r from-[#806BFF] to-[#A669FD] p-px'
                            : 'hover:bg-gradient-to-r hover:from-[#806BFF] hover:to-[#A669FD] hover:p-px'
                            }`}
                    >
                        <div className='h-full w-full px-[22px] py-[41px] flex flex-col items-center justify-center gap-2 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] border-black/10 rounded-[16px] bg-white'>
                            <img
                                src={bulbIcon}
                                alt="bulb Icon"
                                className={`w-10 h-10 pb-2 transition-colors duration-300 ${selectedOption === 'soft'
                                    ? '[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                    : 'group-hover:[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                    }`}
                            />
                            <h3 className='text-xs font-semibold text-[#333333]'>Soft Skills & Personality</h3>
                            <span className='font-normal text-[10px] text-[#5C5C5C] text-center'>Gauge communication, empathy, and traits</span>
                        </div>
                    </div>
                    <div
                        onClick={() => setSelectedOption('business')}
                        className={`group max-w-[213px] max-h-[192px] rounded-[16px] cursor-pointer transition-all duration-300 border border-transparent ${selectedOption === 'business'
                            ? 'bg-gradient-to-r from-[#806BFF] to-[#A669FD] p-px'
                            : 'hover:bg-gradient-to-r hover:from-[#806BFF] hover:to-[#A669FD] hover:p-px'
                            }`}
                    >
                        <div className='h-full w-full px-[22px] py-[41px] flex flex-col items-center justify-center gap-2 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] border-black/10 rounded-[16px] bg-white'>
                            <img
                                src={breifcaseIcon}
                                alt="breifcase Icon"
                                className={`w-10 h-10 pb-2 transition-colors duration-300 ${selectedOption === 'business'
                                    ? '[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                    : 'group-hover:[filter:invert(41%)_sepia(56%)_saturate(1009%)_hue-rotate(226deg)_brightness(94%)_contrast(94%)]'
                                    }`}
                            />
                            <h3 className='text-xs font-semibold text-[#333333]'>Business & Case Scenarios</h3>
                            <span className='font-normal text-[10px] text-[#5C5C5C] text-center'>Assess strategic thinking and decision-making</span>
                        </div>
                    </div>
                </div>
                <Button effect="shineHover" className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 rounded-full px-3 py-[6px] h-[33px] w-[83px]">
                    Next
                    <ChevronRight />
                </Button>
            </div>

            <img src={bottomBg} alt="Bottom Background" className='absolute bottom-0 right-0' />
        </div>
    )
}

export default HomePageModal