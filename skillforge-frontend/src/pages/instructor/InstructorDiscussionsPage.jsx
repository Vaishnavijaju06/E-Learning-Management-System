import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import instructorCourseService from "../../services/instructorCourseService";
import instructorDiscussionService from "../../services/instructorDiscussionService";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

function InstructorDiscussionsPage() {
  const [discussions, setDiscussions] = useState(() =>
    instructorDiscussionService.getDiscussions()
  );
  const [selectedId, setSelectedId] = useState(
    () => instructorDiscussionService.getDiscussions()[0]?.id || null
  );
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [reply, setReply] = useState("");
  const [replyError, setReplyError] = useState("");

  const courses = useMemo(
    () => instructorCourseService.getCourses(),
    []
  );

  const visibleDiscussions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return discussions.filter(
      (discussion) =>
        (courseId === "ALL" ||
          discussion.courseId === Number(courseId)) &&
        (status === "ALL" ||
          discussion.status === status ||
          (status === "UNANSWERED" && !discussion.reply)) &&
        (!query ||
          discussion.title.toLowerCase().includes(query) ||
          discussion.message.toLowerCase().includes(query) ||
          discussion.studentName.toLowerCase().includes(query) ||
          discussion.courseTitle.toLowerCase().includes(query))
    );
  }, [courseId, discussions, search, status]);

  const selectedDiscussion =
    discussions.find((item) => item.id === selectedId) || null;

  const selectDiscussion = (discussion) => {
    setSelectedId(discussion.id);
    setReply(discussion.reply || "");
    setReplyError("");
  };

  const refresh = (keepSelectedId = selectedId) => {
    const updated = instructorDiscussionService.getDiscussions();
    setDiscussions(updated);
    setSelectedId(keepSelectedId);
  };

  const handleReplySubmit = (event) => {
    event.preventDefault();
    if (!selectedDiscussion) return;

    try {
      instructorDiscussionService.saveReply(selectedDiscussion.id, reply);
      refresh(selectedDiscussion.id);
      setReplyError("");
      toast.success(
        selectedDiscussion.reply ? "Reply updated." : "Reply posted."
      );
    } catch (error) {
      setReplyError(error.message);
    }
  };

  const toggleStatus = () => {
    if (!selectedDiscussion) return;

    const nextStatus =
      selectedDiscussion.status === "RESOLVED" ? "OPEN" : "RESOLVED";
    try {
      instructorDiscussionService.updateStatus(
        selectedDiscussion.id,
        nextStatus
      );
      refresh(selectedDiscussion.id);
      toast.success(
        nextStatus === "RESOLVED"
          ? "Discussion marked as resolved."
          : "Discussion reopened."
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCourseId("ALL");
    setStatus("ALL");
  };

  const openCount = discussions.filter(
    (item) => item.status === "OPEN"
  ).length;
  const unansweredCount = discussions.filter((item) => !item.reply).length;
  const resolvedCount = discussions.filter(
    (item) => item.status === "RESOLVED"
  ).length;

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Course Discussions</h1>
        <p className="text-secondary mb-0">
          Answer student questions and keep course conversations organized.
        </p>
      </div>

      <div className="row g-3 mb-4">
        {[
          ["Total Questions", discussions.length, "bi-chat-square-text", "primary"],
          ["Open", openCount, "bi-hourglass-split", "warning"],
          ["Unanswered", unansweredCount, "bi-question-circle", "danger"],
          ["Resolved", resolvedCount, "bi-check-circle", "success"],
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

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-xl-5">
              <input
                className="form-control"
                placeholder="Search question, student or course..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="col-md-5 col-xl-3">
              <select
                className="form-select"
                value={courseId}
                onChange={(event) => setCourseId(event.target.value)}
              >
                <option value="ALL">All courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-5 col-xl-2">
              <select
                className="form-select"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="ALL">All questions</option>
                <option value="OPEN">Open</option>
                <option value="UNANSWERED">Unanswered</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-5">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 d-flex justify-content-between">
              <span className="fw-semibold">Questions</span>
              <span className="text-secondary small">
                {visibleDiscussions.length} found
              </span>
            </div>
            <div className="list-group list-group-flush instructor-discussion-list">
              {visibleDiscussions.map((discussion) => (
                <button
                  type="button"
                  key={discussion.id}
                  className={`list-group-item list-group-item-action text-start p-3 ${
                    selectedId === discussion.id ? "active" : ""
                  }`}
                  onClick={() => selectDiscussion(discussion)}
                >
                  <div className="d-flex justify-content-between gap-2 mb-1">
                    <span className="fw-semibold text-truncate">
                      {discussion.title}
                    </span>
                    <span
                      className={`badge ${
                        discussion.status === "RESOLVED"
                          ? "text-bg-success"
                          : "text-bg-warning"
                      }`}
                    >
                      {discussion.status}
                    </span>
                  </div>
                  <div className="small mb-1">
                    {discussion.studentName} · {discussion.courseTitle}
                  </div>
                  <div
                    className={
                      selectedId === discussion.id
                        ? "small text-white-50"
                        : "small text-secondary"
                    }
                  >
                    {formatDate(discussion.createdAt)}
                    {!discussion.reply && " · Awaiting reply"}
                  </div>
                </button>
              ))}
              {visibleDiscussions.length === 0 && (
                <div className="text-center text-secondary p-5">
                  <i className="bi bi-chat-square fs-2 d-block mb-2"></i>
                  No discussions match your filters.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-7">
          {selectedDiscussion ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                  <div>
                    <span className="badge text-bg-light mb-2">
                      {selectedDiscussion.courseTitle}
                    </span>
                    <h2 className="h5 fw-bold mb-1">
                      {selectedDiscussion.title}
                    </h2>
                    <div className="small text-secondary">
                      Asked by {selectedDiscussion.studentName} ·{" "}
                      {formatDate(selectedDiscussion.createdAt)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      selectedDiscussion.status === "RESOLVED"
                        ? "btn-outline-warning"
                        : "btn-outline-success"
                    }`}
                    onClick={toggleStatus}
                  >
                    <i
                      className={`bi ${
                        selectedDiscussion.status === "RESOLVED"
                          ? "bi-arrow-counterclockwise"
                          : "bi-check2-circle"
                      } me-2`}
                    ></i>
                    {selectedDiscussion.status === "RESOLVED"
                      ? "Reopen"
                      : "Mark Resolved"}
                  </button>
                </div>

                <div className="bg-light rounded-3 p-3 mb-4">
                  <p className="mb-0">{selectedDiscussion.message}</p>
                </div>

                {selectedDiscussion.repliedAt && (
                  <div className="small text-secondary mb-2">
                    Last replied {formatDate(selectedDiscussion.repliedAt)}
                  </div>
                )}

                <form onSubmit={handleReplySubmit} noValidate>
                  <label htmlFor="discussionReply" className="form-label fw-semibold">
                    Instructor reply
                  </label>
                  <textarea
                    id="discussionReply"
                    className={`form-control ${replyError ? "is-invalid" : ""}`}
                    rows="6"
                    value={reply}
                    onChange={(event) => {
                      setReply(event.target.value);
                      setReplyError("");
                    }}
                    placeholder="Explain the answer clearly for the student..."
                  ></textarea>
                  <div className="invalid-feedback">{replyError}</div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-secondary">
                      Minimum 10 characters
                    </small>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-send me-2"></i>
                      {selectedDiscussion.reply ? "Update Reply" : "Post Reply"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center text-secondary py-5">
                Select a discussion to read and reply.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorDiscussionsPage;
