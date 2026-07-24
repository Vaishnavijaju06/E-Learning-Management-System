import { Navigate, useNavigate, useParams } from "react-router-dom";

import { studentQuizzes } from "../../data/studentQuizzes";
import { getQuizAttemptById } from "../../services/quizAttemptService";

function QuizResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const attempt = getQuizAttemptById(attemptId);

  if (!attempt) {
    return <Navigate to="/student/quizzes" replace />;
  }

  const quiz = studentQuizzes.find(
    (item) => item.id === attempt.quizId
  );

  return (
    <main className="container-fluid p-3 p-md-4">
      <section className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4 p-md-5 text-center">
          <div
            className={`quiz-result-icon ${
              attempt.passed ? "passed" : "failed"
            }`}
          >
            <i
              className={`bi ${
                attempt.passed
                  ? "bi-trophy-fill"
                  : "bi-x-circle-fill"
              }`}
            ></i>
          </div>

          <h1 className="fw-bold mt-4">
            {attempt.passed ? "Quiz Passed!" : "Keep Practising"}
          </h1>

          <p className="text-secondary">{attempt.quizTitle}</p>

          <div className="quiz-score-circle mx-auto my-4">
            {attempt.percentage}%
          </div>

          <div className="row g-3 justify-content-center mb-4">
            <div className="col-sm-4">
              <div className="result-stat">
                <strong>{attempt.correctAnswers}</strong>
                <span>Correct</span>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="result-stat">
                <strong>
                  {attempt.totalQuestions -
                    attempt.correctAnswers}
                </strong>
                <span>Incorrect</span>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="result-stat">
                <strong>{quiz?.passingPercentage || 0}%</strong>
                <span>Required</span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-primary-custom"
              onClick={() => navigate("/student/quizzes")}
            >
              Back to Quizzes
            </button>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() =>
                navigate("/student/quizzes/history")
              }
            >
              View History
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default QuizResultPage;