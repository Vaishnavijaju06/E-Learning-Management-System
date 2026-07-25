import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { studentQuizzes } from "../../data/studentQuizzes";
import { getQuizAttempts } from "../../services/quizAttemptService";

function StudentQuizzesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");

  const filteredQuizzes = useMemo(() => {
    return studentQuizzes.filter((quiz) => {
      const attempts = getQuizAttempts(quiz.id);
      const passed = attempts.some((attempt) => attempt.passed);

      return (
        filter === "ALL" ||
        (filter === "AVAILABLE" &&
          !passed &&
          attempts.length < quiz.maxAttempts) ||
        (filter === "PASSED" && passed) ||
        (filter === "EXHAUSTED" &&
          !passed &&
          attempts.length >= quiz.maxAttempts)
      );
    });
  }, [filter]);

  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-1">My Quizzes</h1>
          <p className="text-secondary mb-0">
            Test your knowledge and review your previous attempts.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => navigate("/student/quizzes/history")}
        >
          <i className="bi bi-clock-history me-2"></i>
          Attempt History
        </button>
      </div>

      <section className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="d-flex flex-wrap gap-2">
            {["ALL", "AVAILABLE", "PASSED", "EXHAUSTED"].map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  className={`btn ${
                    filter === status
                      ? "btn-primary-custom"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setFilter(status)}
                >
                  {status.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      <div className="row g-4">
        {filteredQuizzes.map((quiz) => {
          const attempts = getQuizAttempts(quiz.id);
          const passed = attempts.some((attempt) => attempt.passed);
          const attemptsRemaining = Math.max(
            quiz.maxAttempts - attempts.length,
            0
          );

          return (
            <div className="col-md-6 col-xl-4" key={quiz.id}>
              <article className="card border-0 shadow-sm rounded-4 h-100 quiz-card">
                <div className="card-body p-4 d-flex flex-column">
                  <div className="quiz-card-icon">
                    <i className="bi bi-patch-question"></i>
                  </div>

                  <span className="badge bg-primary-subtle text-primary align-self-start mt-3">
                    {quiz.courseTitle}
                  </span>

                  <h4 className="fw-bold mt-3">{quiz.title}</h4>

                  <p className="text-secondary flex-grow-1">
                    {quiz.description}
                  </p>

                  <div className="row g-2 small mb-3">
                    <div className="col-6">
                      <i className="bi bi-list-check me-2 text-primary"></i>
                      {quiz.questions.length} questions
                    </div>

                    <div className="col-6">
                      <i className="bi bi-clock me-2 text-primary"></i>
                      {quiz.durationMinutes} minutes
                    </div>

                    <div className="col-6">
                      <i className="bi bi-trophy me-2 text-primary"></i>
                      Pass: {quiz.passingPercentage}%
                    </div>

                    <div className="col-6">
                      <i className="bi bi-arrow-repeat me-2 text-primary"></i>
                      {attemptsRemaining} attempts left
                    </div>
                  </div>

                  {passed && (
                    <div className="alert alert-success py-2">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Quiz passed
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-primary-custom w-100"
                    disabled={!passed && attemptsRemaining === 0}
                    onClick={() =>
                      navigate(`/student/quizzes/${quiz.id}/attempt`)
                    }
                  >
                    {passed
                      ? "Attempt Again"
                      : attemptsRemaining > 0
                      ? "Start Quiz"
                      : "Attempts Exhausted"}
                  </button>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {filteredQuizzes.length === 0 && (
        <section className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-5 text-center">
            <i className="bi bi-search display-3 text-secondary"></i>
            <h3 className="fw-bold mt-3">No quizzes found</h3>
            <p className="text-secondary">
              No quizzes match the selected filter.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

export default StudentQuizzesPage;