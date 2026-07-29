import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import instructorQuizService from "../../services/instructorQuizService";

function InstructorQuizzesPage() {
  const [quizzes, setQuizzes] = useState(() => instructorQuizService.getQuizzes());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const visibleQuizzes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return quizzes.filter(
      (quiz) =>
        (status === "ALL" || quiz.status === status) &&
        (!query ||
          quiz.title.toLowerCase().includes(query) ||
          quiz.courseTitle.toLowerCase().includes(query))
    );
  }, [quizzes, search, status]);

  const toggleStatus = async (quiz) => {
    const nextStatus = quiz.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const result = await Swal.fire({
      title: nextStatus === "PUBLISHED" ? "Publish quiz?" : "Unpublish quiz?",
      text:
        nextStatus === "PUBLISHED"
          ? "Enrolled students will be able to attempt it."
          : "Students will no longer see this quiz.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: nextStatus === "PUBLISHED" ? "Publish" : "Unpublish",
    });
    if (!result.isConfirmed) return;

    try {
      instructorQuizService.updateStatus(quiz.id, nextStatus);
      setQuizzes(instructorQuizService.getQuizzes());
      toast.success(`Quiz ${nextStatus === "PUBLISHED" ? "published" : "unpublished"}.`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteQuiz = async (quiz) => {
    const result = await Swal.fire({
      title: "Delete draft quiz?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      instructorQuizService.deleteQuiz(quiz.id);
      setQuizzes(instructorQuizService.getQuizzes());
      toast.success("Draft quiz deleted.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Quiz Management</h1>
          <p className="text-secondary mb-0">Create assessments and review learner results.</p>
        </div>
        <Link to="/instructor/quizzes/create" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>Create Quiz
        </Link>
      </div>

      <div className="row g-3 mb-4">
        {[
          ["Total Quizzes", quizzes.length, "bi-ui-checks-grid", "primary"],
          ["Published", quizzes.filter((q) => q.status === "PUBLISHED").length, "bi-broadcast", "success"],
          ["Drafts", quizzes.filter((q) => q.status === "DRAFT").length, "bi-pencil-square", "warning"],
          ["Questions", quizzes.reduce((sum, q) => sum + q.questions.length, 0), "bi-question-circle", "info"],
        ].map(([label, value, icon, color]) => (
          <div className="col-6 col-xl-3" key={label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className={`bi ${icon} text-${color} fs-3`}></i>
                <div className="fs-3 fw-bold mt-2">{value}</div>
                <div className="text-secondary small">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body border-bottom">
          <div className="row g-3">
            <div className="col-lg-8">
              <input className="form-control" placeholder="Search quiz or course..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="col-lg-4">
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="ALL">All statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr><th>Quiz</th><th>Questions</th><th>Rules</th><th>Status</th><th className="text-end">Actions</th></tr>
            </thead>
            <tbody>
              {visibleQuizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td><div className="fw-semibold">{quiz.title}</div><small className="text-secondary">{quiz.courseTitle}</small></td>
                  <td>{quiz.questions.length}<small className="d-block text-secondary">{quiz.totalMarks} marks</small></td>
                  <td><small>{quiz.duration} min · Pass {quiz.passingScore}%<br />Max {quiz.maxAttempts} attempts</small></td>
                  <td><span className={`badge ${quiz.status === "PUBLISHED" ? "text-bg-success" : "text-bg-warning"}`}>{quiz.status}</span></td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <Link className="btn btn-outline-primary" to={`/instructor/quizzes/${quiz.id}/edit`} title="Edit"><i className="bi bi-pencil"></i></Link>
                      <Link className="btn btn-outline-info" to={`/instructor/quizzes/${quiz.id}/results`} title="Results"><i className="bi bi-bar-chart"></i></Link>
                      <button className="btn btn-outline-secondary" onClick={() => toggleStatus(quiz)} title="Change status"><i className={`bi ${quiz.status === "PUBLISHED" ? "bi-eye-slash" : "bi-send"}`}></i></button>
                      <button className="btn btn-outline-danger" disabled={quiz.status !== "DRAFT"} onClick={() => deleteQuiz(quiz)} title="Delete draft"><i className="bi bi-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleQuizzes.length === 0 && <tr><td colSpan="5" className="text-center text-secondary py-5">No quizzes match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InstructorQuizzesPage;
