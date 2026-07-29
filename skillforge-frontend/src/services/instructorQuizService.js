import {
  instructorQuizResults,
  instructorQuizzes,
} from "../data/instructorQuizzes";
import instructorCourseService from "./instructorCourseService";
import instructorStudentService from "./instructorStudentService";

const QUIZZES_KEY = "skillforgeInstructorQuizzes";

const readQuizzes = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(QUIZZES_KEY));
    if (Array.isArray(stored)) return stored;
  } catch {
    // Restore demo data below.
  }
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(instructorQuizzes));
  return instructorQuizzes;
};

const saveQuizzes = (quizzes) => {
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
};

const withCourse = (quiz) => ({
  ...quiz,
  courseTitle:
    instructorCourseService.getCourses().find((course) => course.id === quiz.courseId)
      ?.title || "Unknown course",
  totalMarks: quiz.questions.reduce(
    (total, question) => total + Number(question.marks || 0),
    0
  ),
});

const instructorQuizService = {
  getQuizzes() {
    return readQuizzes().map(withCourse);
  },

  getQuizById(quizId) {
    const quiz = readQuizzes().find((item) => item.id === Number(quizId));
    if (!quiz) throw new Error("Quiz not found.");
    return withCourse(quiz);
  },

  saveQuiz(quizData) {
    const quizzes = readQuizzes();
    const normalized = {
      ...quizData,
      courseId: Number(quizData.courseId),
      duration: Number(quizData.duration),
      passingScore: Number(quizData.passingScore),
      maxAttempts: Number(quizData.maxAttempts),
    };

    if (quizData.id) {
      const index = quizzes.findIndex((item) => item.id === Number(quizData.id));
      if (index < 0) throw new Error("Quiz not found.");
      quizzes[index] = { ...normalized, id: Number(quizData.id) };
    } else {
      normalized.id = Math.max(300, ...quizzes.map((item) => item.id)) + 1;
      quizzes.push(normalized);
    }

    saveQuizzes(quizzes);
    return normalized;
  },

  updateStatus(quizId, status) {
    const quiz = this.getQuizById(quizId);
    if (status === "PUBLISHED" && quiz.questions.length === 0) {
      throw new Error("Add at least one question before publishing.");
    }
    return this.saveQuiz({ ...quiz, status });
  },

  deleteQuiz(quizId) {
    const quiz = this.getQuizById(quizId);
    if (quiz.status !== "DRAFT") {
      throw new Error("Unpublish the quiz before deleting it.");
    }
    saveQuizzes(readQuizzes().filter((item) => item.id !== Number(quizId)));
  },

  getResults(quizId) {
    const students = instructorStudentService.getStudents();
    return instructorQuizResults
      .filter((result) => result.quizId === Number(quizId))
      .map((result) => ({
        ...result,
        student:
          students.find((student) => student.id === result.studentId) || {
            name: "Unknown student",
            email: "",
          },
      }));
  },
};

export default instructorQuizService;
