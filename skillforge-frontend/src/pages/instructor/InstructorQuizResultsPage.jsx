import { Link, useParams } from "react-router-dom";
import instructorQuizService from "../../services/instructorQuizService";

function InstructorQuizResultsPage() {
  const { quizId } = useParams();
  const quiz = instructorQuizService.getQuizById(quizId);
  const results = instructorQuizService.getResults(quizId);
  const average = results.length ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length) : 0;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/instructor/quizzes" className="btn btn-outline-secondary"><i className="bi bi-arrow-left"></i></Link>
        <div><h1 className="h3 fw-bold mb-1">Quiz Results</h1><p className="text-secondary mb-0">{quiz.title} · {quiz.courseTitle}</p></div>
      </div>
      <div className="row g-3 mb-4">
        {[["Attempts", results.length], ["Average Score", `${average}%`], ["Passed", results.filter((r) => r.status === "PASSED").length], ["Failed", results.filter((r) => r.status === "FAILED").length]].map(([label, value]) => <div className="col-6 col-lg-3" key={label}><div className="card border-0 shadow-sm"><div className="card-body"><div className="fs-3 fw-bold">{value}</div><div className="text-secondary small">{label}</div></div></div></div>)}
      </div>
      <div className="card border-0 shadow-sm"><div className="table-responsive"><table className="table align-middle mb-0"><thead className="table-light"><tr><th>Student</th><th>Attempt</th><th>Score</th><th>Result</th><th>Submitted</th></tr></thead><tbody>
        {results.map((result) => <tr key={result.id}><td><div className="fw-semibold">{result.student.name}</div><small className="text-secondary">{result.student.email}</small></td><td>#{result.attempt}</td><td className="fw-semibold">{result.score}%</td><td><span className={`badge ${result.status === "PASSED" ? "text-bg-success" : "text-bg-danger"}`}>{result.status}</span></td><td>{result.submittedAt}</td></tr>)}
        {results.length === 0 && <tr><td colSpan="5" className="text-center text-secondary py-5">No student attempts yet.</td></tr>}
      </tbody></table></div></div>
    </div>
  );
}

export default InstructorQuizResultsPage;
