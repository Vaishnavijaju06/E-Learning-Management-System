import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import instructorAssignmentService from "../../services/instructorAssignmentService";

function InstructorAssignmentSubmissionsPage() {
  const { assignmentId } = useParams();
  const [assignment] = useState(() => {
    try {
      return instructorAssignmentService.getAssignmentById(assignmentId);
    } catch {
      return null;
    }
  });
  const [submissions, setSubmissions] = useState(() =>
    assignment
      ? instructorAssignmentService.getSubmissions(assignmentId)
      : []
  );
  const [status, setStatus] = useState("ALL");
  const [editingId, setEditingId] = useState(null);
  const [grade, setGrade] = useState({ marks: "", feedback: "" });
  const [error, setError] = useState("");

  const visibleSubmissions = useMemo(
    () =>
      submissions.filter(
        (submission) => status === "ALL" || submission.status === status
      ),
    [status, submissions]
  );

  const startGrading = (submission) => {
    setEditingId(submission.id);
    setGrade({
      marks: submission.marks === "" ? "" : String(submission.marks),
      feedback: submission.feedback || "",
    });
    setError("");
  };

  const saveGrade = () => {
    const marks = Number(grade.marks);
    if (
      grade.marks === "" ||
      !Number.isFinite(marks) ||
      marks < 0 ||
      marks > assignment.totalMarks
    ) {
      setError(`Enter marks from 0 to ${assignment.totalMarks}.`);
      return;
    }
    if (grade.feedback.trim().length < 5) {
      setError("Feedback must contain at least five characters.");
      return;
    }

    instructorAssignmentService.gradeSubmission(
      editingId,
      marks,
      grade.feedback
    );
    setSubmissions(
      instructorAssignmentService.getSubmissions(assignmentId)
    );
    setEditingId(null);
    setError("");
    toast.success("Grade and feedback saved.");
  };

  if (!assignment) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">Assignment not found.</div>
        <Link to="/instructor/assignments" className="btn btn-primary">
          Return to Assignments
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link
            to="/instructor/assignments"
            className="btn btn-light border"
            aria-label="Back to assignments"
          >
            <i className="bi bi-arrow-left"></i>
          </Link>
          <div>
            <h1 className="h3 fw-bold mb-1">Student Submissions</h1>
            <p className="text-secondary mb-0">
              {assignment.title} · {assignment.totalMarks} marks
            </p>
          </div>
        </div>
        <select
          className="form-select"
          style={{ maxWidth: "220px" }}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="ALL">All submissions</option>
          <option value="SUBMITTED">Awaiting grading</option>
          <option value="LATE">Late</option>
          <option value="GRADED">Graded</option>
        </select>
      </div>

      <div className="row g-3 mb-4">
        {[
          ["Received", submissions.length, "primary"],
          [
            "Awaiting Grade",
            submissions.filter((item) => item.status !== "GRADED").length,
            "warning",
          ],
          [
            "Graded",
            submissions.filter((item) => item.status === "GRADED").length,
            "success",
          ],
        ].map(([label, value, color]) => (
          <div className="col-md-4" key={label}>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className={`fs-3 fw-bold text-${color}`}>{value}</div>
                <div className="small text-secondary">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Submission</th>
                <th>Status</th>
                <th>Grade</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td>
                    <div className="fw-semibold">{submission.student.name}</div>
                    <small className="text-secondary">
                      {submission.student.email}
                    </small>
                  </td>
                  <td>
                    <div>{submission.fileName}</div>
                    <small className="text-secondary">
                      {new Date(submission.submittedAt).toLocaleString("en-IN")}
                    </small>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        submission.status === "GRADED"
                          ? "text-bg-success"
                          : submission.status === "LATE"
                          ? "text-bg-danger"
                          : "text-bg-warning"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td>
                    {submission.status === "GRADED"
                      ? `${submission.marks}/${assignment.totalMarks}`
                      : "Not graded"}
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => startGrading(submission)}
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      {submission.status === "GRADED" ? "Update" : "Grade"}
                    </button>
                  </td>
                </tr>
              ))}
              {visibleSubmissions.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-secondary py-5">
                    No submissions match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (
        <div className="card border-primary shadow-sm mt-4">
          <div className="card-header bg-primary text-white fw-semibold">
            Grade Submission
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row g-3">
              <div className="col-md-3">
                <label htmlFor="marks" className="form-label">
                  Marks (out of {assignment.totalMarks})
                </label>
                <input
                  id="marks"
                  type="number"
                  min="0"
                  max={assignment.totalMarks}
                  className="form-control"
                  value={grade.marks}
                  onChange={(event) =>
                    setGrade((current) => ({
                      ...current,
                      marks: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-md-9">
                <label htmlFor="feedback" className="form-label">
                  Feedback
                </label>
                <textarea
                  id="feedback"
                  rows="3"
                  className="form-control"
                  value={grade.feedback}
                  onChange={(event) =>
                    setGrade((current) => ({
                      ...current,
                      feedback: event.target.value,
                    }))
                  }
                  placeholder="Explain strengths and areas to improve..."
                ></textarea>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={saveGrade}>
                Save Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorAssignmentSubmissionsPage;
