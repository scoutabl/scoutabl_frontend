import React, { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import OutputNavBar from './OutputNavBar';
import { useCodingAssesment } from './CodingAssesmentContext';
import { useEnums } from '@/context/EnumsContext';
import { motion } from 'framer-motion';
import ClockIcon from '@/assets/clock.svg?react';

function formatInputValue(val) {
  try {
    if (typeof val === 'string') {
      const parsed = JSON.parse(val);
      return JSON.stringify(parsed, null, 2);
    }
    return JSON.stringify(val, null, 2);
  } catch {
    return val;
  }
}

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
  isOutputFullscreen
}) => {
  const [newInput, setNewInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [newExpected, setNewExpected] = useState('');
  const [outputError, setOutputError] = useState('');
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef(null);
  const { setIsOutputFullscreen } = useCodingAssesment();
  const { enums } = useEnums();

  const allCases = [...(testCases || []), ...(userTestCases || [])];
  const isAdding = selectedCase === allCases.length;

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

  useEffect(() => {
    console.log(stderrValue)
  }, [stderrValue])

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
      setSelectedCase(allCases.length);
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
          className="flex-1 flex flex-col overflow-auto"
        >
          {/* Tab Content */}
          {activeTab === 'cases' && (
            // This div still has padding, but its parent is conditionally rendered
            <div className="flex-1">
              {/* Test case tabs */}
              <div className="flex justify-center items-center gap-2">
                {allCases.map((tc, idx) => (
                  <div key={idx} className="flex items-center">
                    <button
                      className={cn(
                        "px-4 py-[6px] rounded-full border font-medium text-sm flex items-center gap-2 text-greyPrimary dark:text-white",
                        selectedCase === idx ? "bg-purpleSecondary border-0 dark:text-greyPrimary" : "bg-white border-[#CCCCCC] dark:bg-transparent"
                      )}
                      onClick={() => setSelectedCase(idx)}
                    >
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          selectedCase === idx ? "bg-[#1EA378]" : "bg-greyPrimary dark:bg-white"
                        )}
                      />
                      Case {idx + 1}
                      {idx >= (testCases ? testCases.length : 0) && (
                        <div className='ml-1 h-4 w-4 grid place-content-center group hover:bg-red-900 rounded-full'>
                          <X onClick={e => { e.stopPropagation(); handleRemoveTestCase(idx); }} size={12} className='text-black group-hover:text-white' />
                        </div>
                      )}
                    </button>
                  </div>
                ))}
                <div className='flex flex-col items-center gap-1'>
                  <div className="group relative flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.98 }}
                      className="ml-2 rounded-full bg-greyPrimary dark:bg-white grid place-content-center h-6 w-6"
                      onClick={() => setSelectedCase(allCases.length)}
                      title="Add new test case"
                    >
                      <Plus className='text-white dark:text-blackPrimary' size={20} />
                    </motion.button>
                    <span className="absolute -top-[30px] -right-[60px] w-[65px] h-6 bg-purpleSecondary grid place-content-center rounded-tl-md rounded-br-md rounded-tr-md text-sm text-greyPrimary font-bold shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">
                      {allCases.length > 0 ? `${selectedCase + 1}/${allCases.length}` : '0/0'}
                    </span>
                  </div>
                </div>
              </div>
              {/* Add new test case input */}
              {isAdding && (
                <form onSubmit={handleAddTestCase} className='p-6 flex flex-col gap-3'>
                  <div className='flex flex-col gap-2'>
                    <label htmlFor='input' className='text-base font-medium text-greyPrimary dark:text-white'>{inputVars[0]}=</label>
                    <input
                      id='input'
                      className={cn(
                        "border rounded-[8px] p-2 text-sm w-full dark:placeholder:text-white text-greyPrimary dark:text-white",
                        inputError ? "border-red-500 dark:border-red-500" : "border-black dark:border-white"
                      )}
                      placeholder="Enter a valid JSON array, e.g. [1,2,3]"
                      value={newInput}
                      onChange={e => setNewInput(e.target.value)}
                    />
                    {inputError && <span className="text-red-500 text-xs">{inputError}</span>}
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label htmlFor='output' className='text-base font-medium text-greyPrimary dark:text-white'>Expected Output</label>
                    <input
                      id='output'
                      className={cn(
                        "border rounded-[8px] p-2 text-sm w-full dark:placeholder:text-white text-greyPrimary dark:text-white",
                        outputError ? "border-red-500 dark:border-red-500" : "border-black dark:border-white"
                      )}
                      placeholder="Enter a valid JSON array, e.g. [1,2,3]"
                      value={newExpected}
                      onChange={e => setNewExpected(e.target.value)}
                    />
                    {outputError && <span className="text-red-500 text-xs">{outputError}</span>}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-3 py-2 rounded-md h-10 w-fit bg-purplePrimary dark:text-black text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
                  >
                    Add Test Case
                  </motion.button>
                </form>
              )}
              {/* Show selected test case input */}
              {selectedCase < allCases.length && allCases[selectedCase] && (
                <div className="flex flex-col p-6 gap-6">
                  <div className='flex flex-col gap-2'>
                    <span className="block font-semibold mb-2 text-base  text-greyPrimary dark:text-white">Input</span>
                    <div className="bg-blueSecondary dark:bg-blackSecondary rounded-lg px-4 py-2 text-base">
                      <span className="font-semibold block text-greyPrimary dark:text-white">{inputVars[0]}=</span>
                      <span className="block text-greyPrimary dark:text-white">{JSON.stringify(allCases[selectedCase].input, null, 2)}</span>
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className="block font-semibold mb-2 text-base  text-greyPrimary dark:text-white">Output</span>
                    <div className="bg-blueSecondary dark:bg-blackSecondary rounded-lg px-4 py-2 text-base">
                      <span className="block text-greyPrimary dark:text-white">{(allCases[selectedCase].output)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'results' && (
            <div className="px-6 min-h-0 h-full w-full flex-1 flex flex-col overflow-x-auto min-w-[400px]">
              {loading ? (
                <div className="flex-1 flex items-center justify-center min-h-0 h-full">
                  <span className="animate-spin w-8 h-8 border-4 border-t-transparent border-purple-600 rounded-full"></span>
                </div>
              ) : (
                output.length > 0 && output[0] ? (
                  <div className='w-full flex flex-col gap-4'>
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
                      {output[0].result?.run?.time && (
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-greyPrimary dark:text-white" />
                          <span className="text-greyPrimary dark:text-white font-semibold text-sm">Runtime: <strong>{output[0].result.run.time * 1000}</strong> ms</span>
                        </div>
                      )}
                    </div>
                    {/* Show stdout/output/stderr if present */}
                    {stderrValue && stderrValue.trim() ? (() => {
                      const { line, errorType, errorMsg } = parseError(stderrValue);
                      return (
                        <div className='flex flex-col gap-6 pb-6'>
                          <div className='p-6 rounded-xl bg-[#F5D2CA] dark:bg-[#4D2C28]/80 flex flex-col gap-2'>
                            <span className="text-[#EB5757] text-base font-medium">{errorText}</span>
                            {line && (
                              <div className="text-[#FF4E55] font-bold">
                                Line {line}{errorType ? ` | ${errorType}` : ''}{errorMsg ? `: ${errorMsg}` : ''}
                              </div>
                            )}
                            <span className='text-[#FF4E55] text-sm font-medium whitespace-pre-wrap'>{stderrValue}</span>
                          </div>
                          <div className='flex flex-col gap-2'>
                            <span className="block font-semibold mb-2 text-base  text-purplePrimary dark:text-white">Last Executed Input</span>
                            <div className="bg-blueSecondary dark:bg-blackSecondary rounded-lg px-4 py-2 text-base">
                              <span className="font-semibold block text-greyPrimary dark:text-white">{inputVars[0]}=</span>
                              <span className="block text-greyPrimary dark:text-white">{JSON.stringify(allCases[selectedCase].input, null, 2)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })() : (
                      // If no error, show input, output, and expected
                      <div>
                        <div>
                          <span className="font-semibold text-sm text-greyPrimary">Input</span>
                          <div className="bg-blueSecondary rounded-xl px-5 py-[15px] text-base">
                            {inputVars[0]} = {'\n'}{JSON.stringify(allCases[selectedCase]?.input, null, 2)}
                          </div>
                        </div>
                        {stdoutValue && (
                          <div>
                            <span className="font-semibold text-sm text-greyPrimary">Output</span>
                            <div className="bg-blueSecondary rounded-xl px-5 py-[15px] text-base">{stdoutValue}</div>
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-sm text-greyPrimary">Expected</span>
                          <div className="bg-blueSecondary rounded-xl px-5 py-[15px] text-base">{allCases[selectedCase]?.output}</div>
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