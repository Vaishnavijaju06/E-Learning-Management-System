export const studentCertificates = [
  {
    id: 1,
    certificateNumber: "SF-JAVA-2026-001",
    courseId: 1,
    courseTitle: "Complete Java and Spring Boot",
    studentName: "Garv Gupta",
    instructorName: "Rahul Sharma",
    completionDate: "2026-07-20",
    issueDate: "2026-07-21",
    score: 86,
    eligible: true,
    certificateAvailable: true,
  },
  {
    id: 2,
    certificateNumber: "SF-REACT-2026-002",
    courseId: 2,
    courseTitle: "React Frontend Development",
    studentName: "Garv Gupta",
    instructorName: "Priya Verma",
    completionDate: null,
    issueDate: null,
    score: 72,
    eligible: false,
    certificateAvailable: false,
    progress: 75,
    requirement:
      "Complete all lessons and pass the final quiz.",
  },
  {
    id: 3,
    certificateNumber: "SF-SQL-2026-003",
    courseId: 3,
    courseTitle: "SQL and Database Fundamentals",
    studentName: "Garv Gupta",
    instructorName: "Amit Patil",
    completionDate: "2026-07-15",
    issueDate: "2026-07-16",
    score: 91,
    eligible: true,
    certificateAvailable: true,
  },
];

export const getCertificateByNumber = (certificateNumber) =>
  studentCertificates.find(
    (certificate) =>
      certificate.certificateNumber === certificateNumber
  );