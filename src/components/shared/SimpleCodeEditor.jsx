import { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import JsonIcon from "@/assets/jsonIcon.svg?react"
import ChevronDown from "@/assets/chevron-down.svg?react"
export default function SimpleCodeEditor({ value, onChange, height = 350, languages, loading }) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const [selectedLang, setSelectedLang] = useState(languages && languages.length > 0 ? languages[0] : null);
    const monacoLanguageMap = {
        python3: 'python',
        python: 'python',
        nodejs: 'javascript',
        js: 'javascript',
        javascript: 'javascript',
        cpp: 'cpp',
        java: 'java',
        csharp: 'csharp',
        ruby: 'ruby',
        go: 'go',
        php: 'php',
        swift: 'swift',
        kotlin: 'kotlin',
    };
    useEffect(() => {
        if (languages && languages.length > 0) {
            setSelectedLang(languages[0]);
            console.log("selectedLang", selectedLang?.default_template?.content);
        }
    }, [languages]);
    return (
        <div>
            <div>
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
                                {selectedLang ? selectedLang.name : ''}
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
                            const isSelected = selectedLang && lang === selectedLang.name;
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
                                    key={idx}
                                    onClick={() => {
                                        setSelectedLang(langObj);
                                        setIsOpen(false);
                                    }}
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
            </div>
            <div className={isOpen ? 'pointer-events-none' : ''}>
                <Editor
                    height={height}
                    language={
                        selectedLang && selectedLang.name
                            ? monacoLanguageMap[selectedLang.name.toLowerCase().replace(/ /g, '')] || 'plaintext'
                            : 'plaintext'
                    }
                    defaultValue={selectedLang?.default_template?.content || ''}
                    theme="light"
                    value={
                        selectedLang && selectedLang.name && value ? value[selectedLang.name] || '' : ''
                    }
                    onChange={code => {
                        if (selectedLang && selectedLang.name) {
                            onChange({ ...value, [selectedLang.name]: code });
                        }
                    }}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        fixedOverflowWidgets: true,
                    }}
                />
            </div>
        </div>
    );
}