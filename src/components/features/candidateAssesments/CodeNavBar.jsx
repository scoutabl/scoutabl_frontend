import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query';
import { submitCodeToBackend, pollSubmissionStatus } from '@/api/monacoCodeApi';
import { useEnums } from '@/context/EnumsContext';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fetchLanguageRuntimes, fetchLanguages } from '@/api/monacoCodeApi'
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import JsonIcon from "@/assets/jsonIcon.svg?react"
import { Minimize } from 'lucide-react';
import PlayIcon from '@/assets/playIcon.svg?react'
import CheckIcon from '@/assets/checkIcon.svg?react'
import ChevronDown from "@/assets/chevron-down.svg?react"
import ResetIcon from '@/assets/resetIcon.svg?react'
import MaximizeIcon from '@/assets/maximizeIcon.svg?react'

// Fixed code navbar code
const CodeNavBar = ({
    language, onSelect, editorRef, setOutput,
    testCases = [], userTestCases = [], inputVars = [],
    selectedCase, setActiveTab, setLoading, loading,
    collapsed,
    onCollapse, onFullscreen, onExitFullscreen,
    isEditorCollapsed, onReset, questionId
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [languages, setLanguages] = useState([])
    // const [language, setLanguage] = useState('python3')
    const [error, setError] = useState(null)

    const [shouldPoll, setShouldPoll] = useState(false)
    const { enums, enumsLoading } = useEnums()

    const [submissionId, setSubmissionId] = useState(null);

    useEffect(() => {
        console.log('Rendering CodeNavBar', {
            shouldPoll,
            submissionId,
            CQEvaluationStatus: enums?.enums?.CQEvaluationStatus
        });
    }, [shouldPoll, submissionId, enums]);

    useEffect(() => {
        if (collapsed) return;
        setLoading(true)
        setError(null)
        const getRuntimeLang = async () => {
            try {
                const data = await fetchLanguages();
                const languageNamesArr = data.results.map(lang => ({
                    id: lang.id,
                    name: lang.code
                }));
                setLanguages(languageNamesArr)
            }
            catch (err) {
                setError('Failed to load languages')
            } finally {
                setLoading(false)
            }
        }
        getRuntimeLang();
    }, [collapsed])

    // useEffect(() => {
    //     if (collapsed) return;
    //     const getRuntimes = async () => {
    //         setLoading && setLoading(true)
    //         setError(null)
    //         try {
    //             const data = await fetchLanguageRuntimes();
    //             // Filter to allowed languages only
    //             const filtered = ALLOWED_LANGUAGES.map(({ key, display }) => {
    //                 // Find the best match in the fetched data
    //                 const match = data.find(l => l.language === key || l.aliases?.includes(key));
    //                 return match ? { ...match, display } : null;
    //             }).filter(Boolean);
    //             setLanguage(filtered)
    //             console.log('filtered lag', filtered)
    //         } catch (err) {
    //             setError('Failed to load languages')
    //         } finally {
    //             setLoading && setLoading(false)
    //         }
    //     }
    //     getRuntimes();
    // }, [collapsed])

    const handleSelect = (lang) => {
        onSelect && onSelect(lang);
        setIsOpen(false)
    }

    // Submit code mutation
    const submitMutation = useMutation({
        mutationFn: submitCodeToBackend,
        onSuccess: (data) => {
            setSubmissionId(data.id);
            setShouldPoll(true);
            console.log('Polling enabled! submissionId:', data.id);
        },
        onError: () => setLoading && setLoading(false),
    });

    // Polling for result
    const { data: pollData, isFetching } = useQuery({
        queryKey: ["pollSubmission", questionId, submissionId],
        queryFn: () => pollSubmissionStatus({ questionId, submissionId }),
        enabled: shouldPoll && !!enums?.enums?.CQEvaluationStatus && !!submissionId,
        refetchInterval: (query) => {
            const data = query?.state?.data; // Use query.state.data instead of query.data
            console.log('refetchInterval called!', {
                data,
                shouldPoll,
                submissionId,
                status: data?.evaluation_status
            });

            // If no data yet, continue polling
            if (!data || !enums?.enums?.CQEvaluationStatus) {
                return 2000;
            }

            const status = data.evaluation_status;
            const { COMPLETED, ERROR } = enums.enums.CQEvaluationStatus;

            console.log('Checking status:', status, 'COMPLETED:', COMPLETED, 'ERROR:', ERROR);

            // Stop polling if completed or error
            if (status === COMPLETED || status === ERROR) {
                console.log('Stopping polling - status is final');
                return false; // This stops the polling
            }

            // Continue polling
            return 2000;
        },
    });

    // Handle final result when polling data changes
    useEffect(() => {
        if (!pollData || !enums?.enums?.CQEvaluationStatus || !enums?.enums?.CQEvaluationResult) {
            return;
        }

        const status = pollData.evaluation_status;
        const { COMPLETED, ERROR } = enums.enums.CQEvaluationStatus;

        console.log('useEffect - Status:', status, 'COMPLETED:', COMPLETED, 'ERROR:', ERROR);

        if (status === COMPLETED || status === ERROR) {
            setShouldPoll(false); // Stop polling
            console.log('Polling stopped in useEffect!');
            setLoading && setLoading(false);

            // Map status/result to readable text
            const statusText = Object.keys(enums.enums.CQEvaluationStatus).find(
                (key) => enums.enums.CQEvaluationStatus[key] === pollData.evaluation_status
            );

            const resultText = pollData.evaluation_result !== null && pollData.evaluation_result !== undefined
                ? Object.keys(enums.enums.CQEvaluationResult).find(
                    (key) => enums.enums.CQEvaluationResult[key] === pollData.evaluation_result
                )
                : null;

            console.log('resultText:', resultText);
            const evaluation = pollData.evaluations?.[0] || {};

            const outputData = {
                status: statusText,
                result: resultText,
                ...pollData,
                ...evaluation,
            };

            console.log('Setting output:', [outputData]);

            setOutput && setOutput([outputData]);
        }
    }, [pollData, enums, setLoading, setOutput]);

    // Run code handler
    const handleRunCode = async () => {
        if (collapsed || enumsLoading) return;
        setLoading && setLoading(true);
        setActiveTab && setActiveTab("results");
        const sourceCode = editorRef?.current?.getValue?.();
        if (!sourceCode) {
            setLoading && setLoading(false);
            return;
        }

        // Reset polling state before new submission
        setShouldPoll(false);
        setSubmissionId(null);

        // Do NOT inject variables for your backend
        const injectedCode = sourceCode;

        const allCases = [...(testCases || []), ...(userTestCases || [])];
        const tc = allCases[selectedCase] || allCases[0];

        const languageId = 6; // JS (adjust as needed)

        const payload = {
            code: injectedCode,
            language: languageId,
            is_test: true,
            custom_testcases: [
                {
                    input: JSON.stringify(tc.input),
                    output: String(tc.output),
                },
            ],
        };
        submitMutation.mutate({ questionId, payload });
    };


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
                        const lang = langObj.name;
                        const isSelected = lang === language;
                        const isFirst = idx === 0;
                        const isLast = idx === language.length - 1;
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
                                    {lang}
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