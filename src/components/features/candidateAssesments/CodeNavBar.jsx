import { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Play, RotateCcw, Braces } from 'lucide-react';
import { FaCheckCircle } from "react-icons/fa";
import { fetchLanguageRuntimes, executeCode } from '@/api/monacoCodeApi'

const ALLOWED_LANGUAGES = [
    { key: 'python', display: 'Python 3' },
    { key: 'javascript', display: 'JavaScript' },
    { key: 'typescript', display: 'TypeScript' },
    { key: 'csharp', display: 'C#' },
    { key: 'c++', display: 'C++' },
    { key: 'java', display: 'Java' },
    { key: 'go', display: 'Go' },
    { key: 'php', display: 'PHP' },
];

const CodeNavBar = ({
    language, onSelect, editorRef, setOutput,
    testCases = [], userTestCases = [], inputVars = [],
    selectedCase, setActiveTab, setLoading, loading, callPattern,
    collapsed,
    onCollapse, onExpand, onFullscreen, onExitFullscreen
}) => {
    const [open, setIsOpen] = useState(false)
    const [languages, setLanguages] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (collapsed) return;
        const getRuntimes = async () => {
            setLoading && setLoading(true)
            setError(null)
            try {
                const data = await fetchLanguageRuntimes();
                // Filter to allowed languages only
                const filtered = ALLOWED_LANGUAGES.map(({ key, display }) => {
                    // Find the best match in the fetched data
                    const match = data.find(l => l.language === key || l.aliases?.includes(key));
                    return match ? { ...match, display } : null;
                }).filter(Boolean);
                setLanguages(filtered)
            } catch (err) {
                setError('Failed to load languages')
            } finally {
                setLoading && setLoading(false)
            }
        }
        getRuntimes();
    }, [collapsed])

    const handleSelect = (lang) => {
        onSelect && onSelect(lang);
        setIsOpen(false)
    }

    //run code
    const handleRunCode = async () => {
        if (collapsed) return;
        setLoading && setLoading(true);
        setActiveTab && setActiveTab('results');
        const sourceCode = editorRef?.current?.getValue?.();
        if (!sourceCode) {
            setLoading && setLoading(false);
            return;
        }
        const selected = languages.find(l => l.language === language || l.aliases?.includes(language));
        const version = selected?.version;
        if (!version) {
            setLoading && setLoading(false);
            return;
        }
        const allCases = [...(testCases || []), ...(userTestCases || [])];
        const tc = allCases[selectedCase] || allCases[0];
        let injectedCode = sourceCode;
        if (language === 'javascript') {
            let varLines = '';
            if (inputVars.length === 1) {
                varLines = `let ${inputVars[0]} = ${JSON.stringify(tc.input)};`;
            } else {
                varLines = inputVars.map((v, i) => `let ${v} = ${JSON.stringify(tc.input[i])};`).join('\n');
            }
            injectedCode = `${varLines}\n${sourceCode}\n${callPattern}`;
        }
        try {
            const start = Date.now();
            const response = await executeCode(language, injectedCode, version);
            const end = Date.now();
            const runtime = end - start;
            const normalize = v => (v === undefined || v === null) ? '' : String(v).trim();
            const isCorrect = normalize(response.run.output) === normalize(tc.output);
            setOutput && setOutput([{
                input: inputVars.length === 1
                    ? [{ name: inputVars[0], value: tc.input }]
                    : inputVars.map((v, i) => ({ name: v, value: tc.input[i] })),
                expected: tc.output,
                stdout: response.run.stdout?.trim() ?? '',
                output: response.run.output?.trim() ?? '',
                isCorrect,
                runtime,
            }]);
        } finally {
            setLoading && setLoading(false);
        }
    }

    if (collapsed) {
        // Render vertical icon-only navbar, with expand and fullscreen buttons
        return (
            <div className="flex flex-col items-center justify-center gap-6 h-full w-full bg-white">
                <button title="Language" className="p-2 rounded hover:bg-gray-800">
                    <Braces color='#fff' size={24} />
                </button>
                <button title="Run" className="p-2 rounded hover:bg-gray-800">
                    <Play color='#fff' size={24} />
                </button>
                <button title="Submit" className="p-2 rounded hover:bg-gray-800">
                    <FaCheckCircle color='#1EA378' size={24} />
                </button>
                <button title="Reset" className="p-2 rounded hover:bg-gray-800">
                    <RotateCcw color='#EB5757' size={24} />
                </button>
                {/* Expand button */}
                {onExpand && (
                    <button title="Expand" className="p-2 rounded hover:bg-gray-800" onClick={onExpand}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 8V5H8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                            <path d="M15 12V15H12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                            <path d="M5 5L10 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                )}
                {/* Fullscreen button */}
                {onFullscreen && (
                    <button title="Fullscreen" className="p-2 rounded hover:bg-gray-800" onClick={onFullscreen}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="14" height="14" rx="2" stroke="#fff" strokeWidth="2" />
                            <path d="M7 7H13V13H7V7Z" stroke="#fff" strokeWidth="2" />
                        </svg>
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className='px-6 py-3 bg-purpleSecondary rounded-tl-2xl rounded-tr-2xl flex justify-between min-w-0 overflow-x-auto code-navbar-container'>
            {/* language selector */}
            <Popover open={open} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button
                        className="flex items-center gap-[6px] p-0 justify-between px-3"
                        disabled={loading || !!error}
                    >
                        <Braces color='#333333' size={20} />
                        <span className="text-sm font-normal text-greyPrimary truncate">
                            {language}
                            <span className="text-xs text-greyPrimary font-normal ml-1">
                                {loading ? 'Loading...' : error ? 'Error' : (() => {
                                    const selected = languages.find(l => l.language === language || l.aliases?.includes(language));
                                    return selected ? selected.version : ''
                                })()}
                            </span>
                        </span>
                        <ChevronDown />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="rounded-2xl flex flex-col p-0 max-w-[180px] ml-8" sideOffset={12} >
                    {loading && <div className="p-4 text-center text-sm">Loading...</div>}
                    {error && <div className="p-4 text-center text-sm text-red-500">{error}</div>}
                    {!loading && !error && languages.map((langObj, idx) => {
                        const lang = langObj.language;
                        const display = langObj.display || lang;
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
                                    {display} <span className="ml-2 text-xs text-gray-400">{langObj.version}</span>
                                </span>
                            </div>
                        );
                    })}
                </PopoverContent>
            </Popover>
            <div className='flex items-center gap-12'>
                {/* runtime buttons */}
                <div className='flex items-center gap-3'>
                    <button
                        onClick={handleRunCode}
                        className='flex gap-[6px] items-center py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in'
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-purple-600 rounded-full"></span>
                        ) : (
                            <Play color='#333333' size={20} />
                        )}
                        <span className='text-greyPrimary font-normal text-sm code-navbar-btn-label'>Run</span>
                    </button>
                    <button className='flex gap-[6px] items-center py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in'>
                        <FaCheckCircle color='#1EA378' size={20} />
                        <span className='text-greyPrimary font-normal text-sm code-navbar-btn-label'>Submit</span>
                    </button>
                    <button className='flex gap-[6px] items-center py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in'>
                        <RotateCcw color='#EB5757' size={20} />
                        <span className='text-greyPrimary font-normal text-sm code-navbar-btn-label'>Reset</span>
                    </button>
                </div>
                {/* resize/collapse/fullscreen/exit-fullscreen buttons */}
                <div className='flex items-center gap-4'>
                    {/* Only show exit fullscreen if in fullscreen mode */}
                    {onExitFullscreen ? (
                        <button className='py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in' onClick={onExitFullscreen} title="Exit Fullscreen">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.833 5.5H5.5V2.833M12.167 9.5H9.5V12.167M5.5 2.833L1.5 6.833M9.5 12.167L13.5 8.167" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    ) : (
                        <>
                            {/* collapse button */}
                            {onCollapse && (
                                <button className='py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in' onClick={onCollapse} title="Collapse">
                                    <ChevronDown />
                                </button>
                            )}
                            {/* fullscreen button */}
                            {onFullscreen && (
                                <button className='py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in' onClick={onFullscreen} title="Fullscreen">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.5 1.5H2.83333C2.09695 1.5 1.5 2.09695 1.5 2.83333V5.5M5.5 13.5H2.83333C2.09695 13.5 1.5 12.903 1.5 12.1667V9.5M9.5 1.5H12.1667C12.903 1.5 13.5 2.09695 13.5 2.83333V5.5M13.5 9.5V12.1667C13.5 12.903 12.903 13.5 12.1667 13.5H9.5" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CodeNavBar