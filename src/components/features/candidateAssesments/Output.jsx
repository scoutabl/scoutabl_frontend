import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import OutputNavBar from './OutputNavBar';
import { useCodingAssesment } from './CodingAssesmentContext';
import { useEnums } from '@/context/EnumsContext';
import { motion } from 'framer-motion';
import ClockIcon from '@/assets/clock.svg?react';
import { Skeleton } from '@/components/ui/skeleton';
const OUTPUT_NAVBAR_MIN_HEIGHT = 54;

const Output = ({
  output = [],
  testCases = [],
  userTestCases = [],
  setUserTestCases,
  inputVars = [],
  selectedCase,
  setSelectedCase,
  activeTab,
  setActiveTab,
  loading,
  isOutputCollapsed,
  isRightPanelCollapsed,
  onOutputCollapse,
  onExitFullscreen,
  isOutputFullscreen,
  editInput,
  editOutput,
  onEditInputChange,
  onEditOutputChange,
  outputErrorMessage,
  setOutputErrorMessage,
  skipNextEffectRef
}) => {
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef(null);
  const { setIsOutputFullscreen } = useCodingAssesment();
  const { enums } = useEnums();

  // Memoize allCases
  const allCases = useMemo(
    () => [...(testCases || []), ...(userTestCases || [])],
    [testCases, userTestCases]
  );

  const result = output[0] || {}; // Only one result at a time
  const isUserTestCase = selectedCase >= (testCases ? testCases.length : 0);
  const hasExpected = typeof result.expected !== 'undefined' && result.expected !== '';
  const [stdoutValue, setStdoutValue] = useState('');
  const [stderrValue, setStderrValue] = useState('');
  const evaluation = output[0]?.evaluations?.[0];
  const resultCode = evaluation?.evaluation_result ?? output[0]?.evaluation_result;
  const resultText = enums?.enums?.CQEvaluationResult
    ? Object.keys(enums.enums.CQEvaluationResult).find(
      key => enums.enums.CQEvaluationResult[key] === resultCode
    )
    : resultCode;

  const isAccepted = resultText === 'SUCCESS';

  // Helper for human-readable error text
  function getErrorText(resultText) {
    if (!resultText || resultText === 'SUCCESS') return '';
    return resultText
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
  const errorText = getErrorText(resultText);

  // Add new test case
  const handleAddTestCase = (e) => {
    e.preventDefault(); // Prevents page reload
    let hasError = false;

    if (!newInput.trim()) {
      setInputError('Input is required');
      hasError = true;
    } else {
      setInputError('');
    }

    if (!newExpected.trim()) {
      setOutputError('Expected output is required');
      hasError = true;
    } else {
      setOutputError('');
    }

    if (hasError) return;

    try {
      const parsed = JSON.parse(newInput);
      if (!Array.isArray(parsed)) throw new Error('Input must be an array');
      setUserTestCases([...userTestCases, { input: parsed, output: newExpected }]);
      setNewInput('');
      setNewExpected('');
      setInputError('');
      setOutputError('');
      setShowAddForm(false);
      setSelectedCase(allCases.length);
      onEditInputChange(JSON.stringify(parsed, null, 2));
      onEditOutputChange(String(newExpected));
    } catch (e) {
      setInputError('Input must be a valid JSON array');
    }
  };

  // Remove a user-added test case
  const handleRemoveTestCase = (idx) => {
    const baseLen = testCases ? testCases.length : 0;
    const userIdx = idx - baseLen;
    if (userIdx >= 0) {
      const updated = [...userTestCases];
      updated.splice(userIdx, 1);
      setUserTestCases(updated);
      setSelectedCase(Math.max(0, selectedCase - 1));
    }
  };

  useEffect(() => {
    console.log("output", output[0]?.result?.eval[0]?.expected, output[0]?.result?.eval[0]?.value)

  }, [output[0]?.result.eval]);

  useEffect(() => {
    // Get the stdout_file URL from the output prop
    const stdoutFileUrl = output[0]?.evaluations?.[0]?.stdout_file;
    const stderrFileUrl = output[0]?.evaluations?.[0]?.stderr_file;
    if (stdoutFileUrl) {
      fetch(stdoutFileUrl)
        .then(res => res.text())
        .then(text => setStdoutValue(text))
        .catch(() => setStdoutValue('Error loading output'));
    } else {
      setStdoutValue('');
    }
    if (stderrFileUrl) {
      fetch(stderrFileUrl)
        .then(res => res.text())
        .then(text => setStderrValue(text))
        .catch(() => setStderrValue('Error loading stdError'));
    } else {
      setStderrValue('');
    }
    console.log("stdoutValue", stdoutValue, "stderrValue", stderrValue);
  }, [output]);

  //format errror messages
  function parseError(stderr) {
    // Example: /box/main.js:2 returasdn ... SyntaxError: Unexpected token 'this'
    const lineMatch = stderr.match(/main\\.js:(\\d+)/);
    const errorTypeMatch = stderr.match(/(\\w*Error): ([^\\n]+)/);
    const line = lineMatch ? lineMatch[1] : null;
    const errorType = errorTypeMatch ? errorTypeMatch[1] : null;
    const errorMsg = errorTypeMatch ? errorTypeMatch[2] : null;
    return { line, errorType, errorMsg };
  }

  // Track container height
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new window.ResizeObserver(entries => {
      for (let entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);
    // Set initial height
    setContainerHeight(containerRef.current.offsetHeight);
    return () => observer.disconnect();
  }, [containerRef]);

  // Always render OutputNavBar, only render tab content if height > OUTPUT_NAVBAR_MIN_HEIGHT
  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-blackPrimary rounded-xl shadow flex flex-col overflow-x-auto"
      style={{
        overflow: 'hidden',
        height: isOutputCollapsed ? 54 : '100%',
        minHeight: 52,
        maxHeight: isOutputCollapsed ? 54 : undefined,
      }}
    >
      <OutputNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOutputCollapsed={isOutputCollapsed}
        onOutputCollapse={onOutputCollapse}
        collapsed={isRightPanelCollapsed}
        fullscreen={isOutputFullscreen}
        onFullscreen={() => setIsOutputFullscreen(true)}
        onExitFullscreen={isOutputFullscreen ? onExitFullscreen : undefined}
      />
      {/* New container for the tab content - conditionally rendered */}
      {containerHeight > OUTPUT_NAVBAR_MIN_HEIGHT && !isRightPanelCollapsed && (
        <div
          className="flex-1 flex flex-col overflow-auto pt-6"
        >
          {/* Tab Content */}
          {activeTab === 'cases' && (
            <div className="flex-1">
              {/* Test case tabs */}
              <div className="flex justify-center items-center gap-2">
                {allCases.map((tc, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "group px-4 py-[6px] rounded-full border font-medium text-sm flex items-center gap-2 text-greyPrimary dark:text-white transition-all duration-200",
                      selectedCase === idx
                        ? "bg-purpleSecondary border-transparent dark:text-greyPrimary"
                        : "bg-white border-[#CCCCCC] dark:bg-transparent hover:bg-purpleSecondary hover:border-transparent dark:hover:bg-purpleSecondary dark:hover:text-greyPrimary"
                    )}
                    onClick={() => setSelectedCase(idx)}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        selectedCase === idx
                          ? "bg-[#1EA378]"
                          : "bg-greyPrimary dark:bg-white group-hover:bg-[#1EA378] dark:group-hover:bg-[#1EA378]"
                      )}
                    />
                    Case {idx + 1}
                    {/* Show delete button for user-added test cases */}
                    {idx >= (testCases ? testCases.length : 0) && (
                      <div className='ml-1 h-4 w-4 grid place-content-center group hover:bg-red-900 rounded-full'>
                        <X
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveTestCase(idx);
                          }}
                          size={12}
                          className='text-black group-hover:text-white dark:text-white group-hover:dark:text-black'
                        />
                      </div>
                    )}
                  </button>
                ))}
                <div className='flex flex-col items-center gap-1'>
                  <div className="group relative flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.98 }}
                      className="ml-2 rounded-full bg-greyPrimary dark:bg-white grid place-content-center h-6 w-6"
                      onClick={() => {
                        // Clone the current input/output values
                        let input;
                        try {
                          input = JSON.parse(editInput);
                          if (!Array.isArray(input)) throw new Error('Input must be a JSON array');
                          console.log('input from output', input)
                        } catch (e) {
                          setOutputErrorMessage && setOutputErrorMessage('Cannot clone: Input must be a valid JSON array.');
                          return;
                        }
                        if (!editOutput.trim()) {
                          setOutputErrorMessage && setOutputErrorMessage('Cannot clone: Output cannot be empty.');
                          return;
                        }
                        setOutputErrorMessage && setOutputErrorMessage('');
                        const cloned = {
                          input,
                          output: editOutput
                        };
                        setUserTestCases([...userTestCases, cloned]);
                        if (skipNextEffectRef) skipNextEffectRef.current = true;
                        setSelectedCase(allCases.length); // select the new case
                        onEditInputChange(editInput);
                        onEditOutputChange(editOutput);
                      }}
                      title="Clone current test case"
                    >
                      <Plus className='text-white dark:text-blackPrimary' size={20} />
                    </motion.button>
                    <span className="absolute -top-[28px] -right-[60px] w-[90px] h-6 bg-purpleSecondary grid place-content-center rounded-tl-md rounded-br-md rounded-tr-md text-sm text-greyPrimary font-bold shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {`${allCases.length} / ${allCases.length}`}
                    </span>
                  </div>
                </div>
              </div>
              {/* Show selected test case input */}
              {selectedCase < allCases.length && allCases[selectedCase] && (
                <div className="flex flex-col p-6 gap-6">
                  <div className='flex flex-col gap-2'>
                    <span className="block font-semibold mb-2 text-base text-greyPrimary dark:text-white">Input</span>
                    <div className='px-4 py-2 bg-blueSecondary dark:bg-blackSecondary rounded-lg'>
                      <span className='block text-base text-greyPrimary dark:text-white mb-2'>{inputVars[0]}&nbsp;=</span>
                      <input
                        className="p-2 bg-blueSecondary dark:bg-[#1A2A2F] rounded-lg text-base text-greyPrimary dark:text-white w-full"
                        value={editInput}
                        onChange={e => {
                          onEditInputChange(e.target.value);
                          setOutputErrorMessage && setOutputErrorMessage('');
                        }}
                        placeholder='Enter Testcase input'
                      />
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className="block font-semibold mb-2 text-base text-greyPrimary dark:text-white">Output</span>
                    <input
                      className="bg-blueSecondary dark:bg-blackSecondary rounded-lg px-4 py-2 text-base text-greyPrimary dark:text-white"
                      value={editOutput}
                      onChange={e => {
                        onEditOutputChange(e.target.value);
                        setOutputErrorMessage && setOutputErrorMessage('');
                      }}
                      placeholder='Enter Testcase output'
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'results' && (
            <div className="px-6 min-h-0 h-full w-full flex-1 flex flex-col overflow-x-auto min-w-[400px]">
              {outputErrorMessage ? (
                <div className="flex flex-col gap-3">
                  <span className='text-xl font-semibold text-[#FF4E55]'>Invalid Testcase</span>
                  <div className='bg-[#412624] py-4 px-3 rounded-xl text-base text-[#FF4E55]'>
                    {outputErrorMessage}
                  </div>
                </div>
              ) : loading ? (
                <div className="flex-1 flex flex-col gap-4 min-h-0 h-full">
                  {/* <span className="animate-spin w-8 h-8 border-4 border-t-transparent border-purple-600 rounded-full"></span> */}
                  <Skeleton className="h-8 w-[93px] pt-6 bg-gray-300 dark:bg-gray-500 rounded-full mx-auto" />
                  <div className='flex flex-col gap-6'>
                    <Skeleton className="h-9 w-full max-w-[200px] bg-gray-300 dark:bg-gray-500 rounded-xl" />
                    <Skeleton className="h-9 w-full bg-gray-300 dark:bg-gray-500 rounded-xl" />
                    <Skeleton className="h-9 w-full bg-gray-300 dark:bg-gray-500 rounded-xl" />
                    <Skeleton className="h-9 w-full bg-gray-300 dark:bg-gray-500 rounded-xl" />
                  </div>
                </div>
              ) : (
                output.length > 0 && output[0] ? (
                  <div className='w-full flex flex-col gap-4'>
                    {/* Test case tabs for results, only if accepted and more than one case */}
                    {isAccepted && allCases.length > 0 && (
                      <div className="flex justify-center items-center gap-2">
                        {allCases.map((tc, idx) => (
                          <button
                            key={idx}
                            className={cn(
                              "group px-4 py-[6px] rounded-full border font-medium text-sm flex items-center gap-2 text-greyPrimary dark:text-white transition-all duration-200",
                              selectedCase === idx
                                ? "bg-purpleSecondary border-transparent dark:text-greyPrimary"
                                : "bg-white border-[#CCCCCC] dark:bg-transparent hover:bg-purpleSecondary hover:border-transparent dark:hover:bg-purpleSecondary dark:hover:text-greyPrimary"
                            )}
                            onClick={() => setSelectedCase(idx)}
                          >
                            <span
                              className={cn(
                                "w-2 h-2 rounded-full transition-all duration-200",
                                selectedCase === idx
                                  ? "bg-[#1EA378]"
                                  : "bg-greyPrimary dark:bg-white group-hover:bg-[#1EA378] dark:group-hover:bg-[#1EA378]"
                              )}
                            />
                            Case {idx + 1}
                            {/* No remove button here */}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          'font-semibold text-lg border-r-2 border-[#9E9E9E] pr-[18px]',
                          {
                            'text-[#1EA378]': isAccepted,
                            'text-[#EB5757]': !isAccepted
                          }
                        )}
                      >
                        {isAccepted ? 'Accepted' : 'Rejected'}
                      </span>
                      {/* Optionally, show runtime if available */}
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-greyPrimary dark:text-white" />
                        <span className="text-greyPrimary dark:text-white font-semibold text-sm">Runtime: <strong>{output[0].result.run.time * 1000}</strong> ms</span>
                      </div>
                      {/* {result.time && result.memory && (
                      )} */}
                    </div>
                    {/* Show stdout/output/stderr if present */}
                    {stderrValue && stderrValue.trim() ? (() => {
                      const { line, errorType, errorMsg } = parseError(stderrValue);
                      return (
                        <div className='flex flex-col gap-6 pb-6'>
                          <div className='p-6 rounded-xl bg-[#F5D2CA] dark:bg-[#4D2C28]/80 flex flex-col gap-2'>
                            <span className="text-[#EB5757] text-lg font-bold">{errorText}</span>
                            {line && (
                              <div className="text-[#FF4E55] font-bold">
                                Line {line}{errorType ? ` | ${errorType}` : ''}{errorMsg ? `: ${errorMsg}` : ''}
                              </div>
                            )}
                            <span className='text-[#FF4E55] text-sm font-medium whitespace-pre-wrap'>{stderrValue}</span>
                          </div>
                          <div className='flex flex-col gap-2'>
                            <span className="block font-semibold mb-2 text-base  text-purplePrimary">Last Executed Input</span>
                            <div className="bg-blueSecondary dark:bg-blackSecondary rounded-lg px-4 py-2 text-base">
                              <span className="font-semibold block text-greyPrimary dark:text-white">{inputVars[0]}=</span>
                              <span className="block text-greyPrimary dark:text-white">{editInput}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })() : (
                      // If no error, show input, output, and expected
                      <div className='flex flex-col gap-2 pb-6'>
                        <div className='flex flex-col gap-1'>
                          <span className="font-semibold text-sm text-greyPrimary dark:text-white">Input</span>
                          <div className="bg-blueSecondary dark:bg-blackSecondary rounded-xl px-5 py-[15px] text-base text-greyPrimary dark:text-white">
                            <span className="font-semibold block text-greyPrimary dark:text-white">{inputVars[0]}=</span>
                            <span className="block text-greyPrimary dark:text-white">{editInput}</span>
                          </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                          <span className="font-semibold text-sm text-greyPrimary dark:text-white">Output</span>
                          <div className="bg-blueSecondary dark:bg-blackSecondary rounded-xl px-5 py-[15px] text-base text-greyPrimary dark:text-white"> {stdoutValue || output[0]?.result?.eval?.[0]?.value}</div>
                        </div>
                        <div className='flex flex-col gap-1'>
                          <span className="font-semibold text-sm text-greyPrimary dark:text-white">Expected</span>
                          <div className="bg-blueSecondary dark:bg-blackSecondary rounded-xl px-5 py-[15px] text-base text-greyPrimary dark:text-white">{output[0]?.result?.eval?.[0]?.expected || editOutput}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center h-full overflow-hidden">
                    <span className="text-gray-400 text-lg text-center">You must run your code first</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Output