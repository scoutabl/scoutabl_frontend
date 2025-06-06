import { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fetchLanguageRuntimes, executeCode } from '@/api/monacoCodeApi'
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import JsonIcon from "@/assets/jsonIcon.svg?react"
import { Minimize } from 'lucide-react';
import PlayIcon from '@/assets/playIcon.svg?react'
import CheckIcon from '@/assets/checkIcon.svg?react'
import ChevronDown from "@/assets/chevron-down.svg?react"
import ResetIcon from '@/assets/resetIcon.svg?react'
import MaximizeIcon from '@/assets/maximizeIcon.svg?react'

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
    onCollapse, onFullscreen, onExitFullscreen,
    isEditorCollapsed, onReset
}) => {
    const [isOpen, setIsOpen] = useState(false)
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
        return (
            <div className="py-3 w-12 min-w-[52px] max-w-[52px] flex flex-col items-center gap-4 bg-purpleSecondary justify-between rounded-xl overflow-hidden">
                <div style={{ transform: 'rotate(180deg)' }}>
                    <span
                        className='text-sm font-medium text-greyPrimary'
                        style={{
                            writingMode: 'vertical-lr',
                            textOrientation: 'mixed',
                            transform: 'rotate(180deg)',
                            marginTop: 2
                        }}
                    >

                        Code
                    </span>
                    <JsonIcon style={{ transform: 'rotate(-90deg)' }} />
                </div>
            </div>
        );
    }

    return (
        <div className={cn('min-h-[51px] px-6 py-3 bg-purpleSecondary rounded-tl-2xl rounded-tr-2xl flex justify-between min-w-0 overflow-x-auto', {
            'rounded-2xl': isEditorCollapsed,
        })}>
            {/* language selector */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button
                        className="flex items-center gap-[6px] p-0 justify-between px-3 text-greyPrimary dark:text-greyPrimary"
                        disabled={loading || !!error}
                    >
                        <div className='h-6 w-6 grid place-content-center'>
                            <JsonIcon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-normal text-greyPrimary truncate">
                            {language}
                            <span className="text-xs text-greyPrimary font-normal ml-1">
                                {loading ? 'Loading...' : error ? 'Error' : (() => {
                                    const selected = languages.find(l => l.language === language || l.aliases?.includes(language));
                                    return selected ? selected.version : ''
                                })()}
                            </span>
                        </span>
                        <div className='h-6  w-6 grid place-content-center'>
                            <ChevronDown />
                        </div>
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
                                    ${isSelected ? "bg-[#E8DEFD] dark:bg-[#28203F] text-[#8B5CF6]" : "dark:bg-blackPrimary"}
                                    hover:bg-[#E8DEFD] dark:hover:bg-[#28203F] hover:text-[#8B5CF6]`
                                }
                            >
                                {(isSelected) && (
                                    <div className={`absolute left-0 top-0 h-full w-1 bg-[#8B5CF6] ${barRounding}`} />
                                )}
                                <div className={`absolute left-0 top-0 h-full w-1 bg-[#8B5CF6] opacity-0 group-hover:opacity-100 ${barRounding}`} />
                                <span className={`ml-4 ${isSelected ? "text-[#8B5CF6]" : "text-black dark:text-white"} group-hover:text-[#8B5CF6]`}>
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
                        className='flex gap-[6px] items-center py-2 px-3 rounded-xl hover:bg-white transition-all duration-300 ease-in group'
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-purple-600 rounded-full"></span>
                        ) : (
                            <PlayIcon className="play-icon dark:text-black" />
                        )}
                        <span className='text-greyPrimary font-normal text-sm code-navbar-btn-label'>Run</span>
                    </button>
                    <button className='flex gap-[6px] items-center py-2 px-3 rounded-xl hover:bg-white transition-all duration-300 ease-in group'>
                        <CheckIcon className='check-icon text-[#1EA378]' />
                        <span className='text-greyPrimary font-normal text-sm code-navbar-btn-label'>Submit</span>
                    </button>
                    <button
                        onClick={onReset}
                        className='flex gap-[6px] items-center py-2 px-3 rounded-xl hover:bg-white transition-all duration-300 ease-in group'
                    >
                        {/* <RotateCcw color='#EB5757' size={20} /> */}
                        <ResetIcon />
                        <span className='text-greyPrimary font-normal text-sm code-navbar-btn-label'>Reset</span>
                    </button>
                </div>
                {/* resize/collapse/fullscreen/exit-fullscreen buttons */}
                <div className='flex items-center gap-4'>
                    {/* Only show exit fullscreen if in fullscreen mode */}
                    {onExitFullscreen ? (
                        <button className='py-2 px-3 rounded-[8px] hover:bg-white transition-all duration-300 ease-in' onClick={onExitFullscreen} title="Exit Fullscreen">
                            <Minimize className="w-4 h-4 text-greyPrimary dark:text-greryPrimary group-hover:dark:text-greyPrimary" />
                        </button>
                    ) : (
                        <>
                            {/* collapse button */}
                            <button
                                className='h-8 w-8 grid place-content-center rounded-[8px] hover:bg-white transition-all duration-300 ease-in-out text-greyPrimary dark:text-greyPrimary'
                                onClick={onCollapse}
                                title={isEditorCollapsed ? "Expand Editor" : "Collapse Editor"}
                            >
                                <motion.div
                                    animate={{ rotate: isEditorCollapsed ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    style={{ display: 'inline-block' }}
                                >
                                    <ChevronDown />
                                </motion.div>
                            </button>
                            {/* fullscreen button */}
                            {onFullscreen && (
                                <button className='h-8 w-8 grid place-content-center rounded-[8px] hover:bg-white transition-all duration-300 ease-in' onClick={onFullscreen} title="Fullscreen">
                                    <MaximizeIcon className="dark:text-greyPrimary group-hover:dark:text-greyPrimary" />
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