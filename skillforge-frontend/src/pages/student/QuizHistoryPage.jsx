import { useNavigate } from "react-router-dom";

import { getAllQuizAttempts } from "../../services/quizAttemptService";

function QuizHistoryPage() {
  const navigate = useNavigate();

  const attempts = [...getAllQuizAttempts()].sort(
    (first, second) =>
      new Date(second.submittedAt) -
      new Date(first.submittedAt)
  );

  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="d-flex justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-1">Quiz History</h1>
          <p className="text-secondary mb-0">
            Review your previous quiz results.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary align-self-start"
          onClick={() => navigate("/student/quizzes")}
        >
          Back
        </button>
      </div>

      {attempts.length === 0 ? (
        <section className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-5 text-center">
            <i className="bi bi-clock-history display-3 text-secondary"></i>
            <h3 className="fw-bold mt-3">No attempts yet</h3>
            <p className="text-secondary">
              Complete a quiz to see its result here.
            </p>
          </div>
        </section>
      ) : (
        <section className="card border-0 shadow-sm rounded-4">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Quiz</th>
                  <th>Score</th>
                  <th>Correct</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt.id}>
                    <td>
                      <strong>{attempt.quizTitle}</strong>
                      <small className="d-block text-secondary">
                        {attempt.courseTitle}
                      </small>
                    </td>

                    <td className="fw-bold">
                      {attempt.percentage}%
                    </td>

                    <td>
                      {attempt.correctAnswers}/
                      {attempt.totalQuestions}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          attempt.passed
                            ? "bg-success-subtle text-success"
                            : "bg-danger-subtle text-danger"
                        }`}
                      >
                        {attempt.passed ? "Passed" : "Failed"}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        attempt.submittedAt
                      ).toLocaleString()}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          navigate(
                            `/student/quizzes/result/${attempt.id}`
                          )
                        }
                      >
                        Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default QuizHistoryPage;