const ATTEMPT_STORAGE_KEY = "skillforge-quiz-attempts";

const getStoredAttempts = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(ATTEMPT_STORAGE_KEY)) || []
    );
  } catch {
    return [];
  }
};

export const getAllQuizAttempts = () => {
  return getStoredAttempts();
};

export const getQuizAttempts = (quizId) => {
  return getStoredAttempts().filter(
    (attempt) => attempt.quizId === Number(quizId)
  );
};

export const saveQuizAttempt = (quiz, answers) => {
  const correctAnswers = quiz.questions.filter(
    (question) =>
      Number(answers[question.id]) === question.correctOptionId
  ).length;

  const totalQuestions = quiz.questions.length;

  const percentage = Math.round(
    (correctAnswers / totalQuestions) * 100
  );

  const attempt = {
    id: Date.now(),
    quizId: quiz.id,
    quizTitle: quiz.title,
    courseTitle: quiz.courseTitle,
    answers,
    correctAnswers,
    totalQuestions,
    percentage,
    passed: percentage >= quiz.passingPercentage,
    submittedAt: new Date().toISOString(),
  };

  const attempts = getStoredAttempts();

  localStorage.setItem(
    ATTEMPT_STORAGE_KEY,
    JSON.stringify([...attempts, attempt])
  );

  return attempt;
};

export const getQuizAttemptById = (attemptId) => {
  return getStoredAttempts().find(
    (attempt) => attempt.id === Number(attemptId)
  );
};