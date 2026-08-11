import { useEffect, useState } from "react";

import assignmentApi from "../api/assignmentApi";
import { courseApi } from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

function assignmentStatusClass(status) {
  if (status === "PUBLISHED") {
    return "bg-success";
  }

  if (status === "CLOSED") {
    return "bg-dark";
  }

  return "bg-warning text-dark";
}

export default function InstructorAssignmentPage() {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    maximumMarks: 100,
    dueDate: ""
  });
  const [file, setFile] = useState(null);
  const [marks, setMarks] = useState({});
  const [feedback, setFeedback] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [courseResponse, assignmentResponse] =
        await Promise.all([
          courseApi.instructorList(),
          assignmentApi.instructorList()
        ]);

      setCourses(courseResponse.data || []);
      setAssignments(assignmentResponse.data || []);
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

  async function handleCreate(event) {
    event.preventDefault();

    try {
      setWorking(true);
      setError("");
      const data = new FormData();

      data.append("courseId", form.courseId);
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("maximumMarks", form.maximumMarks);
      data.append("dueDate", form.dueDate);

      if (file) {
        data.append("file", file);
      }

      await assignmentApi.create(data);
      toast.success("Assignment created successfully.");

      setForm({
        courseId: "",
        title: "",
        description: "",
        maximumMarks: 100,
        dueDate: ""
      });
      setFile(null);
      await loadData();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to create assignment";
      setError(message);
      toast.error(message);
    } finally {
      setWorking(false);
    }
  }

  async function handlePublish(id) {
    try {
      setWorking(true);
      await assignmentApi.publish(id);
      toast.success(
        "Assignment published to enrolled students."
      );
      await loadData();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to publish assignment";
      setError(message);
      toast.error(message);
    } finally {
      setWorking(false);
    }
  }

  async function handleClose(id) {
    try {
      setWorking(true);
      await assignmentApi.close(id);
      toast.info("Assignment closed successfully.");
      await loadData();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to close assignment";
      setError(message);
      toast.error(message);
    } finally {
      setWorking(false);
    }
  }

  async function loadSubmissions(assignment) {
    try {
      setSelectedAssignment(assignment);
      const response = await assignmentApi.submissions(
        assignment.id
      );
      setSubmissions(response.data || []);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to load submissions";
      setError(message);
      toast.error(message);
    }
  }

  async function handleEvaluate(submission) {
    const marksValue = marks[submission.id];
    const feedbackValue = feedback[submission.id] || "";

    if (
      marksValue === undefined ||
      marksValue === null ||
      marksValue === ""
    ) {
      const message = "Please enter marks before evaluation";
      setError(message);
      toast.warning(message);
      return;
    }

    const numericMarks = Number(marksValue);

    if (Number.isNaN(numericMarks)) {
      const message = "Marks must be a valid number";
      setError(message);
      toast.warning(message);
      return;
    }

    if (numericMarks < 0) {
      const message = "Marks cannot be negative";
      setError(message);
      toast.warning(message);
      return;
    }

    if (numericMarks > submission.maximumMarks) {
      const message = `Marks cannot exceed ${submission.maximumMarks}`;
      setError(message);
      toast.warning(message);
      return;
    }

    try {
      setWorking(true);
      setError("");
      await assignmentApi.evaluate(submission.id, {
        marksObtained: numericMarks,
        feedback: feedbackValue.trim()
      });

      toast.success("Assignment evaluated successfully.");
      setMarks((current) => ({
        ...current,
        [submission.id]: ""
      }));
      setFeedback((current) => ({
        ...current,
        [submission.id]: ""
      }));
      await loadSubmissions(selectedAssignment);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to evaluate assignment";
      setError(message);
      toast.error(message);
    } finally {
      setWorking(false);
    }
  }

  async function handleDownloadSubmission(submission) {
    try {
      setError("");
      const response =
        await assignmentApi.downloadSubmission(
          submission.id
        );
      const blob = new Blob([response.data]);
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = fileUrl;
      link.download =
        submission.originalFileName ||
        `submission-${submission.id}`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl);
      toast.success("Student submission downloaded.");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to download student submission";
      setError(message);
      toast.error(message);
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
          Instructor workspace
        </span>
        <h1>Assignment Management</h1>
        <p>
          Create assignments, publish them to students and
          evaluate submitted work.
        </p>
      </div>

      <AlertMessage>{error}</AlertMessage>

      <div className="card border-0 mb-5">
        <div className="card-header bg-white d-flex align-items-center gap-3">
          <div className="feature-icon-box mb-0">
            <i className="bi bi-clipboard2-plus"></i>
          </div>
          <div>
            <h2 className="h5 fw-bold mb-1">
              Create Assignment
            </h2>
            <small className="text-secondary">
              Assign work to students enrolled in your course.
            </small>
          </div>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleCreate}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Course</label>
                <select
                  className="form-select"
                  required
                  value={form.courseId}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      courseId: event.target.value
                    })
                  }
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Assignment title
                </label>
                <input
                  className="form-control"
                  placeholder="e.g. Build a REST API"
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value
                    })
                  }
                />
              </div>

              <div className="col-12">
                <label className="form-label">
                  Instructions
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe the task and submission requirements"
                  required
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Maximum marks
                </label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  required
                  value={form.maximumMarks}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      maximumMarks: event.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Due date</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  required
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      dueDate: event.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Attachment (optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.doc,.docx,.txt,.zip"
                  onChange={(event) =>
                    setFile(event.target.files[0])
                  }
                />
              </div>
            </div>

            <button
              className="btn btn-primary mt-4"
              disabled={working}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create Assignment
            </button>
          </form>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
        <div>
          <h2 className="h4 fw-bold mb-1">Assignments</h2>
          <p className="text-secondary mb-0">
            {assignments.length} assignment
            {assignments.length === 1 ? "" : "s"} created
          </p>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="empty-state mb-5">
          <div className="empty-state-icon">
            <i className="bi bi-clipboard2"></i>
          </div>
          <h3 className="h5">No assignments created</h3>
          <p className="mb-0">
            Use the form above to create your first assignment.
          </p>
        </div>
      ) : (
        <div className="row g-4 mb-5">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="col-lg-6"
            >
              <article className="card assignment-card h-100 border-0">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <small className="text-primary fw-semibold">
                        {assignment.courseTitle}
                      </small>
                      <h3 className="h5 fw-bold mt-1">
                        {assignment.title}
                      </h3>
                    </div>
                    <span
                      className={`badge ${assignmentStatusClass(
                        assignment.status
                      )}`}
                    >
                      {assignment.status}
                    </span>
                  </div>

                  <p className="text-secondary line-clamp-3">
                    {assignment.description}
                  </p>

                  <div className="d-flex gap-4 small mb-4">
                    <span>
                      <i className="bi bi-award me-1 text-primary"></i>
                      {assignment.maximumMarks} marks
                    </span>
                    <span>
                      <i className="bi bi-calendar-event me-1 text-primary"></i>
                      {new Date(
                        assignment.dueDate
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    {assignment.status === "DRAFT" && (
                      <button
                        className="btn btn-success btn-sm"
                        disabled={working}
                        onClick={() =>
                          handlePublish(assignment.id)
                        }
                      >
                        <i className="bi bi-send me-1"></i>
                        Publish
                      </button>
                    )}

                    {assignment.status === "PUBLISHED" && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={working}
                        onClick={() =>
                          handleClose(assignment.id)
                        }
                      >
                        <i className="bi bi-lock me-1"></i>
                        Close
                      </button>
                    )}

                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() =>
                        loadSubmissions(assignment)
                      }
                    >
                      <i className="bi bi-people me-1"></i>
                      View Submissions
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      {selectedAssignment && (
        <section>
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
            <div>
              <span className="section-eyebrow">
                Student work
              </span>
              <h2 className="h4 fw-bold mt-1 mb-0">
                Submissions: {selectedAssignment.title}
              </h2>
            </div>
            <span className="badge bg-primary">
              {submissions.length} submissions
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="bi bi-inbox"></i>
              </div>
              <h3 className="h5">No submissions yet</h3>
              <p className="mb-0">
                Student submissions will appear here.
              </p>
            </div>
          ) : (
            <div className="d-grid gap-3">
              {submissions.map((submission) => (
                <article
                  key={submission.id}
                  className="card border-0"
                >
                  <div className="card-body p-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                      <div>
                        <h3 className="h6 fw-bold mb-1">
                          {submission.studentName}
                        </h3>
                        <p className="small text-secondary mb-0">
                          {submission.studentEmail}
                        </p>
                      </div>
                      <span className="badge bg-light text-primary border">
                        {submission.status}
                      </span>
                    </div>

                    <div className="border rounded-4 bg-light p-3 mb-3">
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-file-earmark-arrow-down text-primary fs-4"></i>
                          <span className="fw-semibold">
                            {submission.originalFileName ||
                              "Student submission"}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            handleDownloadSubmission(submission)
                          }
                        >
                          <i className="bi bi-download me-1"></i>
                          Download
                        </button>
                      </div>

                      {submission.comment && (
                        <p className="small text-secondary mt-2 mb-0">
                          Comment: {submission.comment}
                        </p>
                      )}
                    </div>

                    <div className="row g-3 align-items-end">
                      <div className="col-md-3">
                        <label className="form-label">Marks</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Marks"
                          min="0"
                          max={submission.maximumMarks}
                          value={
                            marks[submission.id] ??
                            submission.marksObtained ??
                            ""
                          }
                          onChange={(event) =>
                            setMarks({
                              ...marks,
                              [submission.id]: event.target.value
                            })
                          }
                        />
                      </div>

                      <div className="col-md-7">
                        <label className="form-label">
                          Feedback
                        </label>
                        <input
                          className="form-control"
                          placeholder="Share constructive feedback"
                          value={
                            feedback[submission.id] ??
                            submission.feedback ??
                            ""
                          }
                          onChange={(event) =>
                            setFeedback({
                              ...feedback,
                              [submission.id]: event.target.value
                            })
                          }
                        />
                      </div>

                      <div className="col-md-2">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          disabled={working}
                          onClick={() =>
                            handleEvaluate(submission)
                          }
                        >
                          Evaluate
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
