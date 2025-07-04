import { useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { CircleAlert } from 'lucide-react';
import { motion } from "framer-motion";
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
import MultipleSelector from "@/components/ui/MultipleSelector";
import { cn } from "@/lib/utils";
import AiIcon from '@/assets/AiIcon.svg?react'
import QuestionIcon from '@/assets/questionIcon.svg?react'
import ChevronLeftIcon from '@/assets/chevronLeft.svg?react'
import ChevronRightIcon from '@/assets/chevronRight.svg?react'
import EditIcon from '@/assets/pencilIcon.svg?react'
import CodeIcon from '@/assets/codeIcon.svg?react'
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

const defaultValues = (initialData, initialQuestion) => ({
    question: initialData?.question || initialQuestion || '',
    difficulty: initialData?.difficulty || '1',
    inputFormats: initialData?.inputFormats || '',
    constraints: initialData?.constraints || '',
    outputFormats: initialData?.outputFormats || '',
    tags: initialData?.tags || [],
    selectedLanguages: [],
});

const CodingQuestionContent = ({ initialData = {}, initialQuestion = '' }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const methods = useForm({
        mode: 'onTouched',
        defaultValues: defaultValues(initialData, initialQuestion),
    });
    const { control, register, handleSubmit, trigger, formState: { errors } } = methods;

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
        }
        // Add fields for other steps as needed
        const valid = await trigger(fieldsToValidate);
        if (valid) setCurrentStep((s) => s + 1);
    };
    const handleBack = () => setCurrentStep((s) => s - 1);

    function Step1Content() {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <h3 className="flex text-base font-medium text-greyPrimary">Problem Statement<span className="text-[#E45270]">*</span></h3>
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
                            {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message}</p>}
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
                                {errors.difficulty && <p className="text-red-500 text-xs mt-1">{errors.difficulty.message}</p>}
                            </div>
                        )}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label htmlFor="input-formats" className="flex text-base font-medium text-greyPrimary">
                            Input Formats
                            <span className="text-[#E45270]">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <div className="w-full">
                        <Input type='text' id="input-formats" placeholder="nums=[1, 2, 3]" className='w-full' {...register('inputFormats', { required: 'Input format is required' })} />
                        {errors.inputFormats && <p className="text-red-500 text-xs mt-1">{errors.inputFormats.message}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label htmlFor="constraints" className="flex text-base font-medium text-greyPrimary">
                            Constraints
                            <span className="text-[#E45270]">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <div className="w-full">
                        <Input type='text' id="constraints" placeholder="Constraints" className='w-full' {...register('constraints', { required: 'Constraints are required' })} />
                        {errors.constraints && <p className="text-red-500 text-xs mt-1">{errors.constraints.message}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label htmlFor="output-formats" className="flex text-base font-medium text-greyPrimary">
                            Output Format
                            <span className="text-[#E45270]">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <div className="w-full">
                        <Input type='text' id="output-formats" placeholder="output" className='w-full' {...register('outputFormats', { required: 'Output format is required' })} />
                        {errors.outputFormats && <p className="text-red-500 text-xs mt-1">{errors.outputFormats.message}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label className="flex text-base font-medium text-greyPrimary">
                            Question Tags
                            <span className="text-[#E45270]">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <div className="w-full">
                        <Controller
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
                                />
                            )}
                        />
                        {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>}
                    </div>
                </div>
            </div>
        );
    }

    function Step2Content() {
        const [searchValue, setSearchValue] = useState('')
        const { data: allLanguages, isLoading: isLanguagesLoading, error: languagesError } = useLanguages();
        const [showPopularOnly, setShowPopularOnly] = useState(false);
        const [editingLangId, setEditingLangId] = useState(null);
        const [editValues, setEditValues] = useState({});
        const [langOverrides, setLangOverrides] = useState({}); // { [langId]: { timeLimit, memoryLimit } }
        const popularLanguages = ["Python 3", "Java", "C++", "NodeJS", "PHP", "C#"];
        const langResultMap = allLanguages?.results.map(lang => {
            const override = langOverrides[lang.id] || {};
            return {
                id: lang.id,
                name: lang.name,
                timeLimit: override.timeLimit ?? lang.default_time_limit_seconds,
                memoryLimit: override.memoryLimit ?? lang.default_memory_limit_mb,
                defaultTemplate: lang.default_template.content,
                isPopular: popularLanguages.includes(lang.name)
            };
        });
        useEffect(() => {
            console.log(langResultMap)
        }, [allLanguages]);

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
                            setSearchValue={setSearchValue}
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
                    <div className="p-3 grid grid-cols-[minmax(200px,250px)_minmax(150px,180px)_minmax(150px,10px)_minmax(100px,120px)] gap-16 items-center rounded-xl">
                        {/* Header */}
                        <div className="font-medium">Language</div>
                        <div className="font-medium">Time Limit (seconds)</div>
                        <div className="font-medium">Memory Limit (mb)</div>
                        <div className="font-medium">Edit / Save</div>
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
                                    <div key={lang.id} className="p-3 grid grid-cols-[minmax(200px,250px)_minmax(150px,180px)_minmax(150px,10px)_minmax(100px,120px)] gap-16 items-center rounded-xl border border-[#E0E0E0] bg-white hover:bg-purpleQuaternary transition-all duration-300 ease-in">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={field.value?.includes(lang.id)}
                                                    onCheckedChange={checked => {
                                                        if (checked) {
                                                            field.onChange([...(field.value || []), lang.id]);
                                                        } else {
                                                            field.onChange((field.value || []).filter(id => id !== lang.id));
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
                        <p className="text-red-500 text-xs mt-1">{errors.selectedLanguages.message}</p>
                    )}
                </div>
            </div>
        );
    }

    function Step3Content() {
        return (
            <div> {/* Code stub editor, language tabs, etc. */} </div>
        );
    }
    function Step4Content() {
        return (
            <div> {/* Test cases table, add/edit, custom score, toggles, etc. */} </div>
        );
    }
    function renderStepContent() {
        switch (currentStep) {
            case 1: return <Step1Content />;
            case 2: return <Step2Content />;
            case 3: return <Step3Content />;
            case 4: return <Step4Content />;
            default: return null;
        }
    }
    const onSubmit = (data) => {
        // handle final submit here
        console.log('Form submitted:', data);
    };
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex gap-6 flex-1'>
                    <aside className='p-6 w-[20.7%] max-w-[240px] flex flex-col justify-between rounded-5xl bg-white border border-[#E0E0E0]'>
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
                    <section className="flex-1 bg-white min-h-[600px]">
                        {renderStepContent()}
                        <div className='flex items-center justify-between mt-6'>
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
        </FormProvider>
    )
}

export default CodingQuestionContent