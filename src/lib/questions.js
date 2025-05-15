export const questions = [
    {
        questionId: 15,
        type: 'video',
        questionTitle: "Explain how you would implement a shopping cart feature in a React e-commerce application.",
        durationSeconds: 120, // 2 minutes
        instructions: [
            "State management (Redux/Context)",
            "Cart operations (add/remove/update)",
            "Persistence (localStorage)",
            "Cart summary calculation"
        ]
    },
    {
        questionId: 2,
        type: 'mcq',
        questionTitle: "Which React Hook would you use for data fetching?",
        instructions: [
            "Choose the most appropriate hook for handling API calls.",
            "Consider side effects and component lifecycle.",
            "Think about cleanup and memory leaks.",
            "Consider error handling capabilities."
        ],
        options: [
            "useState",
            "useEffect",
            "useCallback",
            "useMemo"
        ],
        correctAnswer: 1,
        assessmentCriteria: "Your answer will be assessed based on understanding of React Hooks and their use cases."
    },
    {
        questionId: 3,
        type: 'multi-select',
        questionTitle: "Select all valid ways to optimize React performance",
        instructions: [
            "Consider both runtime and build-time optimizations.",
            "Think about component rendering optimization.",
            "Consider state management optimization.",
            "Think about code splitting and lazy loading."
        ],
        options: [
            "Using React.memo for component memoization",
            "Implementing useMemo and useCallback hooks",
            "Using PureComponent for class components",
            "Adding key prop to list items"
        ],
        correctAnswers: [0, 1, 2, 3],
        assessmentCriteria: "Your selections will be evaluated based on understanding of React performance optimization techniques."
    },
    {
        questionId: 4,
        type: 'rearrange',
        questionTitle: "Arrange the following lifecycle phases in the correct order:",
        items: [
            "Component Mounting",
            "Component Updating",
            "Component Unmounting",
            "Component Initialization"
        ],
        correctOrder: [3, 0, 1, 2], // indices in correct order
        explanation: "The correct lifecycle order is: Initialization → Mounting → Updating → Unmounting"
    },
    {
        questionId: 5,
        type: 'long-answer',
        questionTitle: "Explain the concept of React's Virtual DOM and how it improves performance.",
        sampleAnswer: "The Virtual DOM is a lightweight copy of the actual DOM. When state changes occur, React first updates the Virtual DOM and then compares it with the previous version (diffing). Only the necessary changes are then applied to the actual DOM, reducing expensive DOM manipulations and improving performance.",
        maxWords: 250
    },
    {
        questionId: 6,
        type: 'mcq',
        questionTitle: "Which React Hook would you use for data fetching?",
        instructions: [
            "Choose the most appropriate hook for handling API calls.",
            "Consider side effects and component lifecycle.",
            "Think about cleanup and memory leaks.",
            "Consider error handling capabilities."
        ],
        options: [
            "useState",
            "useEffect",
            "useCallback",
            "useMemo"
        ],
        correctAnswer: 1,
        assessmentCriteria: "Your answer will be assessed based on understanding of React Hooks and their use cases."
    },
    {
        questionId: 7,
        type: 'video',
        questionTitle: "Demonstrate how to implement a drag-and-drop feature in React.",
        durationSeconds: 300, // 5 minutes
        requirements: [
            "Show code implementation",
            "Demonstrate working feature",
            "Explain key concepts",
            "Handle edge cases"
        ]
    },
    {
        questionId: 8,
        type: 'mcq',
        questionTitle: "What is the purpose of the useEffect hook in React?",
        options: [
            "To handle side effects in functional components",
            "To create new React components",
            "To style React components",
            "To define component props"
        ],
        correctAnswer: 0,
        explanation: "useEffect is used for handling side effects like data fetching, subscriptions, or DOM manipulations in functional components."
    },
    {
        questionId: 9,
        type: 'multi-select',
        questionTitle: "Which of the following are valid ways to style React components? (Select all that apply)",
        options: [
            "Inline styles",
            "CSS modules",
            "Styled-components",
            "HTML style tags"
        ],
        correctAnswers: [0, 1, 2],
        explanation: "Inline styles, CSS modules, and styled-components are all valid ways to style React components. HTML style tags are not recommended in React."
    },
    {
        questionId: 10,
        type: 'true-false',
        questionTitle: "Props in React components are immutable.",
        correctAnswer: true,
        explanation: "Props in React are read-only and cannot be modified by a component. This helps maintain the one-way data flow in React applications."
    },
    {
        questionId: 11,
        type: 'rearrange',
        questionTitle: "Arrange the following steps in the correct order for making an API call in React:",
        items: [
            "Define state variables",
            "Make API call using fetch/axios",
            "Update state with response data",
            "Handle loading and error states"
        ],
        correctOrder: [0, 3, 1, 2],
        explanation: "The proper order is: Define state → Set up loading/error handling → Make API call → Update state with response"
    },
    {
        questionId: 12,
        type: 'long-answer',
        questionTitle: "Describe the differences between React Class components and Functional components, and when you would use each.",
        sampleAnswer: "Class components are ES6 classes that extend React.Component and have a render method. They can have state, lifecycle methods, and 'this' binding. Functional components are simpler, use hooks for state and lifecycle features, and are generally preferred in modern React development for their simplicity and better performance. Class components might still be used in legacy code or when specific class features are needed.",
        maxWords: 200
    },
    {
        questionId: 13,
        type: 'voice',
        questionTitle: "Explain the concept of React Context and when you would use it instead of prop drilling.",
        durationSeconds: 120,
        keyPoints: [
            "Context API basics",
            "Provider and Consumer components",
            "Use cases and benefits",
            "Comparison with prop drilling"
        ]
    },
    {
        questionId: 14,
        type: 'video',
        questionTitle: "Show how to implement and use custom hooks in React.",
        durationSeconds: 300,
        requirements: [
            "Create a custom hook",
            "Demonstrate its usage",
            "Show reusability",
            "Explain best practices"
        ]
    },
    {
        questionId: 1,
        type: 'rating',
        questionTitle: "What is the difference between controlled and uncontrolled components in React forms?",
        sampleAnswer: "Controlled components have their state controlled by React through props and setState, while uncontrolled components maintain their own internal state using refs.",
        maxWords: 50
    }
];