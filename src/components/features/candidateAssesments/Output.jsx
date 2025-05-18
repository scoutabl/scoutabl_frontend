import React, { useState } from 'react'
import { Plus, CheckSquare, BarChart2 } from 'lucide-react';

import testCaseIcon from '/testCaseIcon.svg'
import testResultIcon from '/testResultIcon.svg'
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
  collapsed
}) => {
  const [newInput, setNewInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [newExpected, setNewExpected] = useState('');

  const allCases = [...(testCases || []), ...(userTestCases || [])];
  const isAdding = selectedCase === allCases.length;

  const result = output[0] || {}; // Only one result at a time
  const isUserTestCase = selectedCase >= (testCases ? testCases.length : 0);
  const hasExpected = typeof result.expected !== 'undefined' && result.expected !== '';

  // Add new test case
  const handleAddTestCase = () => {
    try {
      const parsed = JSON.parse(newInput);
      if (!Array.isArray(parsed)) throw new Error('Input must be an array');
      setUserTestCases([...userTestCases, { input: parsed, output: newExpected }]);
      setNewInput('');
      setNewExpected('');
      setInputError('');
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

  if (collapsed) {
    // Render only the tabs in a white, rounded container
    return (
      <div className="bg-white rounded-2xl shadow h-full w-full flex flex-col">
        <div className="flex items-center gap-4 mb-6 p-6">
          <button
            className={`flex items-center gap-2 px-2 py-1 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'cases' ? 'border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:text-green-700'}`}
            onClick={() => setActiveTab('cases')}
          >
            <img src={testCaseIcon} alt="testCaseIcon" />
            Testcase
          </button>
          <button
            className={`flex items-center gap-2 px-2 py-1 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'results' ? 'border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:text-green-700'}`}
            onClick={() => setActiveTab('results')}
          >
            <img src={testResultIcon} alt="testResultIcon" />
            Test Result
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 h-full flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <button
          className={`flex items-center gap-2 px-2 py-1 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'cases' ? 'border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:text-green-700'}`}
          onClick={() => setActiveTab('cases')}
        >
          <img src={testCaseIcon} alt="testCaseIcon" />
          Testcase
        </button>
        <button
          className={`flex items-center gap-2 px-2 py-1 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'results' ? 'border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:text-green-700'}`}
          onClick={() => setActiveTab('results')}
        >
          <img src={testResultIcon} alt="testResultIcon" />
          Test Result
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'cases' && (
        <div className="py-2 space-y-4 flex-1 overflow-auto">
          {/* Test case tabs */}
          <div className="flex justify-center items-center gap-2 mb-4 pt-6">
            {allCases.map((tc, idx) => (
              <div key={idx} className="flex items-center">
                <button
                  className={`px-4 py-[6px] rounded-full border ${selectedCase === idx ? 'bg-purpleSecondary border-0 ' : 'bg-white border-[#CCCCCC]'} font-medium text-sm flex items-center gap-1 text-greyPrimary `}
                  onClick={() => setSelectedCase(idx)}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedCase === idx ? 'bg-[#1EA378]' : 'bg-greyPrimary'}`}></span>
                  Case {idx + 1}
                  {idx >= (testCases ? testCases.length : 0) && (
                    <span
                      className="ml-1 text-gray-400 hover:text-red-500 cursor-pointer"
                      onClick={e => { e.stopPropagation(); handleRemoveTestCase(idx); }}
                    >×</span>
                  )}
                </button>
              </div>
            ))}
            <div className='flex flex-col items-center gap-1'>
              <div className="relative flex items-center">
                <button
                  className="ml-2 rounded-full bg-greyPrimary flex items-center"
                  onClick={() => setSelectedCase(allCases.length)}
                  title="Add new test case"
                >
                  <Plus color="white" />
                </button>
                <span className="absolute -top-[30px] -right-[60px] w-[65px] h-6 bg-purpleSecondary grid place-content-center rounded-tl-md rounded-br-md rounded-tr-md text-sm text-greyPrimary font-bold shadow">
                  {allCases.length > 0 ? `${selectedCase + 1}/${allCases.length}` : '0/0'}
                </span>
              </div>
            </div>
          </div>
          {/* Add new test case input */}
          {isAdding && (
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold">Add New Test Case</label>
              <div>
                <label className="block text-sm font-medium mb-1">{inputVars[0]} =</label>
                <input
                  className="border rounded px-2 py-1 text-sm w-full"
                  placeholder="Enter a valid JSON array, e.g. [1,2,3]"
                  value={newInput}
                  onChange={e => setNewInput(e.target.value)}
                />
                <label className="block text-sm font-medium mb-1 mt-2">Expected Output</label>
                <input
                  className="border rounded px-2 py-1 text-sm w-full"
                  placeholder="Enter expected output"
                  value={newExpected}
                  onChange={e => setNewExpected(e.target.value)}
                />
              </div>
              <button
                className="self-start bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                onClick={handleAddTestCase}
              >
                Add Test Case
              </button>
              {inputError && <div className="text-red-500 text-xs mt-1">{inputError}</div>}
            </div>
          )}
          {/* Show selected test case input */}
          {selectedCase < allCases.length && allCases[selectedCase] && (
            <div className="space-y-2">
              <div>
                <span className="block font-semibold mb-2 text-sm text-greyPrimary">Input</span>
                <div className="bg-blue-50 rounded-lg px-4 py-2 text-base">
                  <div>
                    <span className="font-semibold block">{inputVars[0]}=</span>
                    <span className="block">{JSON.stringify(allCases[selectedCase].input, null, 2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === 'results' && (
        <div className="py-2 min-h-0 h-full flex-1 flex flex-col overflow-auto">
          {loading ? (
            <div className="flex-1 flex items-center justify-center min-h-0 h-full">
              <span className="animate-spin w-8 h-8 border-4 border-t-transparent border-purple-600 rounded-full"></span>
            </div>
          ) : (
            output.length > 0 ? (
              <div className='w-full flex flex-col gap-4'>
                {/* Runtime Error Box */}
                {result.stdout && result.stdout.toLowerCase().includes('error') ? (
                  <div className="bg-[#FFE5E5] border border-[#FFBABA] rounded-lg p-6 mb-2">
                    <pre className="text-[#D7263D] text-base font-mono whitespace-pre-wrap break-all">{result.stdout}</pre>
                  </div>
                ) : (
                  hasExpected && (
                    <div className="flex">
                      <span className={`font-bold text-lg ${result.isCorrect ? 'text-[#008B00]' : 'text-[#EB5757]'}`}>
                        {result.isCorrect ? 'Accepted' : 'Wrong Answer'}
                      </span>
                      {result.runtime && (
                        <span className="text-gray-400 ml-4">Runtime: {result.runtime} ms</span>
                      )}
                    </div>
                  )
                )}
                {/* Last Executed Input */}
                <div>
                  <span className="block text-greyPrimary font-semibold mb-2">Input</span>
                  <div className="flex flex-col gap-2">
                    {result.input && result.input.map(i => (
                      <div key={i.name} className="bg-blueSecondary rounded-xl px-5 py-[15px] text-base">
                        <span className="font-semibold block text-sm text-greyPrimary">{i.name}=</span>
                        <span className="block text-sm text-greyPrimary">{JSON.stringify(i.value, null, 2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Only show stdout/output/expected if not error */}
                {!result.stdout || !result.stdout.toLowerCase().includes('error') ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-sm text-greyPrimary">Stdout</span>
                      <div className="bg-blueSecondary rounded-xl px-5 py-[15px] text-base">{result.stdout}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-sm text-greyPrimary">Output</span>
                      <div className="bg-blueSecondary rounded-xl px-5 py-[15px] text-base">{result.output}</div>
                    </div>
                    {/* Only show Expected if present */}
                    {hasExpected && (
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-sm text-greyPrimary">Expected</span>
                        <div className="bg-blueSecondary rounded-xl px-5 py-[15px] text-base">{result.expected}</div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center min-h-0 h-full overflow-hidden">
                <span className="text-gray-400 text-lg text-center">You must run your code first</span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default Output