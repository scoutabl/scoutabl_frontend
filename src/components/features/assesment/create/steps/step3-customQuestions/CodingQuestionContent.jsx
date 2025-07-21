import { useState, useEffect } from "react";
import { useForm, FormProvider, Controller, useWatch } from "react-hook-form";
import { CircleAlert, Eye, EyeOff, X } from 'lucide-react';
import { motion } from "framer-motion";
import { toast } from "sonner"
import RichTextEditor from "@/components/RichTextEditor";
import SearchInput from "@/components/shared/debounceSearch/SearchInput";
import { useLanguages } from "@/api/monacoCodeApi";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import MultipleSelector from "@/components/ui/MultipleSelector";
import SimpleCodeEditor from "@/components/shared/SimpleCodeEditor";
import { cn } from "@/lib/utils";
import AiIcon from '@/assets/AiIcon.svg?react'
import ChevronLeftIcon from '@/assets/chevronLeftIcon.svg?react'
import ChevronRightIcon from '@/assets/chevronRightIcon.svg?react'
import EditIcon from '@/assets/editIcon.svg?react'
import CodeIcon from '@/assets/codeIcon.svg?react'
import QuestionIcon from '@/assets/questionIcon.svg?react'
import EditTestIcon from '@/assets/editquestion.svg?react';
import DeleteIcon from '@/assets/trashIcon.svg?react';
import UploadZipICon from '@/assets/uploadZipICon.svg?react';
import PlusIcon from '@/assets/plusIcon.svg?react'
const questionTagsList = [
    { value: "arrays", label: "Arrays" },
    { value: "recursion", label: "Recursion" },
    { value: "iteration", label: "Iteration" },
    { value: "functions", label: "Functions" },
    { value: "conditionals", label: "Conditionals" },
    { value: "inheritance", label: "Inheritance" },
    { value: "promises", label: "Promises" },
    { value: "memoization", label: "Memoization" },
];

const steps = [
    { id: 1, title: "Question Details" },
    { id: 2, title: "Select Languages" },
    { id: 3, title: "Code Stubs" },
    { id: 4, title: "Test Cases" },
];

// const defaultValues = (initialData, initialQuestion, allLanguages, selectedLanguages) => {
//     const codeStubs = {};
//     if (allLanguages && selectedLanguages) {
//         for (const lang of allLanguages.results) {
//             if (selectedLanguages.includes(lang.id)) {
//                 codeStubs[lang.name] = lang.default_template.content || '';
//             }
//         }
//     }
//     return {
//         question: initialData?.question || initialQuestion || '',
//         difficulty: initialData?.difficulty || '1',
//         inputFormats: initialData?.inputFormats || '',
//         constraints: initialData?.constraints || '',
//         outputFormats: initialData?.outputFormats || '',
//         tags: initialData?.tags || [],
//         selectedLanguages: [],
//         codeStubs,
//     };
// };
const defaultValues = (initialData, initialQuestion, allLanguages, selectedLanguages) => {
    const codeStubs = {};
    if (allLanguages && selectedLanguages) {
        for (const lang of allLanguages.results) {
            if (selectedLanguages.includes(lang.id)) {
                codeStubs[lang.name] = lang.default_template.content || '';
            }
        }
    }
    return {
        question: initialData?.question || initialQuestion || '',
        difficulty: initialData?.difficulty || '1',
        inputFormats: initialData?.inputFormats || '',
        constraints: initialData?.constraints || '',
        outputFormats: initialData?.outputFormats || '',
        tags: initialData?.tags || [],
        selectedLanguages: [],
        codeStubs,
        // Include these fields that were in the original form
        customScore: 10,
        saveToLibrary: false,
        enablePrecisionCheck: false,
        disableCompile: false,
        testCases: [],
    };
};
const languageFileExtensions = {
    "python3": "py",
    "swift": "swift",
    "kotlin": "kt",
    "java": "java",
    "cpp": "cpp",
    "nodejs": "js",
    "csharp": "cs",
    "ruby": "rb",
    "go": "go",
    "php": "php",
    // Add more as needed
};

const CodingQuestionContent = ({
    initialData = {},
    initialQuestion = '',
    form, // Accept form instance from parent
    onSubmit // Accept onSubmit handler from parent
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const methods = useForm({
        mode: 'onTouched',
        defaultValues: {
            ...defaultValues(initialData, initialQuestion),
            customScore: 10,
            saveToLibrary: false,
            enablePrecisionCheck: false,
            disableCompile: false,
            testCases: [],
        },
    });
    const { control, register, handleSubmit, clearErrors, trigger, setValue, reset, getValues, watch, formState: { errors } } = form;

    // Fetch languages at the top level
    const { data: allLanguages, isLoading: isLanguagesLoading, error: languagesError } = useLanguages();
    // Move langOverrides to parent
    const [langOverrides, setLangOverrides] = useState({}); // { [langId]: { timeLimit, memoryLimit } }

    const selectedLanguages = methods.watch('selectedLanguages');

    // Initialize form with default values when languages are loaded
    useEffect(() => {
        if (allLanguages && !getValues('selectedLanguages')?.length) {
            const defaults = defaultValues(initialData, initialQuestion, allLanguages, []);
            reset({
                ...getValues(),
                ...defaults
            });
        }
    }, [allLanguages, initialData, initialQuestion, reset, getValues]);

    useEffect(() => {
        if (allLanguages && selectedLanguages && selectedLanguages.length > 0) {
            const currentStubs = getValues('codeStubs') || {};
            const newStubs = { ...currentStubs };

            let changed = false;

            // Get the selected language IDs (handle both ID array and object array)
            const selectedIds = selectedLanguages.map(item =>
                typeof item === 'object' ? item.id : item
            );

            for (const lang of allLanguages.results) {
                if (selectedIds.includes(lang.id) && newStubs[lang.name] === undefined) {
                    newStubs[lang.name] = lang.default_template?.content || '';
                    changed = true;
                }
            }

            // Remove stubs for languages that are no longer selected
            Object.keys(newStubs).forEach(langName => {
                if (!selectedIds.some(id => {
                    const lang = allLanguages.results.find(l => l.id === id);
                    return lang && lang.name === langName;
                })) {
                    delete newStubs[langName];
                    changed = true;
                }
            });

            if (changed) {
                setValue('codeStubs', newStubs);
            }
        }
    }, [allLanguages, selectedLanguages, getValues, setValue]);

    // useEffect(() => {
    //     if (allLanguages && selectedLanguages && selectedLanguages.length > 0) {
    //         const currentStubs = methods.getValues('codeStubs') || {};
    //         const newStubs = { ...currentStubs };

    //         let changed = false;

    //         // Get the selected language IDs (handle both ID array and object array)
    //         const selectedIds = selectedLanguages.map(item =>
    //             typeof item === 'object' ? item.id : item
    //         );

    //         for (const lang of allLanguages.results) {
    //             if (selectedIds.includes(lang.id) && newStubs[lang.name] === undefined) {
    //                 newStubs[lang.name] = lang.default_template?.content || '';
    //                 changed = true;
    //             }
    //         }

    //         // Remove stubs for languages that are no longer selected
    //         Object.keys(newStubs).forEach(langName => {
    //             if (!selectedIds.some(id => {
    //                 const lang = allLanguages.results.find(l => l.id === id);
    //                 return lang && lang.name === langName;
    //             })) {
    //                 delete newStubs[langName];
    //                 changed = true;
    //             }
    //         });

    //         if (changed) {
    //             methods.reset({
    //                 ...methods.getValues(),
    //                 codeStubs: newStubs,
    //             });
    //         }
    //     }
    // }, [allLanguages, selectedLanguages, methods]);

    // useEffect(() => {
    //     if (allLanguages && selectedLanguages && selectedLanguages.length > 0) {
    //         const currentStubs = methods.getValues('codeStubs') || {};
    //         const newStubs = { ...currentStubs };

    //         let changed = false;
    //         for (const lang of allLanguages.results) {
    //             if (selectedLanguages.includes(lang.id) && newStubs[lang.name] === undefined) {
    //                 newStubs[lang.name] = lang.default_template?.content || '';
    //                 changed = true;
    //             }
    //         }
    //         // Remove stubs for languages that are no longer selected
    //         Object.keys(newStubs).forEach(langName => {
    //             if (!selectedLanguages.some(id => {
    //                 const lang = allLanguages.results.find(l => l.id === id);
    //                 return lang && lang.name === langName;
    //             })) {
    //                 delete newStubs[langName];
    //                 changed = true;
    //             }
    //         });

    //         if (changed) {
    //             methods.reset({
    //                 ...methods.getValues(),
    //                 codeStubs: newStubs,
    //             });
    //         }
    //     }
    // }, [allLanguages, selectedLanguages, methods]);

    const handleNext = async () => {
        let fieldsToValidate = [];
        if (currentStep === 1) {
            fieldsToValidate = [
                'question',
                'difficulty',
                'inputFormats',
                'constraints',
                'outputFormats',
                'tags',
            ];
        } else if (currentStep === 2) {
            fieldsToValidate = ['selectedLanguages'];
        } else if (currentStep) {
            fieldsToValidate = ['codeStubs'];
        }
        // Add fields for other steps as needed
        const valid = await trigger(fieldsToValidate);
        // if (valid) {
        //     // If moving from step 2 to 3, transform selectedLanguages from IDs to objects (only if not already objects)
        //     const selectedLangsRaw = methods.getValues('selectedLanguages');
        //     if (
        //         currentStep === 2 &&
        //         allLanguages &&
        //         selectedLangsRaw &&
        //         typeof selectedLangsRaw[0] !== 'object'
        //     ) {
        //         const selectedIds = selectedLangsRaw;
        //         const popularLanguages = ["Python 3", "Java", "C++", "NodeJS", "PHP", "C#"];
        //         // Use langResultMap so fileExtension is included
        //         const langResultMap = allLanguages?.results.map(lang => {
        //             const override = langOverrides[lang.id] || {};
        //             return {
        //                 id: lang.id,
        //                 name: lang.name,
        //                 timeLimit: override.timeLimit ?? lang.default_time_limit_seconds,
        //                 memoryLimit: override.memoryLimit ?? lang.default_memory_limit_mb,
        //                 defaultTemplate: lang.default_template.content,
        //                 isPopular: popularLanguages.includes(lang.name),
        //                 fileExtension: languageFileExtensions[lang.code] || "",
        //             };
        //         });
        //         const selectedLanguageObjects = selectedIds
        //             .map(id => langResultMap.find(l => l.id === id))
        //             .filter(Boolean);
        //         methods.setValue('selectedLanguages', selectedLanguageObjects);
        //     }
        //     setCurrentStep((s) => s + 1);
        // }
        // else {
        //     // Show toast for each error in the current step
        //     fieldsToValidate.forEach(field => {
        //         if (errors[field]) {
        //             toast.error(errors[field].message || "This field is required");
        //         }
        //     });
        // }
        if (valid) {
            // If moving from step 2 to 3, transform selectedLanguages from IDs to objects
            const selectedLangsRaw = getValues('selectedLanguages');
            if (
                currentStep === 2 &&
                allLanguages &&
                selectedLangsRaw &&
                selectedLangsRaw.length > 0 &&
                typeof selectedLangsRaw[0] !== 'object'
            ) {
                const selectedIds = selectedLangsRaw;
                const popularLanguages = ["Python 3", "Java", "C++", "NodeJS", "PHP", "C#"];

                const langResultMap = allLanguages?.results.map(lang => {
                    const override = langOverrides[lang.id] || {};
                    return {
                        id: lang.id,
                        name: lang.name,
                        timeLimit: override.timeLimit ?? lang.default_time_limit_seconds,
                        memoryLimit: override.memoryLimit ?? lang.default_memory_limit_mb,
                        defaultTemplate: lang.default_template.content,
                        isPopular: popularLanguages.includes(lang.name),
                        fileExtension: languageFileExtensions[lang.code] || "",
                    };
                });

                const selectedLanguageObjects = selectedIds
                    .map(id => langResultMap.find(l => l.id === id))
                    .filter(Boolean);

                setValue('selectedLanguages', selectedLanguageObjects);
            }
            setCurrentStep((s) => s + 1);
        } else {
            // Show toast for each error in the current step
            fieldsToValidate.forEach(field => {
                if (errors[field]) {
                    toast.error(errors[field].message || "This field is required");
                }
            });
        }
    };
    const handleBack = () => setCurrentStep((s) => s - 1);


    function Step1Content() {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <h3 className="flex text-base font-medium text-greyPrimary">Problem Statement<span className="text-dangerPrimary">*</span></h3>
                    <QuestionIcon />
                </div>
                <Controller
                    name="question"
                    control={control}
                    rules={{
                        required: 'Problem statement is required',
                        validate: value => {
                            const text = value.replace(/<[^>]+>/g, '').trim();
                            return text.length > 0 || 'Problem statement is required';
                        }
                    }}
                    render={({ field }) => (
                        <div>
                            <RichTextEditor {...field} content={field.value} onChange={field.onChange} wordCountToggle={false} />
                            {errors.question && <p className="text-dangerPrimary text-xs mt-1">{errors.question.message}</p>}
                        </div>
                    )}
                />
                <div className="flex items-center gap-4">
                    <label className="min-w-[220px] text-base font-medium text-greyPrimary">Difficulty Level</label>
                    <Controller
                        name="difficulty"
                        control={control}
                        rules={{ required: 'Difficulty is required' }}
                        render={({ field }) => (
                            <div className="w-[230px]">
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger chevronColor="text-greyAccent" className="!h-[42px] w-[230px] p-3 flex items-center justify-between text-xs font-normal bg-white text-greyPrimary rounded-md">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                        <SelectItem value="5">5</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.difficulty && <p className="text-dangerPrimary text-xs mt-1">{errors.difficulty.message}</p>}
                            </div>
                        )}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label htmlFor="input-formats" className="flex text-base font-medium text-greyPrimary">
                            Input Formats
                            <span className="text-dangerPrimary">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <div className="w-full">
                        <Input
                            type='text'
                            id="input-formats"
                            placeholder="nums=[1, 2, 3]"
                            className={cn('w-full', {
                                'border-dangerPrimary': errors.inputFormats
                            })}
                            {...register('inputFormats', { required: 'Input format is required' })}
                        />
                        {errors.inputFormats && <p className="text-dangerPrimary text-xs mt-1">{errors.inputFormats.message}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label htmlFor="constraints" className="flex text-base font-medium text-greyPrimary">
                            Constraints
                            <span className="text-dangerPrimary">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <div className="w-full">
                        <Input
                            type='text'
                            id="constraints"
                            placeholder="Constraints"
                            className={cn('w-full', {
                                'border-dangerPrimary': errors.constraints
                            })}
                            {...register('constraints', { required: 'Constraints are required' })}
                        />
                        {errors.constraints && <p className="text-dangerPrimary text-xs mt-1">{errors.constraints.message}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label htmlFor="output-formats" className="flex text-base font-medium text-greyPrimary">
                            Output Format
                            <span className="text-dangerPrimary">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <div className="w-full">
                        <Input
                            type='text'
                            id="output-formats"
                            placeholder="output"
                            className={cn('w-full', {
                                'border-dangerPrimary': errors.outputFormats
                            })}
                            {...register('outputFormats', { required: 'Output format is required' })}
                        />
                        {errors.outputFormats && <p className="text-dangerPrimary text-xs mt-1">{errors.outputFormats.message}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label className="flex text-base font-medium text-greyPrimary">
                            Question Tags
                            <span className="text-dangerPrimary">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <div className="w-full">
                        {/* <Controller
                            name="tags"
                            control={control}
                            rules={{ required: 'At least one tag is required', validate: v => v && v.length > 0 || 'At least one tag is required' }}
                            render={({ field }) => (
                                <MultipleSelector
                                    defaultOptions={questionTagsList}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select Quesiton Tags"
                                    emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">no results found.</p>}
                                    error={errors.tags}                                
                                />
                            )}
                        /> */}
                        <Controller
                            name="tags"
                            control={control}
                            rules={{
                                required: 'At least one tag is required',
                                validate: v => v && v.length > 0 || 'At least one tag is required'
                            }}
                            render={({ field }) => (
                                <MultipleSelector
                                    defaultOptions={questionTagsList}
                                    value={field.value}
                                    onChange={val => {
                                        field.onChange(val);
                                        if (val && val.length > 0) {
                                            clearErrors('tags');
                                        }
                                    }}
                                    placeholder="Select Quesiton Tags"
                                    emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">no results found.</p>}
                                    error={errors.tags}
                                />
                            )}
                        />
                        {errors.tags && <p className="text-dangerPrimary text-xs mt-1">{errors.tags.message}</p>}
                    </div>
                </div>
            </div>
        );
    }

    // Step2Content is now a pure component
    function Step2Content({
        allLanguages,
        isLanguagesLoading,
        languagesError,
        langOverrides,
        setLangOverrides
    }) {
        const [searchValue, setSearchValue] = useState('')
        const [showPopularOnly, setShowPopularOnly] = useState(false);
        const [editingLangId, setEditingLangId] = useState(null);
        const [editValues, setEditValues] = useState({});
        const popularLanguages = ["Python 3", "Java", "C++", "NodeJS", "PHP", "C#"];
        const langResultMap = allLanguages?.results.map(lang => {
            const override = langOverrides[lang.id] || {};
            return {
                id: lang.id,
                name: lang.name,
                timeLimit: override.timeLimit ?? lang.default_time_limit_seconds,
                memoryLimit: override.memoryLimit ?? lang.default_memory_limit_mb,
                defaultTemplate: lang.default_template.content,
                isPopular: popularLanguages.includes(lang.name),
                fileExtension: languageFileExtensions[lang.code] || "",
            };
        });
        let filteredLangs = langResultMap
            ?.filter(lang => lang.name.toLowerCase().includes(searchValue.toLowerCase()));
        if (showPopularOnly) {
            filteredLangs = filteredLangs?.filter(lang => lang.isPopular);
        }
        return (
            <div className="flex flex-col gap-6">
                <div className='flex flex-col gap-4'>
                    <div className='flex items-center justify-between'>
                        <SearchInput
                            searchValue={searchValue}
                            onChange={setSearchValue}
                            placeholder={"Search Languages"}
                        />
                        <Controller
                            name="selectedLanguages"
                            control={control}
                            rules={{
                                validate: value => (value && value.length > 0) || "Please select at least one language"
                            }}
                            render={({ field }) => (
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        className='w-[104px] h-[37px] grid place-content-center border border-purplePrimary text-sm text-purplePrimary font-medium bg-white rounded-full'
                                        whileHover={{ y: -3 }}
                                        whileTap={{ y: 1 }}
                                        onClick={e => {
                                            e.preventDefault();
                                            field.onChange([]);
                                        }}
                                    >
                                        Clear All
                                    </motion.button>
                                    <motion.button
                                        className='w-[104px] h-[37px] grid place-content-center border border-purplePrimary text-sm text-purplePrimary font-medium bg-[#EEE7FE] rounded-full'
                                        whileHover={{ y: -3 }}
                                        whileTap={{ y: 1 }}
                                        onClick={e => {
                                            e.preventDefault();
                                            // Replace the entire array with just the filtered language IDs
                                            field.onChange(filteredLangs?.map(lang => lang.id) || []);
                                        }}
                                    >
                                        Select All
                                    </motion.button>
                                    <motion.button
                                        className='px-6 w-fit h-[37px] flex items-center gap-2 bg-purplePrimary text-sm  text-white font-medium rounded-full text-center'
                                        whileHover={{ y: -3 }}
                                        whileTap={{ y: 1 }}
                                        onClick={e => {
                                            e.preventDefault();
                                            setShowPopularOnly(prev => !prev);
                                        }}
                                    >
                                        <CodeIcon className="h-4 w-4 text-white" />
                                        {showPopularOnly ? "Show All" : "Popular Languages"}
                                    </motion.button>
                                </div>
                            )}
                        />
                    </div>
                    <div className="p-3 grid grid-cols-4 gap-16 items-center rounded-xl">
                        {/* Header */}
                        <div className="font-medium">Language</div>
                        <div className="font-medium text-center">Time Limit (seconds)</div>
                        <div className="font-medium text-center">Memory Limit (mb)</div>
                        <div className="font-medium text-center">Edit / Save</div>
                    </div>
                    <Controller
                        name="selectedLanguages"
                        control={control}
                        rules={{
                            validate: value => (value && value.length > 0) || "Please select at least one language"
                        }}
                        render={({ field }) => (
                            <>
                                {filteredLangs?.map(lang => (
                                    <div key={lang.id} className="p-3 grid grid-cols-4  gap-16 items-center rounded-xl border border-seperatorPrimary bg-white hover:bg-purpleQuaternary transition-all duration-300 ease-in">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {/* <Checkbox
                                                    checked={field.value?.includes(lang.id)}
                                                    onCheckedChange={checked => {
                                                        if (checked) {
                                                            field.onChange([...(field.value || []), lang.id]);
                                                        } else {
                                                            field.onChange((field.value || []).filter(id => id !== lang.id));
                                                        }
                                                    }}
                                                /> */}
                                                <Checkbox
                                                    checked={field.value?.some(item =>
                                                        typeof item === 'object' ? item.id === lang.id : item === lang.id
                                                    )}
                                                    onCheckedChange={checked => {
                                                        if (checked) {
                                                            // Only add if not already present
                                                            const currentIds = field.value?.map(item =>
                                                                typeof item === 'object' ? item.id : item
                                                            ) || [];
                                                            if (!currentIds.includes(lang.id)) {
                                                                field.onChange([...currentIds, lang.id]);
                                                            }
                                                        } else {
                                                            // Remove the language
                                                            const newValue = field.value?.filter(item =>
                                                                typeof item === 'object' ? item.id !== lang.id : item !== lang.id
                                                            ) || [];
                                                            field.onChange(newValue);
                                                        }
                                                    }}
                                                />
                                                <span className="text-sm text-greyPrimary">{lang.name}</span>
                                            </div>
                                            {lang.isPopular && <span className="px-3 py-1 rounded-full border border-[#AECDB9] bg-[#E2F9E9] text-xs font-medium text-[#13482A]">
                                                Popular
                                            </span>}

                                        </div>
                                        {editingLangId === lang.id ? (
                                            <>
                                                <div className="w-full flex items-center justify-center">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-[67px] py-1 px-3 border rounded-md text-sm text-center border-[#CCCCCC]"
                                                        value={editValues.timeLimit}
                                                        onChange={e => setEditValues(ev => ({ ...ev, timeLimit: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="w-full flex items-center justify-center">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-[67px] py-1 px-3 border rounded-md text-sm text-center border-[#CCCCCC]"
                                                        value={editValues.memoryLimit}
                                                        onChange={e => setEditValues(ev => ({ ...ev, memoryLimit: e.target.value }))}
                                                    />
                                                </div>
                                                <button
                                                    className="ml-2 px-3 py-1 rounded-full border border-purplePrimary text-purplePrimary text-xs font-medium cursor-pointer hover:bg-purplePrimary hover:text-white transition-colors duration-300 ease-in"
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setLangOverrides(prev => ({
                                                            ...prev,
                                                            [lang.id]: {
                                                                timeLimit: editValues.timeLimit,
                                                                memoryLimit: editValues.memoryLimit
                                                            }
                                                        }));
                                                        setEditingLangId(null);
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="inline-block w-full text-greyPrimary text-sm text-center">{lang.timeLimit} s</span>
                                                <span className="inline-block w-full text-greyPrimary text-sm text-center ml-2">{lang.memoryLimit} mb</span>
                                                <button
                                                    className="flex items-center justify-center ml-2"
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setEditingLangId(lang.id);
                                                        setEditValues({
                                                            timeLimit: lang.timeLimit,
                                                            memoryLimit: lang.memoryLimit
                                                        });
                                                    }}
                                                >
                                                    <EditIcon className="w-4 h-4 cursor-pointer" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                    {errors.selectedLanguages && (
                        <p className="text-dangerPrimary text-xs mt-1">{errors.selectedLanguages.message}</p>
                    )}
                </div>
            </div>
        );
    }

    // Step3Content is now a pure component
    function Step3Content({
        allLanguages,
        isLanguagesLoading,
        languagesError,
        selectedLanguages,
        langOverrides
    }) {
        // Map selectedLanguages (IDs) to full language objects
        const selectedLangObjs = Array.isArray(selectedLanguages) && typeof selectedLanguages[0] === 'object'
            ? selectedLanguages
            : (allLanguages?.results || []).filter(lang =>
                (selectedLanguages || []).includes(lang.id)
            );
        const codeStubs = methods.getValues('codeStubs') || {};
        const allStubsReady = selectedLangObjs.every(lang => codeStubs[lang.name] !== undefined);

        console.log('selectedLanguageObjects:', selectedLangObjs);
        console.log('codeStubs:', codeStubs);
        console.log('allStubsReady:', allStubsReady);

        if (!allStubsReady) {
            return <div>Loading code stubs...</div>;
        }

        return (
            <Controller
                name="codeStubs"
                rules={{
                    validate: (stubs) => {
                        for (const lang of selectedLangObjs) {
                            if (!stubs?.[lang.name] || !stubs[lang.name].trim()) {
                                return `Code stub for ${lang.name} is required`;
                            }
                        }
                        return true;
                    }
                }}
                render={({ field, fieldState }) => (
                    <>
                        <SimpleCodeEditor
                            languages={selectedLangObjs}
                            loading={isLanguagesLoading}
                            error={languagesError}
                            value={field.value || {}}
                            onChange={field.onChange}
                        />
                        {fieldState.error && (
                            <p className="text-dangerPrimary text-xs mt-1">{fieldState.error.message}</p>
                        )}
                    </>
                )}
            />
        );
    }

    // Move testCases state to parent
    const [testCases, setTestCasesState] = useState([]);

    // Keep testCases in sync with React Hook Form
    useEffect(() => {
        setValue('testCases', testCases);
    }, [testCases, setValue]);

    // Helper to update testCases and sync with form
    const setTestCases = (cases) => {
        setTestCasesState(cases);
        setValue('testCases', cases);
    };

    function Step4Content({ testCases, setTestCases }) {
        const [modalOpen, setModalOpen] = useState(false);
        const [editingCase, setEditingCase] = useState(null);
        const [saveToLibrary, setSaveToLibrary] = useState(false);
        const [enablePrecisionCheck, setEnablePrecisionCheck] = useState(false);
        const [disableCompile, setDisableCompile] = useState(false);
        const [testCaseVisible, setTestCaseVisible] = useState(false);

        useEffect(() => {
            console.log("Test Cases:", testCases);
        }, [testCases]);

        const {
            control: addCaseControl,
            handleSubmit: handleAddCaseSubmit,
            reset: resetAddCaseForm,
            formState: { errors: addCaseErrors }
        } = useForm({
            defaultValues: {
                name: "",
                input: "",
                output: "",
                points: "",
                weightage: "",
                visible: false,
            }
        });

        // Watch form values for dynamic header
        const watchedName = useWatch({ control: addCaseControl, name: "name" });
        const watchedPoints = useWatch({ control: addCaseControl, name: "points" });
        const watchedVisible = useWatch({ control: addCaseControl, name: "visible" });

        // Add case handler
        const onAddCase = (data) => {
            if (editingCase !== null) {
                // Edit mode: update the test case at the index
                setTestCases(prev =>
                    prev.map((tc, idx) => idx === editingCase ? data : tc)
                );
            } else {
                // Add mode: add new test case
                setTestCases(prev => [...prev, data]);
            }
            resetAddCaseForm();
            setModalOpen(false);
            setEditingCase(null);
        };

        //remove test case
        const handleRemoveTestCase = (id) => {
            return () => {
                setTestCases(testCases.filter((_, index) => index !== id));
            };
        }
        //edit test case
        const handleEditTestCase = (id) => {
            return () => {
                const testCase = testCases[id];
                setEditingCase(id);
                resetAddCaseForm(testCase);
                setModalOpen(true);
            };
        }

        return (
            <div className="flex flex-col gap-6">
                <div>
                    {/* <div className="py-3 px-4 grid grid-cols-[minmax(170px,190px)_minmax(200px,210px)_minmax(200px,210px)_minmax(200px,210px)_minmax(230px,250px)] gap-4 items-center rounded-tl-xl rounded-tr-xl border border-seperatorPrimary"> */}
                    <div className="py-3 px-4 min-w-[600px] grid grid-cols-5 gap-4 items-center rounded-tl-xl rounded-tr-xl border border-seperatorPrimary">
                        <div className="text-sm font-semibold ">Testcase</div>
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-center">
                            Visibility
                            <QuestionIcon size={24} className="text-greyAccent" />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-center">Points
                            <QuestionIcon size={24} className="text-greyAccent" />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-center">
                            Weightage <QuestionIcon size={24} className="text-greyAccent" />
                        </div>
                        <div className="text-sm font-semibold text-center">Action</div>
                    </div>
                    {/* <div className="py-3 px-4 grid grid-cols-[minmax(170px,190px)_minmax(200px,210px)_minmax(200px,210px)_minmax(200px,210px)_minmax(230px,250px)] gap-4 items-center rounded-bl-xl rounded-br-xl border border-seperatorPrimary"> */}
                    {/* added test cases */}
                    {/* <div className="py-3 px-4 min-w-[600px] grid grid-cols-5 gap-4 items-center rounded-bl-xl rounded-br-xl border border-seperatorPrimary">
                        <span className="text-greyPrimary text-sm font-normal">Testcase 1</span>
                        <div className="flex items-center justify-center">
                            <div className="max-w-[74px] px-2 py-1 flex items-center text-center gap-1 bg-[#E2F9E9] rounded-full">
                                <Eye size={16} color="#13482A" />
                                <span className="text-[#13482A] text-xs font-medium">Public</span>
                            </div>
                        </div>
                        <span className="text-greyPrimary text-sm font-normal text-center">100</span>
                        <span className="text-greyPrimary text-sm font-normal text-center">100</span>
                        <div className="flex items-center justify-center gap-3">
                            <motion.button whileHover={{ y: -3 }}
                                whileTap={{ y: 1 }}
                            >
                                <EditTestIcon className="size-4" />
                            </motion.button>
                            <motion.button whileHover={{ y: -3 }}
                                whileTap={{ y: 1 }}
                            >
                                <DeleteIcon className="size-4" />
                            </motion.button>
                        </div>
                    </div> */}
                    {testCases.map((tc, idx) => (
                        <div key={idx} className="py-3 px-4 min-w-[600px] grid grid-cols-5 gap-4 items-center last:rounded-bl-xl last:rounded-br-xl border border-seperatorPrimary">
                            <span className="text-greyPrimary text-sm font-normal truncate">{tc.name}</span>
                            <div className="flex items-center justify-center">
                                {tc.visible ? (
                                    <div className="max-w-[74px] px-2 py-1 flex items-center text-center gap-1 bg-[#E2F9E9] rounded-full">
                                        <Eye size={16} color="#13482A" />
                                        <span className="text-[#13482A] text-xs font-medium">Public</span>
                                    </div>
                                ) : (
                                    <div className="max-w-[74px] px-2 py-1 flex items-center text-center gap-1 bg-seperatorPrimary rounded-full">
                                        <EyeOff size={16} color="#5C5C5C" />
                                        <span className="text-greyAccent text-xs font-medium">Hidden</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-greyPrimary text-sm font-normal text-center">{tc.points}</span>
                            <span className="text-greyPrimary text-sm font-normal text-center">{tc.weightage}</span>
                            <div className="flex items-center justify-center gap-3">
                                <motion.button
                                    type="button"
                                    onClick={handleEditTestCase(idx)}
                                    className="text-greyPrimary hover:text-purplePrimary"
                                    whileHover={{ y: -3 }}
                                    whileTap={{ y: 1 }}
                                >
                                    <EditTestIcon className="size-4" />
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={handleRemoveTestCase(idx)}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ y: 1 }}
                                    className="text-greyPrimary hover:text-dangerPrimary"
                                >
                                    <DeleteIcon className="size-4" />
                                </motion.button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-[6px] w-[130px] h-[33px] flex items-center gap-[6px] text-greyPrimary text-sm font-medium rounded-full border border-seperatorPrimary"
                    >
                        <UploadZipICon />
                        Upload zip
                    </motion.button>
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                        <DialogTrigger asChild>
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-[6px] w-[130px] h-[33px] flex items-center gap-[6px] text-greyPrimary text-sm font-medium rounded-full bg-purpleSecondary"
                                onClick={() => {
                                    setEditingCase(null);
                                    resetAddCaseForm();
                                    setModalOpen(true);
                                }}
                            >
                                <PlusIcon />
                                Add Case
                            </motion.button>
                        </DialogTrigger>
                        <DialogContent className="p-0 rounded-[24px] flex flex-col min-w-[1208px] overflow-y-auto">
                            <DialogHeader className='sr-only'>
                                <DialogTitle>{editingCase !== null ? 'Edit Test Case' : 'Add Test Case'}</DialogTitle>
                                <DialogDescription>
                                    {editingCase !== null ? 'Edit the test case for your coding question.' : 'Create a new test case for your coding question.'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="px-6 py-4 flex items-center justify-between border-b border-seperatorPrimary ">
                                <div className="flex items-center gap-3">
                                    <span className="text-greyPrimary font-semibold text-lg">
                                        {watchedName || (editingCase !== null ? `Edit Test Case ${editingCase + 1}` : `Test Case ${testCases.length + 1}`)}
                                    </span>
                                    {watchedVisible ? (
                                        <div className="max-w-[74px] px-2 py-1 flex items-center text-center gap-1 bg-[#E2F9E9] rounded-full">
                                            <Eye size={16} color="#13482A" />
                                            <span className="text-[#13482A] text-xs font-medium">Public</span>
                                        </div>
                                    ) : (
                                        <div className="max-w-[74px] px-2 py-1 flex items-center text-center gap-1 bg-seperatorPrimary rounded-full">
                                            <EyeOff size={16} color="#5C5C5C" />
                                            <span className="text-greyAccent text-xs font-medium">Hidden</span>
                                        </div>
                                    )}
                                    <span className="text-greyAccent font-normal">{watchedPoints || 10} Points</span>
                                </div>
                                <DialogClose >
                                    <motion.div
                                        className="p-2 text-greyPrimary bg-white rounded-full  hover:bg-dangerPrimary transition-colors duration-300 ease-in"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.div>
                                </DialogClose>
                            </div>
                            <div className="px-6 pb-6 flex flex-col items-center gap-6">
                                <div className="w-full flex items-center gap-4">
                                    <label htmlFor="testCaseName" className="min-w-[220px] text-base font-medium text-greyPrimary">Test Case Name</label>
                                    <div className="flex flex-col gap-1 w-full">
                                        <Controller
                                            name="name"
                                            control={addCaseControl}
                                            rules={{ required: "Test case name is required" }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    id="testCaseName"
                                                    className={cn("w-full h-[37px] py-2 px-3 border rounded-xl text-base bg-white border-seperatorPrimary", {
                                                        'border-dangerPrimary': addCaseErrors.name
                                                    })}
                                                    placeholder="Enter test case name"
                                                />
                                            )}
                                        />
                                        {addCaseErrors.name && <p className="text-dangerPrimary text-xs">{addCaseErrors.name.message}</p>}
                                    </div>
                                </div>
                                <div className="w-full flex items-center gap-4">
                                    <div className="flex items-center gap-2 min-w-[220px]">
                                        <label htmlFor="testCaseInput" className="flex text-base font-medium text-greyPrimary">
                                            Input
                                            <span className="text-dangerPrimary">*</span>
                                        </label>
                                        <QuestionIcon />
                                    </div>
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex gap-4">
                                            <Controller
                                                name="input"
                                                control={addCaseControl}
                                                rules={{ required: "Input is required" }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="testCaseInput"
                                                        className={cn("flex-1 h-[37px] py-2 px-3 border rounded-xl text-base bg-white border-seperatorPrimary", {
                                                            'border-dangerPrimary': addCaseErrors.input
                                                        })}
                                                        placeholder="Enter test case Input"
                                                    />
                                                )}
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-[6px] w-[130px] h-[33px] flex items-center gap-[6px] text-greyPrimary text-sm font-medium rounded-full border border-seperatorPrimary"
                                            >
                                                <UploadZipICon />
                                                Upload zip
                                            </motion.button>
                                        </div>
                                        {addCaseErrors.input && <p className="text-dangerPrimary text-xs">{addCaseErrors.input.message}</p>}
                                    </div>
                                </div>
                                <div className="w-full flex items-center gap-4">
                                    <div className="flex items-center gap-2 min-w-[220px]">
                                        <label htmlFor="testCaseOutput" className="flex text-base font-medium text-greyPrimary">
                                            Output
                                            <span className="text-dangerPrimary">*</span>
                                        </label>
                                        <QuestionIcon />
                                    </div>
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex gap-4">
                                            <Controller
                                                name="output"
                                                control={addCaseControl}
                                                rules={{ required: "Output is required" }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="testCaseOutput"
                                                        className={cn("flex-1 h-[37px] py-2 px-3 border rounded-xl text-base bg-white border-seperatorPrimary", {
                                                            'border-dangerPrimary': addCaseErrors.output
                                                        })}
                                                        placeholder="Enter test case Output"
                                                    />
                                                )}
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-[6px] w-[130px] h-[33px] flex items-center gap-[6px] text-greyPrimary text-sm font-medium rounded-full border border-seperatorPrimary"
                                            >
                                                <UploadZipICon />
                                                Upload zip
                                            </motion.button>
                                        </div>
                                        {addCaseErrors.output && <p className="text-dangerPrimary text-xs">{addCaseErrors.output.message}</p>}
                                    </div>
                                </div>
                                <div className="w-full flex items-center gap-4">
                                    <label htmlFor="testCasePoints" className="min-w-[220px] text-greyPrimary text-base font-medium">Case Points</label>
                                    <div className="flex flex-col gap-1 w-full">
                                        <Controller
                                            name="points"
                                            control={addCaseControl}
                                            rules={{
                                                required: "Points are required",
                                                validate: v => !isNaN(Number(v)) || "Points must be a number"
                                            }}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    placeholder="10"
                                                    id="testCasePoints"
                                                    type="number"
                                                    min={1}
                                                    className={cn("w-[97px] h-10 py-2 px-3 border rounded-xl text-base font-medium bg-white border-[#CCCCCC]", {
                                                        'border-dangerPrimary': addCaseErrors.points
                                                    })}
                                                />
                                            )}

                                        />
                                        {addCaseErrors.points && <p className="text-dangerPrimary text-xs">{addCaseErrors.points.message}</p>}
                                    </div>
                                </div>
                                <div className="w-full flex items-center gap-4">
                                    <div className="min-w-[220px] flex items-center gap-2">
                                        <label htmlFor="testCaseWeightage" className="text-greyPrimary text-base font-medium">
                                            Weightage
                                        </label>
                                        <QuestionIcon />
                                    </div>
                                    <div className="flex flex-col gap-1 w-full">
                                        <Controller
                                            name="weightage"
                                            control={addCaseControl}
                                            rules={{
                                                required: "Weightage is required",
                                                validate: v => !isNaN(Number(v)) || "Weightage must be a number"
                                            }}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    placeholder="10"
                                                    id="testCaseWeightage"
                                                    type="number"
                                                    min={1}
                                                    className={cn("w-[97px] h-10 py-2 px-3 border rounded-xl text-base font-medium bg-white border-[#CCCCCC]", {
                                                        'border-dangerPrimary': addCaseErrors.weightage
                                                    })}
                                                />
                                            )}
                                        />
                                        {addCaseErrors.weightage && <p className="text-dangerPrimary text-xs">{addCaseErrors.weightage.message}</p>}
                                    </div>
                                </div>
                                <div className="w-full flex items-center gap-4">
                                    <div className="min-w-[220px] flex items-center gap-2">
                                        <span className="text-base font-medium text-greyPrimary">Visible to participants</span>
                                        <QuestionIcon />
                                    </div>
                                    <Controller
                                        name="visible"
                                        control={addCaseControl}
                                        render={({ field }) => (
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <Input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={e => field.onChange(e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-11 h-6 rounded-full transition-colors ${field.value ? 'bg-purplePrimary' : 'bg-greyAccent'}`}>
                                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                                </div>
                                            </label>
                                        )}
                                    />
                                </div>
                                <div className="w-full flex items-center justify-between mt-[65px]">
                                    <DialogClose >
                                        <motion.div
                                            className="py-2 px-6 text-purplePrimary bg-white rounded-full border border-purplePrimary"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Close
                                        </motion.div>
                                    </DialogClose>
                                    <motion.button
                                        type="button"
                                        onClick={handleAddCaseSubmit(onAddCase)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        // onClick={handleSave}
                                        className="mt-4 ml-auto w-[124px] h-[37px] grid place-content-center bg-[#1EA378] text-white rounded-full text-sm font-medium"
                                    >
                                        Add Case
                                    </motion.button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex items-center gap-6">
                    <div className="p-4 flex flex-col  gap-4 rounded-2xl bg-purpleSecondary flex-1">
                        <div className="flex items-center gap-4">
                            <label htmlFor="testCaseCustomScore" className="min-w-[221px] text-greyPrimary text-sm font-bold">Set Custom Score</label>
                            <Controller
                                name="customScore"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        placeholder="10"
                                        id="testCaseCustomScore"
                                        type="number"
                                        min={1}
                                        className="w-[68px] h-10 py-1 px-3 border rounded-xl text-base bg-white border-[#CCCCCC]"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="min-w-[221px] text-base font-medium text-greyPrimary">Save question to library</span>
                            <Controller
                                name="saveToLibrary"
                                control={control}
                                render={({ field }) => (
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <Input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-11 h-6 rounded-full transition-colors ${field.value ? 'bg-purplePrimary' : 'bg-greyAccent'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                        </div>
                                    </label>
                                )}
                            />
                        </div>
                    </div>
                    <div className="px-4 py-6 flex flex-col items-center gap-4 rounded-2xl bg-purpleSecondary max-w-[310px]">
                        <div className="flex items-center gap-4">
                            <span className="min-w-[220px] text-base font-medium text-greyPrimary">Enable Precision Check</span>
                            <Controller
                                name="enablePrecisionCheck"
                                control={control}
                                render={({ field }) => (
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <Input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-11 h-6 rounded-full transition-colors ${field.value ? 'bg-purplePrimary' : 'bg-greyAccent'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                        </div>
                                    </label>
                                )}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="min-w-[220px] text-base font-medium text-greyPrimary">Disable Compile & Test</span>
                            <Controller
                                name="disableCompile"
                                control={control}
                                render={({ field }) => (
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <Input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-11 h-6 rounded-full transition-colors ${field.value ? 'bg-purplePrimary' : 'bg-greyAccent'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                        </div>
                                    </label>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
    function renderStepContent() {
        switch (currentStep) {
            case 1: return <Step1Content />;
            case 2: return <Step2Content
                allLanguages={allLanguages}
                isLanguagesLoading={isLanguagesLoading}
                languagesError={languagesError}
                langOverrides={langOverrides}
                setLangOverrides={setLangOverrides}
            />;
            case 3: return <Step3Content
                allLanguages={allLanguages}
                isLanguagesLoading={isLanguagesLoading}
                languagesError={languagesError}
                selectedLanguages={methods.getValues('selectedLanguages')}
                langOverrides={langOverrides}
            />;
            case 4: return <Step4Content testCases={testCases} setTestCases={setTestCases} />;
            default: return null;
        }
    }
    // const onSubmit = (data) => {
    //     // testCases is now included in data automatically
    //     // Send data to your API or backend
    //     console.log('Form submitted:', data);
    // };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex gap-6 flex-1'>
                <aside
                    // className='p-6 w-[20.7%] max-w-[240px] flex flex-col justify-between rounded-5xl bg-white border border-seperatorPrimary'>
                    className='p-3 xl:p-6 w-full sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[240px] min-w-0 flex flex-col justify-between rounded-5xl bg-white border border-seperatorPrimary overflow-x-hidden overflow-y-auto max-h-screen'>
                    <div className="flex flex-col gap-4">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={cn(
                                    "px-3 py-2 flex items-center gap-3 rounded-xl min-w-[202px] hover:bg-purpleQuaternary group transition-all duration-300 ease-in",
                                    currentStep === step.id && "bg-purpleQuaternary"
                                )}
                                onClick={() => setCurrentStep(step.id)}
                                style={{ cursor: "pointer" }}
                            >
                                <div
                                    className={cn(
                                        'h-[51px] w-1 rounded-5xl transition-all duration-300 ease-in',
                                        currentStep === step.id ? 'bg-purplePrimary opacity-100' : 'bg-purplePrimary opacity-0 group-hover:opacity-100 '
                                    )}
                                />
                                <div className="flex items-center gap-4">
                                    <span className="h-[26px] w-[26px] grid place-content-center text-sm font-semibold text-purplePrimary border border-purplePrimary rounded-full">{step.id}</span>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-normal text-purplePrimary">Step:&nbsp;{step.id}</span>
                                        <span className="text-sm font-semibold text-greyPrimary text-nowrap">{step.title}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-[6px]">
                            <AiIcon className="h-5 w-5 text-purplePrimary" />
                            <h3 className='text-sm font-semibold bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text'>Quality Review</h3>
                        </div>
                        <div className="flex items-start gap-1">
                            <CircleAlert size={24} className="text-greyAccent" />
                            <div className="flex flex-col gap-[6px]">
                                <span className="text-xs font-normal text-greyAccent">Scoutabl's AI suggests tests by matchin skills in your job.</span>
                                <span className="text-xs font-medium text-purplePrimary">Add sample test cases</span>
                            </div>
                        </div>
                    </div>
                </aside>
                {/* step content */}
                <section className="flex-1 flex flex-col bg-white min-h-[600px]">
                    {renderStepContent()}
                    <div className='flex items-center justify-between mt-auto pt-6'>
                        <Button
                            variant="back"
                            effect="shineHover"
                            disabled={currentStep === 1}
                            type="button"
                            onClick={handleBack}>
                            <ChevronLeftIcon />
                            Back
                        </Button>
                        {currentStep < 4 ? (
                            <Button
                                variant="next"
                                effect="shineHover"
                                type="button"
                                onClick={handleNext}
                            >
                                Next
                                <ChevronRightIcon />
                            </Button>
                        ) : (
                            <Button
                                variant="next"
                                effect="shineHover"
                                type="submit"
                            >
                                Submit
                                <ChevronRightIcon />
                            </Button>
                        )}
                    </div>
                </section>
            </div>
        </form>

    )
}

export default CodingQuestionContent