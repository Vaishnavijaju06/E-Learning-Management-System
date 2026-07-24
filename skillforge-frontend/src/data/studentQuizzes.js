export const studentQuizzes = [
  {
    id: 1,
    courseId: 1,
    courseTitle: "Java Full Stack Development",
    title: "Java Fundamentals Assessment",
    description:
      "Test your understanding of Java fundamentals, OOP and Spring Boot.",
    durationMinutes: 5,
    passingPercentage: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 101,
        text: "Which method is the entry point of a Java application?",
        options: [
          { id: 1, text: "start()" },
          { id: 2, text: "run()" },
          { id: 3, text: "main()" },
          { id: 4, text: "execute()" },
        ],
        correctOptionId: 3,
      },
      {
        id: 102,
        text: "Which keyword is used to inherit a class in Java?",
        options: [
          { id: 1, text: "implements" },
          { id: 2, text: "extends" },
          { id: 3, text: "inherits" },
          { id: 4, text: "super" },
        ],
        correctOptionId: 2,
      },
      {
        id: 103,
        text: "Which collection does not allow duplicate values?",
        options: [
          { id: 1, text: "List" },
          { id: 2, text: "ArrayList" },
          { id: 3, text: "Set" },
          { id: 4, text: "LinkedList" },
        ],
        correctOptionId: 3,
      },
      {
        id: 104,
        text: "Which annotation creates a REST controller?",
        options: [
          { id: 1, text: "@Controller" },
          { id: 2, text: "@Component" },
          { id: 3, text: "@Service" },
          { id: 4, text: "@RestController" },
        ],
        correctOptionId: 4,
      },
      {
        id: 105,
        text: "Which Spring Boot file commonly stores configuration?",
        options: [
          { id: 1, text: "application.properties" },
          { id: 2, text: "package.json" },
          { id: 3, text: "index.html" },
          { id: 4, text: "settings.json" },
        ],
        correctOptionId: 1,
      },
    ],
  },
  {
    id: 2,
    courseId: 2,
    courseTitle: "React Frontend Development",
    title: "React Hooks Assessment",
    description:
      "Evaluate your knowledge of JSX, components, state and React hooks.",
    durationMinutes: 5,
    passingPercentage: 60,
    maxAttempts: 3,
    questions: [
      {
        id: 201,
        text: "Which hook manages local component state?",
        options: [
          { id: 1, text: "useEffect" },
          { id: 2, text: "useState" },
          { id: 3, text: "useContext" },
          { id: 4, text: "useRef" },
        ],
        correctOptionId: 2,
      },
      {
        id: 202,
        text: "Which hook is commonly used for API calls?",
        options: [
          { id: 1, text: "useEffect" },
          { id: 2, text: "useMemo" },
          { id: 3, text: "useReducer" },
          { id: 4, text: "useId" },
        ],
        correctOptionId: 1,
      },
      {
        id: 203,
        text: "What is JSX?",
        options: [
          { id: 1, text: "A database language" },
          { id: 2, text: "A Java framework" },
          { id: 3, text: "JavaScript syntax for describing UI" },
          { id: 4, text: "A CSS library" },
        ],
        correctOptionId: 3,
      },
      {
        id: 204,
        text: "Which prop helps React identify list elements?",
        options: [
          { id: 1, text: "id" },
          { id: 2, text: "key" },
          { id: 3, text: "name" },
          { id: 4, text: "index" },
        ],
        correctOptionId: 2,
      },
      {
        id: 205,
        text: "Which library is used for routing in this project?",
        options: [
          { id: 1, text: "React Router" },
          { id: 2, text: "Bootstrap Router" },
          { id: 3, text: "Axios Router" },
          { id: 4, text: "Vite Router" },
        ],
        correctOptionId: 1,
      },
    ],
  },
];