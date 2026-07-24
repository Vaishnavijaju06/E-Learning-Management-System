import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { studentQuizzes } from "../../data/studentQuizzes";
import {
  getQuizAttempts,
  saveQuizAttempt,
} from "../../services/quizAttemptService";

function QuizAttemptPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const quiz = studentQuizzes.find(
    (item) => item.id === Number(quizId)
  );

  const initialSeconds = quiz ? quiz.durationMinutes * 60 : 0;

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] =
    useState(initialSeconds);
  const [submitted, setSubmitted] = useState(false);

  const existingAttempts = useMemo(
    () => (quiz ? getQuizAttempts(quiz.id) : []),
    [quiz]
  );

  const submitQuiz = () => {
    if (!quiz || submitted) {
      return;
    }

    setSubmitted(true);

    const result = saveQuizAttempt(quiz, answers);

    toast.success("Quiz submitted successfully");

    navigate(`/student/quizzes/result/${result.id}`, {
      replace: true,
    });
  };

  useEffect(() => {
    if (!quiz || submitted) {
      return undefined;
    }

    if (remainingSeconds <= 0) {
      submitQuiz();
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((seconds) => seconds - 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [remainingSeconds, quiz, submitted]);

  if (!quiz) {
    return <Navigate to="/student/quizzes" replace />;
  }

  if (existingAttempts.length >= quiz.maxAttempts) {
    return <Navigate to="/student/quizzes" replace />;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const answeredCount = Object.keys(answers).length;

  const formattedTime = `${String(
    Math.floor(remainingSeconds / 60)
  ).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(
    2,
    "0"
  )}`;

  const handleAnswer = (questionId, optionId) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionId,
    }));
  };

  const handleManualSubmit = () => {
    const unansweredCount =
      quiz.questions.length - answeredCount;

    const message =
      unansweredCount > 0
        ? `${unansweredCount} question(s) are unanswered. Submit anyway?`
        : "Are you sure you want to submit the quiz?";

    if (window.confirm(message)) {
      submitQuiz();
    }
  };

  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="quiz-attempt-header card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between gap-3">
            <div>
              <span className="text-secondary">
                {quiz.courseTitle}
              </span>
              <h2 className="fw-bold mb-0">{quiz.title}</h2>
            </div>

            <div
              className={`quiz-timer ${
                remainingSeconds <= 60 ? "danger" : ""
              }`}
            >
              <i className="bi bi-clock me-2"></i>
              {formattedTime}
            </div>
          </div>

          <div className="progress mt-3 student-course-progress">
            <div
              className="progress-bar"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) /
                    quiz.questions.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <section className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <p className="text-primary fw-semibold">
                Question {currentQuestionIndex + 1} of{" "}
                {quiz.questions.length}
              </p>

              <h3 className="fw-bold mb-4">
                {currentQuestion.text}
              </h3>

              <div className="d-grid gap-3">
                {currentQuestion.options.map((option) => {
                  const selected =
                    Number(answers[currentQuestion.id]) ===
                    option.id;

                  return (
                    <label
                      key={option.id}
                      className={`quiz-option ${
                        selected ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        checked={selected}
                        onChange={() =>
                          handleAnswer(
                            currentQuestion.id,
                            option.id
                          )
                        }
                      />

                      <span>{option.text}</span>
                    </label>
                  );
                })}
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={currentQuestionIndex === 0}
                  onClick={() =>
                    setCurrentQuestionIndex((index) => index - 1)
                  }
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Previous
                </button>

                {currentQuestionIndex <
                quiz.questions.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary-custom"
                    onClick={() =>
                      setCurrentQuestionIndex((index) => index + 1)
                    }
                  >
                    Next
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleManualSubmit}
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="col-lg-4">
          <aside className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold">Question Navigation</h5>

              <div className="quiz-question-grid mt-3">
                {quiz.questions.map((question, index) => (
                  <button
                    key={question.id}
                    type="button"
                    className={`quiz-question-number ${
                      index === currentQuestionIndex
                        ? "current"
                        : answers[question.id]
                        ? "answered"
                        : ""
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <hr />

              <p className="mb-1">
                Answered:{" "}
                <strong>
                  {answeredCount}/{quiz.questions.length}
                </strong>
              </p>

              <button
                type="button"
                className="btn btn-danger w-100 mt-3"
                onClick={handleManualSubmit}
              >
                Submit Quiz
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default QuizAttemptPage;