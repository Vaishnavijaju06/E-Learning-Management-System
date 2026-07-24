export const studentCourses = [
  {
    id: 1,
    title: "Java Full Stack Development",
    instructor: "Amit Sharma",
    category: "Development",
    description:
      "Master Java, Spring Boot, REST APIs, MySQL and React through practical projects.",
    icon: "bi-cup-hot",
    color: "danger",
    totalLessons: 9,
    modules: [
      {
        id: 101,
        title: "Java Fundamentals",
        lessons: [
          {
            id: 1001,
            title: "Introduction to Java",
            duration: "12 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34",
            content:
              "Learn what Java is, how it works and why it is widely used.",
          },
          {
            id: 1002,
            title: "Variables and Data Types",
            duration: "18 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34",
            content:
              "Understand Java variables, primitive data types and type conversion.",
          },
          {
            id: 1003,
            title: "Java Operators",
            duration: "15 min",
            type: "READING",
            content:
              "Learn arithmetic, relational, logical and assignment operators in Java.",
          },
        ],
      },
      {
        id: 102,
        title: "Object-Oriented Programming",
        lessons: [
          {
            id: 1004,
            title: "Classes and Objects",
            duration: "22 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34",
            content:
              "Understand how classes act as blueprints for creating objects.",
          },
          {
            id: 1005,
            title: "Inheritance",
            duration: "20 min",
            type: "READING",
            content:
              "Learn how inheritance supports code reuse and hierarchical relationships.",
          },
          {
            id: 1006,
            title: "Polymorphism",
            duration: "24 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34",
            content:
              "Understand method overloading, overriding and runtime polymorphism.",
          },
        ],
      },
      {
        id: 103,
        title: "Spring Boot",
        lessons: [
          {
            id: 1007,
            title: "Introduction to Spring Boot",
            duration: "26 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/9SGDpanrc8U",
            content:
              "Learn how Spring Boot simplifies Java application development.",
          },
          {
            id: 1008,
            title: "Building REST APIs",
            duration: "32 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/9SGDpanrc8U",
            content:
              "Create REST controllers and expose application resources using HTTP.",
          },
          {
            id: 1009,
            title: "Spring Security and JWT",
            duration: "35 min",
            type: "READING",
            content:
              "Understand authentication, authorization and JWT-based API security.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "React Frontend Development",
    instructor: "Priya Verma",
    category: "Development",
    description:
      "Build modern web applications using React, hooks, routing and Context API.",
    icon: "bi-code-slash",
    color: "primary",
    totalLessons: 6,
    modules: [
      {
        id: 201,
        title: "React Fundamentals",
        lessons: [
          {
            id: 2001,
            title: "Introduction to React",
            duration: "16 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
            content:
              "Understand React components and the component-based UI approach.",
          },
          {
            id: 2002,
            title: "JSX and Components",
            duration: "22 min",
            type: "READING",
            content:
              "Learn JSX syntax and create reusable functional components.",
          },
          {
            id: 2003,
            title: "Props and State",
            duration: "28 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
            content:
              "Understand how components receive data and manage internal state.",
          },
        ],
      },
      {
        id: 202,
        title: "React Hooks",
        lessons: [
          {
            id: 2004,
            title: "Using useState",
            duration: "18 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
            content:
              "Manage changing component data with the useState hook.",
          },
          {
            id: 2005,
            title: "Using useEffect",
            duration: "25 min",
            type: "READING",
            content:
              "Perform side effects such as API calls using useEffect.",
          },
          {
            id: 2006,
            title: "Working with Context API",
            duration: "30 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
            content:
              "Share application state without passing props through every component.",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "MySQL Database Mastery",
    instructor: "Neha Patil",
    category: "Database",
    description:
      "Learn relational database concepts, SQL queries, joins and database design.",
    icon: "bi-database",
    color: "warning",
    totalLessons: 4,
    modules: [
      {
        id: 301,
        title: "SQL Essentials",
        lessons: [
          {
            id: 3001,
            title: "Database Fundamentals",
            duration: "20 min",
            type: "READING",
            content:
              "Understand databases, tables, rows, columns and primary keys.",
          },
          {
            id: 3002,
            title: "SQL CRUD Operations",
            duration: "28 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/7S_tz1z_5bA",
            content:
              "Use SELECT, INSERT, UPDATE and DELETE statements.",
          },
          {
            id: 3003,
            title: "SQL Joins Explained",
            duration: "32 min",
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/7S_tz1z_5bA",
            content:
              "Combine related records using INNER, LEFT, RIGHT and CROSS joins.",
          },
          {
            id: 3004,
            title: "Database Normalization",
            duration: "24 min",
            type: "READING",
            content:
              "Organize database tables using the normal forms.",
          },
        ],
      },
    ],
  },
];