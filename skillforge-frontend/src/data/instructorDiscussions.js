export const instructorDiscussions = [
  {
    id: 501,
    courseId: 101,
    studentId: 201,
    studentName: "Aarav Sharma",
    studentEmail: "aarav@example.com",
    title: "Difference between useMemo and useCallback",
    message:
      "I understand that both help with optimization, but when should I use useMemo instead of useCallback?",
    createdAt: "2026-07-26T10:20:00.000Z",
    status: "OPEN",
    reply: "",
    repliedAt: null,
  },
  {
    id: 502,
    courseId: 101,
    studentId: 202,
    studentName: "Snehal Adode",
    studentEmail: "snehal@example.com",
    title: "Protected route redirects after refresh",
    message:
      "My protected page redirects to login for a moment after refreshing. How should I restore the logged-in user?",
    createdAt: "2026-07-25T07:45:00.000Z",
    status: "RESOLVED",
    reply:
      "Read the saved user during AuthContext initialization and render a loading state until that check finishes.",
    repliedAt: "2026-07-25T12:15:00.000Z",
  },
  {
    id: 503,
    courseId: 102,
    studentId: 203,
    studentName: "Riya Patel",
    studentEmail: "riya@example.com",
    title: "Spring Security filter order",
    message:
      "Does the JWT filter execute before UsernamePasswordAuthenticationFilter, and why is that order important?",
    createdAt: "2026-07-24T15:30:00.000Z",
    status: "OPEN",
    reply:
      "Yes. Add the JWT filter before UsernamePasswordAuthenticationFilter so the SecurityContext is populated before authorization runs.",
    repliedAt: "2026-07-24T17:05:00.000Z",
  },
  {
    id: 504,
    courseId: 103,
    studentId: 204,
    studentName: "Kabir Mehta",
    studentEmail: "kabir@example.com",
    title: "SQL query returns duplicate employees",
    message:
      "My join shows the same employee multiple times. Is DISTINCT the correct solution or should I change the join?",
    createdAt: "2026-07-23T09:10:00.000Z",
    status: "RESOLVED",
    reply:
      "First verify the relationship and join condition. DISTINCT can hide a wrong join, so use it only when duplicate result rows are actually expected.",
    repliedAt: "2026-07-23T10:00:00.000Z",
  },
  {
    id: 505,
    courseId: 101,
    studentId: 205,
    studentName: "Meera Joshi",
    studentEmail: "meera@example.com",
    title: "Where should Axios interceptors be configured?",
    message:
      "Should every service create its own interceptor, or should the application use one shared Axios instance?",
    createdAt: "2026-07-22T18:40:00.000Z",
    status: "OPEN",
    reply: "",
    repliedAt: null,
  },
];
