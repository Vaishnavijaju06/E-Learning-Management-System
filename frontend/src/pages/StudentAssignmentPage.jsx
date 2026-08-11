import { useEffect, useState } from "react";

import assignmentApi from "../api/assignmentApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

function statusClass(status) {
  if (status === "EVALUATED") {
    return "bg-success";
  }

  if (status === "LATE") {
    return "bg-warning text-dark";
  }

  return "bg-primary";
}

export default function StudentAssignmentPage() {
  const toast = useToast();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [files, setFiles] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [assignmentResponse, submissionResponse] =
        await Promise.all([
          assignmentApi.studentList(),
          assignmentApi.mySubmissions()
        ]);

      setAssignments(assignmentResponse.data || []);
      setSubmissions(submissionResponse.data || []);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to load assignments";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadAssignment(assignment) {
    try {
      setError("");
      const response =
        await assignmentApi.downloadAssignment(
          assignment.id
        );
      const fileUrl = window.URL.createObjectURL(
        new Blob([response.data])
      );
      const link = document.createElement("a");

      link.href = fileUrl;
      link.download =
        assignment.originalFileName ||
        `assignment-${assignment.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl);
      toast.success("Assignment file downloaded.");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to download assignment file";
      setError(message);
      toast.error(message);
    }
  }

  function findSubmission(assignmentId) {
    return submissions.find(
      (submission) =>
        submission.assignmentId === assignmentId
    );
  }

  async function handleSubmit(assignmentId) {
    const file = files[assignmentId];

    if (!file) {
      const message = "Please select a file";
      setError(message);
      toast.warning(message);
      return;
    }

    try {
      setWorkingId(assignmentId);
      setError("");
      const data = new FormData();

      data.append("file", file);
      data.append(
        "comment",
        comments[assignmentId] || ""
      );

      await assignmentApi.submit(assignmentId, data);
      toast.success("Assignment submitted successfully.");

      setFiles((current) => ({
        ...current,
        [assignmentId]: null
      }));
      setComments((current) => ({
        ...current,
        [assignmentId]: ""
      }));

      await loadData();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to submit assignment";
      setError(message);
      toast.error(message);
    } finally {
      setWorkingId(null);
    }
  }

  if (loading) {
    return (
      <LoadingSpinner message="Loading assignments..." />
    );
  }

  return (
    <div className="container py-5">
      <div className="section-heading mb-4">
        <span className="section-eyebrow">
          Student workspace
        </span>
        <h1>My Assignments</h1>
        <p>
          Download instructions, submit your work and review
          instructor feedback.
        </p>
      </div>

      <AlertMessage>{error}</AlertMessage>

      {assignments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-clipboard2-check"></i>
          </div>
          <h2 className="h5">No assignments available</h2>
          <p className="mb-0">
            Published assignments for your enrolled courses will
            appear here.
          </p>
        </div>
      ) : (
        <div className="d-grid gap-4">
          {assignments.map((assignment) => {
            const submission = findSubmission(assignment.id);

            return (
              <article
                key={assignment.id}
                className="card assignment-card border-0"
              >
                <div className="card-body p-4">
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <span className="badge bg-light text-primary border mb-2">
                        {assignment.courseTitle}
                      </span>
                      <h2 className="h4 fw-bold mb-1">
                        {assignment.title}
                      </h2>
                      <p className="text-secondary mb-0">
                        {assignment.description}
                      </p>
                    </div>

                    <span className="badge bg-primary">
                      {assignment.status}
                    </span>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-sm-6 col-lg-3">
                      <div className="bg-light rounded-3 p-3 h-100">
                        <small className="text-secondary d-block">
                          Maximum marks
                        </small>
                        <strong className="fs-5">
                          {assignment.maximumMarks}
                        </strong>
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-4">
                      <div className="bg-light rounded-3 p-3 h-100">
                        <small className="text-secondary d-block">
                          Due date
                        </small>
                        <strong>
                          {new Date(
                            assignment.dueDate
                          ).toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {assignment.originalFileName ? (
                    <div className="border rounded-4 p-3 bg-light mb-4">
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="feature-icon-box mb-0">
                            <i className="bi bi-file-earmark-pdf"></i>
                          </div>
                          <div>
                            <strong className="d-block">
                              Assignment attachment
                            </strong>
                            <small className="text-secondary">
                              {assignment.originalFileName}
                            </small>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            handleDownloadAssignment(assignment)
                          }
                        >
                          <i className="bi bi-download me-2"></i>
                          Download
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="small text-muted">
                      No assignment file attached.
                    </p>
                  )}

                  {submission ? (
                    <div className="border rounded-4 p-4 bg-light">
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                        <h3 className="h6 fw-bold mb-0">
                          Your submission
                        </h3>
                        <span
                          className={`badge ${statusClass(
                            submission.status
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </div>

                      <p className="small text-secondary mb-2">
                        <i className="bi bi-file-earmark-check me-2"></i>
                        {submission.originalFileName}
                      </p>

                      {submission.marksObtained !== null && (
                        <div className="d-flex align-items-center gap-3 mt-3">
                          <div className="metric-card p-3">
                            <span className="metric-label">
                              Marks
                            </span>
                            <strong className="metric-value fs-4">
                              {submission.marksObtained}/
                              {submission.maximumMarks}
                            </strong>
                          </div>
                        </div>
                      )}

                      {submission.feedback && (
                        <div className="mt-3">
                          <small className="text-secondary d-block mb-1">
                            Instructor feedback
                          </small>
                          <p className="mb-0">
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border rounded-4 p-4">
                      <h3 className="h6 fw-bold mb-3">
                        Submit your solution
                      </h3>

                      <div className="mb-3">
                        <label className="form-label">
                          Solution file
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept=".pdf,.doc,.docx,.txt,.zip"
                          onChange={(event) =>
                            setFiles({
                              ...files,
                              [assignment.id]:
                                event.target.files[0]
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Comment (optional)
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Add a note for your instructor"
                          value={comments[assignment.id] || ""}
                          onChange={(event) =>
                            setComments({
                              ...comments,
                              [assignment.id]: event.target.value
                            })
                          }
                        />
                      </div>

                      <button
                        className="btn btn-primary"
                        disabled={workingId === assignment.id}
                        onClick={() =>
                          handleSubmit(assignment.id)
                        }
                      >
                        {workingId === assignment.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-cloud-arrow-up me-2"></i>
                            Submit Assignment
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
