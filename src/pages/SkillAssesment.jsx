import React, { useState, useEffect, useRef } from 'react';
import { questions } from '../lib/questions';
import WaveformComponent from '../components/WavesurferComponent';
import { cn } from '@/lib/utils';
import RichText from '@/components/RichText';
import VideoRecorder from '@/components/common/VideoRecorder';
import logo from '/scoutableBlackLogo.svg'
import timerLogo from '/timerLogo.svg'
import { FaQuestion } from "react-icons/fa6";
import { Headphones, Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import footerLogo from '/greyLogo.svg'
import QuestionPopup from '@/components/features/candidateAssesments/QuestionPopup';
// Question type components
const MCQQuestion = ({ question, onAnswer, selectedAnswer }) => (
    <div className="space-y-4 my-auto">
        {question.options.map((option, index) => (
            <div
                key={index}
                onClick={() => onAnswer(index)}
                className={`flex items-center gap-3 p-4 rounded-lg border ${selectedAnswer === index
                    ? 'border-[#8B5CF6] bg-[#F3F4F6]'
                    : 'border-gray-200 hover:border-[#8B5CF6] cursor-pointer'
                    }`}
            >
                <div className='w-[31px] h-[31px] flex items-center justify-center rounded-full border border-[#8B5CF6] bg-white'>
                    <div className={`w-[9.3px] h-[9.3px] rounded-full border ${selectedAnswer === index
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]'
                        : 'border-[#8B5CF6]'
                        }`} />
                </div>
                <span className="text-sm">{option}</span>
            </div>
        ))}
    </div>
);

const MultiSelectQuestion = ({ question, onAnswer, selectedAnswers = [] }) => (
    <div className="space-y-4 my-auto">
        {question.options.map((option, index) => (
            <div
                key={index}
                onClick={() => {
                    const newSelected = selectedAnswers.includes(index)
                        ? selectedAnswers.filter(i => i !== index)
                        : [...selectedAnswers, index];
                    onAnswer(newSelected);
                }}
                className={`flex items-center gap-3 p-4 rounded-lg border ${selectedAnswers.includes(index)
                    ? 'border-[#8B5CF6] bg-[#F3F4F6]'
                    : 'border-gray-200 hover:border-[#8B5CF6] cursor-pointer'
                    }`}
            >
                <div className='h-[31px] w-[31px] flex items-center justify-center rounded-[12px] border border-[#8B5CF6] bg-white'>

                    <div className={`w-3 h-3 rounded border ${selectedAnswers.includes(index)
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]'
                        : 'border-[#8B5CF6]'
                        }`} />
                </div>
                <span className="text-sm">{option}</span>
            </div>
        ))}
    </div>
);

const RearrangeQuestion = ({ question, onAnswer, currentOrder = [] }) => {
    const [items, setItems] = useState(currentOrder.length ? currentOrder : question.items);

    const moveItem = (fromIndex, toIndex) => {
        const newItems = [...items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        setItems(newItems);
        onAnswer(newItems);
    };

    return (
        <div className="space-y-4 my-auto">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                            {index + 1}
                        </div>
                        <span className="text-sm">{item}</span>
                    </div>
                    <div className="flex gap-2">
                        {index > 0 && (
                            <button
                                onClick={() => moveItem(index, index - 1)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                ↑
                            </button>
                        )}
                        {index < items.length - 1 && (
                            <button
                                onClick={() => moveItem(index, index + 1)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                ↓
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const CodingQuestion = ({ question, onAnswer, answer = '' }) => (
    <div className="space-y-4 my-auto">
        <div className="p-4 rounded-lg border border-gray-200 bg-[#1E1E1E]">
            <textarea
                className="w-full min-h-[400px] p-4 font-mono text-sm bg-transparent text-white resize-none focus:outline-none"
                placeholder="Write your code here..."
                value={answer}
                onChange={(e) => onAnswer(e.target.value)}
            />
        </div>
    </div>
);

const VoiceQuestion = ({ question, onAnswer, recording = false }) => {
    const [isRecording, setIsRecording] = useState(recording);
    const [timeLeft, setTimeLeft] = useState(question.durationSeconds);
    const [audioBlob, setAudioBlob] = useState(null);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        onAnswer(!isRecording);
    };

    const handleRecordingComplete = (blob) => {
        setAudioBlob(blob);
        onAnswer({ blob, timestamp: new Date().toISOString() });
    };

    return (
        <div className="space-y-6 my-auto">
            <WaveformComponent
                isRecording={isRecording}
                onRecordingComplete={handleRecordingComplete}
            />

            {audioBlob && (
                <div className="p-4 rounded-lg border border-gray-200">
                    <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
                </div>
            )}

            <div className="flex items-center justify-center gap-14">
                <div className='flex flex-col items-center justify-center gap-2'>
                    <svg className='h-[52px]' width="24" height="31" viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.999 17.0005L8.99902 23.0005L14.999 29.0005" stroke="#333333" stroke-width="3" />
                        <path d="M2.90673 17.75C1.75103 15.7483 1.28813 13.4211 1.58983 11.1295C1.89153 8.83784 2.94097 6.70979 4.57538 5.07538C6.20979 3.44097 8.33784 2.39153 10.6295 2.08983C12.9211 1.78813 15.2483 2.25103 17.25 3.40673C19.2517 4.56244 20.8162 6.34636 21.7007 8.48182C22.5853 10.6173 22.7405 12.985 22.1422 15.2176C21.544 17.4503 20.2258 19.4231 18.392 20.8302C16.5582 22.2373 14.3114 23 12 23" stroke="#333333" stroke-width="3" stroke-linecap="round" />
                    </svg>

                    <span className='text-sm font-normal'>Re-Submit</span>
                </div>
                <div className='flex flex-col items-center justify-center gap-2'>
                    <div className={cn("w-[52px] h-[52px] flex items-center justify-center border border-red-500 rounded-full", { "bg-red-500": isRecording, "bg-white": !isRecording })}
                        onClick={toggleRecording}
                    >
                        {isRecording ? (

                            <div className='h-5 w-5 bg-white rounded' />


                        ) : (

                            <div className='h-5 w-5 bg-red-500 rounded-full' />

                        )}
                    </div>
                    {isRecording ? <span className='text-sm font-normal'>Stop</span> : <span className='text-sm font-normal'>Record</span>}
                </div>
                <div className='flex flex-col items-center justify-center gap-2'>
                    <svg width="53" height="52" viewBox="0 0 53 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" width="52" height="52" rx="26" fill="#008B00" />
                        <path d="M26.5 13C30.1408 13 33.4301 14.4985 35.79 16.9102L24.9238 28.9844L19.8779 25.2002L19.2783 26L18.6777 26.7998L23.7236 30.584C24.5002 31.1664 25.5736 31.1033 26.2754 30.459L26.4111 30.3223L37.0889 18.457C38.6068 20.5841 39.5 23.1877 39.5 26C39.5 33.1797 33.6797 39 26.5 39C19.3203 39 13.5 33.1797 13.5 26C13.5 18.8203 19.3203 13 26.5 13ZM19.8779 25.2002C19.4362 24.8692 18.8088 24.9578 18.4775 25.3994C18.1463 25.8411 18.2363 26.4683 18.6777 26.7998L19.8779 25.2002Z" fill="white" />
                    </svg>
                    <span className='text-sm font-normal'>Submit</span>
                </div>
            </div>


        </div>
    );
};

const VideoQuestion = ({ question, onAnswer }) => {
    const [blob, setBlob] = useState(null);

    // This function will be called when the video is submitted
    const handleVideoSubmit = (videoBlob) => {
        if (videoBlob) {
            setBlob(videoBlob);
            onAnswer(videoBlob);
        }
    };

    return (
        <VideoRecorder onSubmitVideo={handleVideoSubmit} />
    );
};

const LongAnswerQuestion = ({ question, onAnswer, answer = '' }) => {
    const [post, setPost] = useState("")

    const onChange = (content) => {
        setPost(content)
        console.log(content)
    }

    return (
        <RichText content={post} onChange={onChange} />
    )
};

const SkillAssesment = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (answer) => {
        setAnswers({
            ...answers,
            [currentQuestionIndex]: answer
        });
    };

    const renderQuestion = () => {
        const props = {
            question: currentQuestion,
            onAnswer: handleAnswer,
            selectedAnswer: answers[currentQuestionIndex],
            selectedAnswers: answers[currentQuestionIndex],
            answer: answers[currentQuestionIndex],
            currentOrder: answers[currentQuestionIndex],
            recording: answers[currentQuestionIndex]
        };

        switch (currentQuestion.type) {
            case 'mcq':
                return <MCQQuestion {...props} />;
            case 'multi-select':
                return <MultiSelectQuestion {...props} />;
            case 'rearrange':
                return <RearrangeQuestion {...props} />;
            case 'coding':
                return <CodingQuestion {...props} />;
            case 'voice':
                return <VoiceQuestion {...props} />;
            case 'video':
                return <VideoQuestion {...props} />;
            case 'long-answer':
                return <LongAnswerQuestion {...props} />;
            default:
                return <div>Unknown question type</div>;
        }
    };



    return (
        <div className='min-h-screen flex flex-col gap-6 py-6'>
            {/* Top Navbar */}
            <div className='flex items-center justify-between px-12'>
                <div className='flex gap-1 items-center justify-center'>
                    <img src={logo} alt='scoutabl logo' className='h-[30px] w-[30px]' />
                    <h1 className='text-2xl text-greyPrimary font-bold'>Scoutabl</h1>
                </div>
                <div>
                    <span className="text-base font-normal">Problem Solving <span className='font-bold text-greyPrimary'>({currentQuestionIndex + 1}/{questions.length})</span></span>
                </div>
                <div className='flex gap-1 items-center justify-center'>
                    <img src={timerLogo} alt='timer logo' />
                    <span>time Left:</span>
                </div>
            </div>
            <div className="flex-1 flex gap-8 px-12">
                {/* Left Sidebar */}
                <div className="w-[40%] max-w-[531px] min-w-[330px] flex flex-col gap-6 bg-white rounded-[20px] p-6 border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <QuestionPopup
                                currentQuestionIndex={currentQuestionIndex}
                                onQuestionSelect={(index) => setCurrentQuestionIndex(index)}
                            />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-[6px] rounded-full group hover:bg-purplePrimary hover:text-white">
                            <div className='h-6 w-6 grid place-content-center rounded-full bg-purplePrimary group-hover:bg-white text-white group-hover:text-purplePrimary'>
                                <FaQuestion size={16} />
                            </div>
                            <span className='text-purplePrimary text-sm font-medium group-hover:text-white'>Question info</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-lg font-medium">{currentQuestion.questionTitle}</h2>

                        <div className="space-y-4">
                            <h3 className="font-medium">Instructions:</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                {currentQuestion.instructions?.map((instruction, index) => (
                                    <li key={index} className="pl-2">{instruction}</li>
                                ))}
                            </ol>
                        </div>

                        {currentQuestion.optional && (
                            <div className="space-y-2">
                                <h3 className="font-medium">Optional:</h3>
                                <p className="text-sm text-gray-600">
                                    {currentQuestion.optional}
                                </p>
                            </div>
                        )}

                        {currentQuestion.assessmentCriteria && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    {currentQuestion.assessmentCriteria}
                                </p>
                            </div>
                        )}

                    </div>
                    <div className='flex items-center justify-between mt-auto'>
                        <div className='flex items-center gap-2'>
                            <div className='h-10 w-10 grid place-content-center group rounded-full border border-black hover:bg-purplePrimary hover:text-white hover:border-purplePrimary'>
                                <Flag />
                            </div>
                            <div className='h-10 w-10 grid place-content-center rounded-full border border-black hover:bg-purplePrimary hover:text-white hover:border-purplePrimary'>
                                <Headphones />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                className="flex items-center gap-1 px-[22px] py-[10px] text-bold text-base rounded-full border border-purplePrimary hover:bg-purplePrimary text-purplePrimary bg-white hover:text-white disabled:opacity-50"
                                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                                disabled={currentQuestionIndex === 0}
                            >
                                <ChevronLeft size={20} />
                                Back
                            </button>
                            <button
                                className="flex items-center gap-1 px-[22px] py-[10px] text-bold text-base rounded-full border border-purplePrimary bg-purplePrimary text-white hover:bg-white hover:text-purplePrimary disabled:opacity-50"
                                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                disabled={currentQuestionIndex === questions.length - 1}
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}

                {/* <div className="mb-6">
                        <h2 className="text-xl font-semibold">Problem Solving ({currentQuestionIndex + 1}/{questions.length})</h2>
                    </div> */}
                {/* <div className={`${currentQuestion.type !== 'video' && currentQuestion.type !== 'long-answer' ? 'mt-[100px]' : ''}`}>
                        
                    </div> */}
                <div className={cn('flex-1',
                    { 'mt-[100px]': currentQuestion.type !== 'video' && currentQuestion.type !== 'long-answer' })}>
                    {renderQuestion()}
                </div>



            </div>
            <div className='flex items-center justify-center gap-2'>
                <img src={footerLogo} alt="scoutable logo" />
                <span className='text-base font-normal text-greyTertiary'>Powered by Scoutabl</span>
            </div>
        </div>
    );
};

export default SkillAssesment;