import { useRef, useState, useEffect } from 'react';
import JsonIcon from "@/assets/jsonIcon.svg?react"
import ChevronDown from "@/assets/chevron-down.svg?react"

const CustomDropdown = ({ languages, selectedLang, setSelectedLang, loading }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [error, setError] = useState(null);
    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center gap-2 rounded bg-purpleSecondary"
                disabled={loading}
                onClick={() => setOpen((prev) => !prev)}
                type="button"
            >
                <JsonIcon className="h-6 w-6" />
                <span className="text-sm">{selectedLang ? selectedLang.name : "Select Language"}</span>
                <ChevronDown />
            </button>
            {open && (
                <div className="absolute -left-5 mt-4 w-44 bg-white border shadow-lg z-[99999] rounded-2xl flex flex-col p-0 max-w-[180px]">
                    {/* {languages.map((langObj, idx) => (
                        <div
                            key={langObj.id || idx}
                            className={`px-4 py-2 cursor-pointer hover:bg-purple-100 ${selectedLang && langObj.name === selectedLang.name ? "bg-purple-50 text-purple-700" : ""}`}
                            onClick={() => {
                                setSelectedLang(langObj);
                                setOpen(false);
                            }}
                        >
                            {langObj.name}
                        </div>
                    ))} */}
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
                                    setOpen(false);
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
                </div>
            )
            }
        </div >
    );
};

export default CustomDropdown;