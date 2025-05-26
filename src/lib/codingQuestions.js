export const questionsData = [
    {
        id: 1,
        title: "Array Prototype Last",
        inputVars: ["nums"],
        callPattern: "console.log(nums.last());",
        instructions: [
            "Write code that enhances all arrays such that you can call the array.last() method on any array and it will return the last element. If there are no elements in the array, it should return -1.",
            // ...other instructions
        ],
        testCases: [
            { input: [3, 2, 1], output: 1, explanation: "Because there are no elements, return -1" }
        ],
        constraints: [
            ['arr is a valid JSON array', '0 <= arr.length <= 1000']
        ]
    },
    {
        id: 2,
        title: "Array Prototype First",
        inputVars: ["nums"],
        callPattern: "console.log(nums.first());",
        instructions: [
            "Write code that enhances all arrays such that you can call the array.first() method on any array and it will return the first element. If there are no elements in the array, it should return -1.",
            // ...other instructions
        ],
        testCases: [
            { input: [3, 2, 1], output: 3, explanation: "Because there are no elements, return -1" }
        ],
        constraints: [
            ['arr is a valid JSON array', '0 <= arr.length <= 1000']
        ]
    }
    // ...other questions
];
