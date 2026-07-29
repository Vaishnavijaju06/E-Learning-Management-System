export const instructorQuizzes = [
  {
    id: 301,
    courseId: 101,
    title: "React Fundamentals Check",
    description: "Test core React concepts before starting advanced modules.",
    duration: 20,
    passingScore: 60,
    maxAttempts: 3,
    status: "PUBLISHED",
    questions: [
      {
        id: 1,
        text: "Which hook is used to manage local component state?",
        marks: 2,
        options: [
          { id: 1, text: "useState", correct: true },
          { id: 2, text: "useEffect", correct: false },
          { id: 3, text: "useContext", correct: false },
          { id: 4, text: "useMemo", correct: false },
        ],
      },
      {
        id: 2,
        text: "What must be unique among sibling elements rendered from a list?",
        marks: 2,
        options: [
          { id: 1, text: "className", correct: false },
          { id: 2, text: "key", correct: true },
          { id: 3, text: "id", correct: false },
          { id: 4, text: "ref", correct: false },
        ],
      },
    ],
  },
  {
    id: 302,
    courseId: 102,
    title: "Spring Boot REST API Quiz",
    description: "Review controllers, dependency injection and REST conventions.",
    duration: 25,
    passingScore: 70,
    maxAttempts: 2,
    status: "PUBLISHED",
    questions: [
      {
        id: 1,
        text: "Which annotation creates a REST controller?",
        marks: 2,
        options: [
          { id: 1, text: "@Controller", correct: false },
          { id: 2, text: "@Service", correct: false },
          { id: 3, text: "@RestController", correct: true },
          { id: 4, text: "@Repository", correct: false },
        ],
      },
    ],
  },
  {
    id: 303,
    courseId: 103,
    title: "SQL Query Practice",
    description: "A draft assessment covering joins and aggregate functions.",
    duration: 15,
    passingScore: 60,
    maxAttempts: 3,
    status: "DRAFT",
    questions: [],
  },
];

export const instructorQuizResults = [
  { id: 1, quizId: 301, studentId: 201, score: 92, attempt: 1, status: "PASSED", submittedAt: "26 Jul 2026" },
  { id: 2, quizId: 301, studentId: 202, score: 68, attempt: 2, status: "PASSED", submittedAt: "25 Jul 2026" },
  { id: 3, quizId: 302, studentId: 203, score: 95, attempt: 1, status: "PASSED", submittedAt: "24 Jul 2026" },
  { id: 4, quizId: 302, studentId: 204, score: 58, attempt: 2, status: "FAILED", submittedAt: "23 Jul 2026" },
];
