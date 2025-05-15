import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Play, RotateCcw, Braces } from 'lucide-react';
import { FaCheckCircle } from "react-icons/fa";
import { LANGUAGE_VERSIONS } from '@/lib/constants'
import { toast } from "sonner"
import { executeCode } from '@/api/monacoCodeApi'
const CodeNavBar = ({ language, onSelect, editorRef, setOutput }) => {
    const [open, setIsOpen] = useState(false)

    const languages = Object.entries(LANGUAGE_VERSIONS)

    const handleSelect = (lang) => {
        onSelect(lang);
        setIsOpen(false)
    }

    //run code
    const handleRunCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) {
            toast.error("Please write some code first")
            return;
        }
        try {
            const { run: result } = await executeCode(language, sourceCode);
            setOutput(result?.output || result?.error || "No output")
        } catch (error) {
            console.error("Error running code:", error);
            toast.error("An error occurred while running the code")
        }
    }

    return (
        <div className='flex justify-between'>
            {/* language selector */}
            <Popover open={open} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    {/* <button
                        className="flex items-center gap-[6px] p-0 w-fit justify-between"
                    >
                        <span className="text-sm text-greyPrimary font-medium ml-1">{language}&nbsp;({LANGUAGE_VERSIONS[language]})</span>
                        <ChevronDown />
                    </button> */}
                    <button
                        className="flex items-center gap-[6px] p-0 justify-between px-3"
                    >
                        <Braces color='#333333' size={20} />
                        <span className="text-sm font-normal text-greyPrimary truncate">
                            {language}
                            <span className="text-xs text-greyPrimary font-normal ml-1">({LANGUAGE_VERSIONS[language]})</span>
                        </span>
                        <ChevronDown />
                    </button>
                </PopoverTrigger>

                <PopoverContent className="rounded-2xl flex flex-col p-0 max-w-[180px] ml-8" sideOffset={12} >
                    {
                        languages.map(([lang], idx) => {
                            const isSelected = lang === language;
                            const isFirst = idx === 0;
                            const isLast = idx === languages.length - 1;
                            const barRounding = isFirst && isLast
                                ? "rounded-tr-2xl rounded-br-2xl"
                                : isFirst
                                    ? "rounded-tr-2xl"
                                    : isLast
                                        ? "rounded-br-2xl"
                                        : "";

                            return (
                                <div
                                    key={lang}
                                    onClick={() => handleSelect(lang)}
                                    className={`group py-3 flex items-center relative cursor-pointer first:rounded-t-2xl last:rounded-b-2xl overflow-hidden pl-0
                                        ${isSelected ? "bg-[#E8DEFD] text-[#8B5CF6]" : ""}
                                        hover:bg-[#E8DEFD] hover:text-[#8B5CF6]`
                                    }
                                >
                                    {(isSelected) && (
                                        <div className={`absolute left-0 top-0 h-full w-1 bg-[#8B5CF6] ${barRounding}`} />
                                    )}
                                    <div className={`absolute left-0 top-0 h-full w-1 bg-[#8B5CF6] opacity-0 group-hover:opacity-100 ${barRounding}`} />
                                    <span className={`ml-4 ${isSelected ? "text-[#8B5CF6]" : "text-black"} group-hover:text-[#8B5CF6]`}>
                                        {lang}
                                    </span>
                                </div>
                            ); Braces
                        })
                    }
                </PopoverContent>
            </Popover>
            <div className='flex items-center gap-12'>
                {/* runtime buttons */}
                <div className='flex items-center gap-3'>
                    <button onClick={handleRunCode} className='flex gap-[6px] items-center py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in'>
                        <Play color='#333333' size={20} />
                        <span className='text-greyPrimary font-normal text-sm'>Run</span>
                    </button>
                    <button className='flex gap-[6px] items-center py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in'>
                        <FaCheckCircle color='#1EA378' size={20} />
                        <span className='text-greyPrimary font-normal text-sm'>Submit</span>
                    </button>
                    <button className='flex gap-[6px] items-center py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in'>
                        <RotateCcw color='#EB5757' size={20} />
                        <span className='text-greyPrimary font-normal text-sm'>Reset</span>
                    </button>
                </div>
                {/* resize buttons */}
                <div className='flex items-center gap-4'>
                    <button>
                        <ChevronDown />
                    </button>
                    <button>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 1.5H2.83333C2.09695 1.5 1.5 2.09695 1.5 2.83333V5.5M5.5 13.5H2.83333C2.09695 13.5 1.5 12.903 1.5 12.1667V9.5M9.5 1.5H12.1667C12.903 1.5 13.5 2.09695 13.5 2.83333V5.5M13.5 9.5V12.1667C13.5 12.903 12.903 13.5 12.1667 13.5H9.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round" />
                        </svg>

                    </button>
                </div>
            </div>
        </div>
    )
}

export default CodeNavBar