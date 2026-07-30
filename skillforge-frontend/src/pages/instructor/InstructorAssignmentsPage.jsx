import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import instructorAssignmentService from "../../services/instructorAssignmentService";

const formatDueDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

function InstructorAssignmentsPage() {
  const [assignments, setAssignments] = useState(() =>
    instructorAssignmentService.getAssignments()
  );
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const visibleAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assignments.filter(
      (assignment) =>
        (status === "ALL" || assignment.status === status) &&
        (!query ||
          assignment.title.toLowerCase().includes(query) ||
          assignment.courseTitle.toLowerCase().includes(query))
    );
  }, [assignments, search, status]);

  const toggleStatus = async (assignment) => {
    const nextStatus =
      assignment.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const result = await Swal.fire({
      title:
        nextStatus === "PUBLISHED"
          ? "Publish assignment?"
          : "Unpublish assignment?",
      text:
        nextStatus === "PUBLISHED"
          ? "Enrolled students will be able to view and submit it."
          : "Students will no longer see this assignment.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText:
        nextStatus === "PUBLISHED" ? "Publish" : "Unpublish",
    });
    if (!result.isConfirmed) return;

    instructorAssignmentService.updateStatus(assignment.id, nextStatus);
    setAssignments(instructorAssignmentService.getAssignments());
    toast.success(
      `Assignment ${
        nextStatus === "PUBLISHED" ? "published" : "unpublished"
      }.`
    );
  };

  const deleteAssignment = async (assignment) => {
    const result = await Swal.fire({
      title: "Delete draft assignment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;

    try {
      instructorAssignmentService.deleteAssignment(assignment.id);
      setAssignments(instructorAssignmentService.getAssignments());
      toast.success("Draft assignment deleted.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const overdueCount = assignments.filter(
    (item) =>
      item.status === "PUBLISHED" && new Date(item.dueDate).getTime() < Date.now()
  ).length;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Assignment Management</h1>
          <p className="text-secondary mb-0">
            Create coursework, review submissions and provide feedback.
          </p>
        </div>
        <Link to="/instructor/assignments/create" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>Create Assignment
        </Link>
      </div>

      <div className="row g-3 mb-4">
        {[
          ["Total Assignments", assignments.length, "bi-files", "primary"],
          [
            "Published",
            assignments.filter((item) => item.status === "PUBLISHED").length,
            "bi-broadcast",
            "success",
          ],
          [
            "Submissions",
            assignments.reduce((sum, item) => sum + item.submissionCount, 0),
            "bi-inbox",
            "info",
          ],
          ["Overdue", overdueCount, "bi-exclamation-triangle", "danger"],
        ].map(([label, value, icon, color]) => (
          <div className="col-6 col-xl-3" key={label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className={`bi ${icon} text-${color} fs-3`}></i>
                <div className="fs-3 fw-bold mt-2">{value}</div>
                <div className="small text-secondary">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body border-bottom">
          <div className="row g-3">
            <div className="col-lg-8">
              <input
                className="form-control"
                placeholder="Search assignment or course..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="col-lg-4">
              <select
                className="form-select"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
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
              <tr>
                <th>Assignment</th>
                <th>Deadline</th>
                <th>Submissions</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleAssignments.map((assignment) => {
                const isOverdue =
                  assignment.status === "PUBLISHED" &&
                  new Date(assignment.dueDate).getTime() < Date.now();
                return (
                  <tr key={assignment.id}>
                    <td>
                      <div className="fw-semibold">{assignment.title}</div>
                      <small className="text-secondary">
                        {assignment.courseTitle} · {assignment.totalMarks} marks
                      </small>
                    </td>
                    <td>
                      <span className={isOverdue ? "text-danger" : ""}>
                        {formatDueDate(assignment.dueDate)}
                      </span>
                      {isOverdue && (
                        <small className="d-block text-danger">Past deadline</small>
                      )}
                    </td>
                    <td>
                      {assignment.submissionCount}
                      <small className="d-block text-secondary">
                        {assignment.gradedCount} graded
                      </small>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          assignment.status === "PUBLISHED"
                            ? "text-bg-success"
                            : "text-bg-warning"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Link
                          className="btn btn-outline-primary"
                          to={`/instructor/assignments/${assignment.id}/edit`}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <Link
                          className="btn btn-outline-info"
                          to={`/instructor/assignments/${assignment.id}/submissions`}
                          title="Submissions"
                        >
                          <i className="bi bi-inbox"></i>
                        </Link>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => toggleStatus(assignment)}
                          title="Change status"
                        >
                          <i
                            className={`bi ${
                              assignment.status === "PUBLISHED"
                                ? "bi-eye-slash"
                                : "bi-send"
                            }`}
                          ></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          disabled={assignment.status !== "DRAFT"}
                          onClick={() => deleteAssignment(assignment)}
                          title="Delete draft"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {visibleAssignments.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-secondary py-5">
                    No assignments match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InstructorAssignmentsPage;
