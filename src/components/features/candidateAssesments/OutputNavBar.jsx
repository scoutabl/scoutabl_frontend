import testCaseIcon from '/testCaseIcon.svg';
import testResultIcon from '/testResultIcon.svg';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
const OutputNavBar = ({ activeTab, setActiveTab, collapsed }) => {

    if (collapsed) {
        return (
            <div className="py-8 min-w-[52px] max-w-[52px] flex flex-col items-center gap-4 bg-purpleSecondary justify-around rounded-xl overflow-hidden">
                <button
                    style={{ transform: 'rotate(180deg)' }}
                    className={cn(
                        "flex flex-col items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-full",
                        {
                            "bg-white": activeTab === 'cases',
                        }
                    )}
                    onClick={() => setActiveTab && setActiveTab('cases')}
                >
                    <span style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>Testcase</span>
                    <img src={testCaseIcon} alt="testCaseIcon" style={{ transform: 'rotate(-90deg)' }} />
                </button>
                <button
                    style={{ transform: 'rotate(180deg)' }}
                    className={cn(
                        "flex flex-col items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-full",
                        {
                            "bg-white": activeTab === 'results',
                        }
                    )}
                    onClick={() => setActiveTab && setActiveTab('results')}
                >
                    <span style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>Test Result</span>
                    <img src={testResultIcon} alt="testResultIcon" style={{ transform: 'rotate(-90deg)' }} />
                </button>
                <div className='flex flex-col items-center gap-[1rem]'>
                    <button className='py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in'
                        // onClick={onFullscreen}
                        title="Fullscreen">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 1.5H2.83333C2.09695 1.5 1.5 2.09695 1.5 2.83333V5.5M5.5 13.5H2.83333C2.09695 13.5 1.5 12.903 1.5 12.1667V9.5M9.5 1.5H12.1667C12.903 1.5 13.5 2.09695 13.5 2.83333V5.5M13.5 9.5V12.1667C13.5 12.903 12.903 13.5 12.1667 13.5H9.5" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    <button
                        style={{ transform: 'rotate(360deg)' }}
                        className='py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in'
                        // onClick={onCollapse} 
                        title="Collapse">
                        <ChevronDown />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between gap-4 bg-purpleSecondary px-6 py-3 overflow-x-auto">
            <div className='flex items-center gap-4'>
                <button
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-full",
                        {
                            "bg-white": activeTab === 'cases',
                        }
                    )}
                    onClick={() => setActiveTab('cases')}
                >
                    <img src={testCaseIcon} alt="testCaseIcon" />
                    Testcase
                </button>
                <button
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-full",
                        {
                            "bg-white": activeTab === 'results',
                        }
                    )}
                    onClick={() => setActiveTab('results')}
                >
                    <img src={testResultIcon} alt="testResultIcon" />
                    Test Result
                </button>
            </div>
            <div className='flex items-center gap-[1rem]'>
                <button className='py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in'
                    // onClick={onFullscreen}
                    title="Fullscreen">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 1.5H2.83333C2.09695 1.5 1.5 2.09695 1.5 2.83333V5.5M5.5 13.5H2.83333C2.09695 13.5 1.5 12.903 1.5 12.1667V9.5M9.5 1.5H12.1667C12.903 1.5 13.5 2.09695 13.5 2.83333V5.5M13.5 9.5V12.1667C13.5 12.903 12.903 13.5 12.1667 13.5H9.5" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
                <button
                    style={{ transform: 'rotate(360deg)' }}
                    className='py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in'
                    // onClick={onCollapse} 
                    title="Collapse">
                    <ChevronDown />
                </button>
            </div>
        </div>
    );
};

export default OutputNavBar; 