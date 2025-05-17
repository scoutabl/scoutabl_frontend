import React, { useState } from 'react'
import { Plus } from 'lucide-react';

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
  loading
}) => {
  const [newInputs, setNewInputs] = useState(() =>
    Object.fromEntries((inputVars || []).map(v => [v, '']))
  );
  const [newExpected, setNewExpected] = useState('');
  const [newInput, setNewInput] = useState('');
  const [inputError, setInputError] = useState('');

  const allCases = [...(testCases || []), ...(userTestCases || [])];

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

  const result = output[0] || {}; // Only one result at a time

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200 mb-4">
        <button
          className={`flex items-center gap-2 px-2 py-1 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'cases' ? 'border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:text-green-700'}`}
          onClick={() => setActiveTab('cases')}
        >
          <span className="inline-block w-4 h-4 bg-green-100 rounded mr-1" />
          Testcase
        </button>
        <button
          className={`flex items-center gap-2 px-2 py-1 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'results' ? 'border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:text-green-700'}`}
          onClick={() => setActiveTab('results')}
        >
          <span className="inline-block w-4 h-4 bg-green-100 rounded mr-1" />
          Test Result
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'cases' && (
        <div className="py-2 space-y-4">
          {/* Test case tabs */}
          <div className="flex items-center gap-2 mb-4">
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
            <div className='relative'>
              <button
                className="ml-2 rounded-full bg-greyPrimary flex items-center"
                onClick={() => setSelectedCase(allCases.length)}
                title="Add new test case"
              ><Plus color='white' /></button>
              <span className="absolute -top-[30px] -right-[60px] w-[65px] h-6 bg-purpleSecondary grid place-content-center rounded-tl-md rounded-br-md rounded-tr-md text-sm text-greyPrimary font-bold">
                {allCases.length > 0 ? `${selectedCase + 1}/${allCases.length}` : '0/0'}
              </span>
            </div>
          </div>
          {selectedCase === allCases.length && (
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold">Add New Test Case</label>
              {inputVars.length === 1 && (
                <div>
                  <label className="block text-sm font-medium mb-1">{inputVars[0]} =</label>
                  <input
                    className="border rounded px-2 py-1 text-sm w-full"
                    placeholder={`Enter value for ${inputVars[0]}`}
                    value={newInputs[inputVars[0]]}
                    onChange={e => setNewInputs(inputs => ({ ...inputs, [inputVars[0]]: e.target.value }))}
                  />
                </div>
              )}
              <input
                className="border rounded px-2 py-1 text-sm"
                placeholder="Expected Output"
                value={newExpected}
                onChange={e => setNewExpected(e.target.value)}
              />
              <button
                className="self-start bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(newInputs[inputVars[0]]);
                    if (!Array.isArray(parsed)) throw new Error('Input must be an array');
                    setUserTestCases([...userTestCases, { input: parsed, output: newExpected }]);
                    setNewInputs({ ...newInputs, [inputVars[0]]: '' });
                    setNewExpected('');
                    setInputError('');
                    setSelectedCase(allCases.length);
                  } catch (e) {
                    setInputError('Input must be a valid JSON array');
                  }
                }}
              >
                Add Test Case
              </button>
              {inputError && <div className="text-red-500 text-xs mt-1">{inputError}</div>}
            </div>
          )}
          {selectedCase < allCases.length && allCases[selectedCase] && (
            <div className="space-y-2">
              <div>
                <span className="block font-semibold mb-1">Input</span>
                <div className="bg-blue-50 rounded-lg px-4 py-2 text-base font-mono">
                  {inputVars.length === 1 && (
                    <div>
                      <span className="font-semibold">{inputVars[0]} =</span>
                      <pre className="whitespace-pre-wrap break-all ml-2">
                        {JSON.stringify(allCases[selectedCase].input, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              {typeof allCases[selectedCase].output !== 'undefined' && (
                <div>
                  <span className="block font-semibold mb-1">Expected Output:</span>
                  <div className="bg-blue-50 rounded-lg px-4 py-2 text-base font-mono">
                    <pre className="whitespace-pre-wrap break-all">
                      {JSON.stringify(allCases[selectedCase].output, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {activeTab === 'results' && (
        <div className="py-2 min-h-[200px] flex items-center justify-center">
          {loading ? (
            <span className="animate-spin w-8 h-8 border-4 border-t-transparent border-purple-600 rounded-full"></span>
          ) : (
            output.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className={`font-bold text-lg ${result.output === result.expected ? 'text-green-500' : 'text-red-500'}`}>
                    {result.output === result.expected ? 'Accepted' : 'Wrong Answer'}
                  </span>
                  {result.runtime && (
                    <span className="text-gray-400">Runtime: {result.runtime}</span>
                  )}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Input</span>
                  <div className="bg-gray-800 text-white rounded px-4 py-2 font-mono">
                    {result.input && result.input.map(i => (
                      <div key={i.name}>{i.name} = {i.value}</div>
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Stdout</span>
                  <div className="bg-gray-800 text-white rounded px-4 py-2 font-mono">{result.stdout}</div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Output</span>
                  <div className="bg-gray-800 text-white rounded px-4 py-2 font-mono">{result.output}</div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Expected</span>
                  <div className="bg-gray-800 text-white rounded px-4 py-2 font-mono">{result.expected}</div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default Output