export const courseDetails = {
  1: {
    subtitle:
      "Become a job-ready Java full-stack developer through practical projects.",
    description:
      "This course teaches complete web application development using Java, Spring Boot, React and MySQL. You will learn backend APIs, frontend development, database integration, security and deployment.",
    lastUpdated: "July 2026",
    certificate: true,
    requirements: [
      "Basic understanding of programming",
      "A computer with Java, VS Code and MySQL installed",
      "No previous Spring Boot or React experience required",
    ],
    outcomes: [
      "Build REST APIs using Spring Boot",
      "Develop responsive user interfaces using React",
      "Connect Spring Boot applications with MySQL",
      "Implement Spring Security and JWT authentication",
      "Test APIs using Postman",
      "Deploy a complete full-stack application",
    ],
    curriculum: [
      {
        id: 1,
        title: "Java and Project Setup",
        duration: "6 Hours",
        lessons: [
          "Java development environment",
          "Object-oriented programming revision",
          "Maven project structure",
          "Building the first Java application",
        ],
      },
      {
        id: 2,
        title: "Spring Boot REST API",
        duration: "12 Hours",
        lessons: [
          "Spring Boot architecture",
          "Controller, service and repository layers",
          "Creating REST endpoints",
          "Validation and exception handling",
        ],
      },
      {
        id: 3,
        title: "Database Development",
        duration: "8 Hours",
        lessons: [
          "MySQL database design",
          "Spring Data JPA",
          "Entity relationships",
          "Queries and transactions",
        ],
      },
      {
        id: 4,
        title: "React Frontend",
        duration: "14 Hours",
        lessons: [
          "React components and props",
          "State and hooks",
          "React Router",
          "Connecting React with REST APIs",
        ],
      },
      {
        id: 5,
        title: "Security and Deployment",
        duration: "12 Hours",
        lessons: [
          "Spring Security basics",
          "JWT authentication",
          "Role-based authorization",
          "Production build and deployment",
        ],
      },
    ],
  },
};

export const defaultCourseDetails = {
  subtitle: "Develop practical skills through guided lessons and projects.",
  description:
    "This course provides structured lessons, quizzes and practical exercises designed to help students gain industry-relevant knowledge.",
  lastUpdated: "July 2026",
  certificate: true,
  requirements: [
    "Basic computer knowledge",
    "A computer with an internet connection",
    "Willingness to learn and practise",
  ],
  outcomes: [
    "Understand the core concepts of the subject",
    "Apply concepts through practical exercises",
    "Complete quizzes and assignments",
    "Build a course project",
    "Receive a certificate after completion",
  ],
  curriculum: [
    {
      id: 1,
      title: "Introduction and Setup",
      duration: "4 Hours",
      lessons: [
        "Course introduction",
        "Required software setup",
        "Understanding the fundamentals",
      ],
    },
    {
      id: 2,
      title: "Core Concepts",
      duration: "10 Hours",
      lessons: [
        "Important concepts",
        "Guided demonstrations",
        "Practice exercises",
      ],
    },
    {
      id: 3,
      title: "Practical Project",
      duration: "8 Hours",
      lessons: [
        "Project requirements",
        "Project implementation",
        "Testing and submission",
      ],
    },
  ],
};