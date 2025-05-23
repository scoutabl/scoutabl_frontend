import testCaseIcon from '/testCaseIcon.svg';
import testResultIcon from '/testResultIcon.svg';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
// Add collapseDirection prop
const OutputNavBar = ({ activeTab, setActiveTab, collapsed, isOutputCollapsed, onOutputCollapse, collapseDirection }) => {
    // Render horizontal OutputNavBar if vertically collapsed
    if (collapseDirection === 'vertical') {
        return (
            <div className="w-full min-h-[52px] max-h-[52px] flex flex-row items-center gap-4 bg-purpleSecondary justify-around rounded-t-xl overflow-hidden">
                <button
                    className={cn(
                        "flex flex-row items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-full",
                        {
                            "bg-white": activeTab === 'cases',
                        }
                    )}
                    onClick={() => setActiveTab && setActiveTab('cases')}
                >
                    <img src={testCaseIcon} alt="testCaseIcon" style={{ transform: 'rotate(0deg)' }} />
                    <span>Testcase</span>
                </button>
                <button
                    className={cn(
                        "flex flex-row items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-full",
                        {
                            "bg-white": activeTab === 'results',
                        }
                    )}
                    onClick={() => setActiveTab && setActiveTab('results')}
                >
                    <img src={testResultIcon} alt="testResultIcon" style={{ transform: 'rotate(0deg)' }} />
                    <span>Test Result</span>
                </button>
                {/* Fullscreen/collapse buttons can be added here if needed */}
            </div>
        );
    }

    // Render vertical OutputNavBar if horizontally collapsed
    if (collapseDirection === 'horizontal' || collapsed) {
        return (
            <div className="py-8 w-12 min-w-[52px] max-w-[52px] flex flex-col items-center gap-4 bg-white justify-between rounded-xl">
                <button
                    // className="flex flex-col items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary"

                    // })}
                    className={cn("flex flex-col items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary",
                        {
                            "bg-purpleSecondary": activeTab === 'cases',
                        }
                    )}
                    style={{ transform: 'rotate(180deg)' }}
                    onClick={() => setActiveTab && setActiveTab('cases')}
                >
                    <span
                        className='text-sm font-medium text-greyPrimary'
                        style={{
                            writingMode: 'vertical-lr',
                            textOrientation: 'mixed',
                            transform: 'rotate(180deg)',
                            marginTop: 2
                        }}
                    >
                        Test Cases
                    </span>
                    <img src={testCaseIcon} alt="testCaseIcon" style={{ transform: 'rotate(-90deg)' }} />
                </button>
                <button
                    className={cn("flex flex-col items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary",
                        {
                            "bg-purpleSecondary": activeTab === 'results',
                        }
                    )}
                    style={{ transform: 'rotate(180deg)' }}
                    onClick={() => setActiveTab && setActiveTab('results')}
                >
                    <span
                        className='text-sm font-medium text-greyPrimary'
                        style={{
                            writingMode: 'vertical-lr',
                            textOrientation: 'mixed',
                            transform: 'rotate(180deg)',
                            marginTop: 2
                        }}
                    >
                        Test Results
                    </span>
                    <img src={testResultIcon} alt="testResultIcon" style={{ transform: 'rotate(-90deg)' }} />
                </button>
                <div className='flex flex-col items-center gap-[1rem]'>
                    <button className='py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in'
                        title="Fullscreen">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 1.5H2.83333C2.09695 1.5 1.5 2.09695 1.5 2.83333V5.5M5.5 13.5H2.83333C2.09695 13.5 1.5 12.903 1.5 12.1667V9.5M9.5 1.5H12.1667C12.903 1.5 13.5 2.09695 13.5 2.83333V5.5M13.5 9.5V12.1667C13.5 12.903 12.903 13.5 12.1667 13.5H9.5" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>
        )
    }

    // Default: Render full OutputNavBar (horizontal)
    return (
        <div className={cn("px-6 py-3 flex items-center justify-between gap-4 bg-white  overflow-x-auto", {
            'min-h-[52px]': !isOutputCollapsed,
        })}>
            <div className='flex items-center gap-4'>
                <button
                    className={cn(
                        "text-nowrap flex items-center gap-2 px-4 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary",
                        {
                            "bg-purpleSecondary": activeTab === 'cases',
                        }
                    )}
                    onClick={() => setActiveTab('cases')}
                >
                    <img src={testCaseIcon} alt="testCaseIcon" />
                    Test cases
                </button>
                <button
                    className={cn(
                        "text-nowrap flex items-center gap-2 px-4 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary",
                        {
                            "bg-purpleSecondary": activeTab === 'results',
                        }
                    )}
                    onClick={() => setActiveTab('results')}
                >
                    <img src={testResultIcon} alt="testResultIcon" />
                    Test Result
                </button>
            </div>
            <div className='flex items-center gap-[1rem]'>
                <button
                    className='h-8 w-8 grid place-content-center rounded-[8px] hover:bg-purpleSecondary transition-all duration-300 ease-in-out'
                // onClick={onCollapse}
                // title={isEditorCollapsed ? "Expand Editor" : "Collapse Editor"}
                >
                    <motion.div
                        // animate={{ rotate: isEditorCollapsed ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ display: 'inline-block' }}
                    >
                        <ChevronUp />
                    </motion.div>
                </button>
                <button className='py-2 px-3 rounded-[8px] hover:bg-purpleSecondary transition-all duration-300 ease-in'
                    title="Fullscreen">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 1.5H2.83333C2.09695 1.5 1.5 2.09695 1.5 2.83333V5.5M5.5 13.5H2.83333C2.09695 13.5 1.5 12.903 1.5 12.1667V9.5M9.5 1.5H12.1667C12.903 1.5 13.5 2.09695 13.5 2.83333V5.5M13.5 9.5V12.1667C13.5 12.903 12.903 13.5 12.1667 13.5H9.5" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

        </div>
    );
};

export default OutputNavBar; 