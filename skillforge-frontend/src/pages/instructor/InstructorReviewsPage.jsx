import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import instructorCourseService from "../../services/instructorCourseService";
import instructorReviewService from "../../services/instructorReviewService";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const Stars = ({ rating, size = "" }) => (
  <span className={`text-warning ${size}`} aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <i
        key={star}
        className={`bi ${star <= rating ? "bi-star-fill" : "bi-star"}`}
      ></i>
    ))}
  </span>
);

function InstructorReviewsPage() {
  const [reviews, setReviews] = useState(() =>
    instructorReviewService.getReviews()
  );
  const [selectedId, setSelectedId] = useState(
    () => instructorReviewService.getReviews()[0]?.id || null
  );
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("ALL");
  const [rating, setRating] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [response, setResponse] = useState("");
  const [responseError, setResponseError] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportError, setReportError] = useState("");

  const courses = useMemo(
    () => instructorCourseService.getCourses(),
    []
  );

  const visibleReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reviews.filter(
      (review) =>
        (courseId === "ALL" || review.courseId === Number(courseId)) &&
        (rating === "ALL" || review.rating === Number(rating)) &&
        (status === "ALL" ||
          (status === "RESPONDED" && review.response) ||
          (status === "UNANSWERED" && !review.response) ||
          (status === "REPORTED" && review.reported)) &&
        (!query ||
          review.title.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query) ||
          review.studentName.toLowerCase().includes(query) ||
          review.courseTitle.toLowerCase().includes(query))
    );
  }, [courseId, rating, reviews, search, status]);

  const selectedReview =
    reviews.find((review) => review.id === selectedId) || null;

  const selectReview = (review) => {
    setSelectedId(review.id);
    setResponse(review.response || "");
    setResponseError("");
  };

  const refresh = (keepSelectedId = selectedId) => {
    setReviews(instructorReviewService.getReviews());
    setSelectedId(keepSelectedId);
  };

  const handleResponseSubmit = (event) => {
    event.preventDefault();
    if (!selectedReview) return;

    try {
      instructorReviewService.saveResponse(selectedReview.id, response);
      refresh(selectedReview.id);
      setResponseError("");
      toast.success(
        selectedReview.response ? "Response updated." : "Response posted."
      );
    } catch (error) {
      setResponseError(error.message);
    }
  };

  const handleReportSubmit = (event) => {
    event.preventDefault();
    if (!selectedReview) return;

    try {
      instructorReviewService.reportReview(
        selectedReview.id,
        reportReason
      );
      refresh(selectedReview.id);
      setShowReportModal(false);
      setReportReason("");
      setReportError("");
      toast.success("Review sent for moderation.");
    } catch (error) {
      setReportError(error.message);
    }
  };

  const handleRemoveReport = () => {
    if (!selectedReview) return;
    instructorReviewService.removeReport(selectedReview.id);
    refresh(selectedReview.id);
    toast.success("Report removed.");
  };

  const clearFilters = () => {
    setSearch("");
    setCourseId("ALL");
    setRating("ALL");
    setStatus("ALL");
  };

  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length
    : 0;
  const fiveStarCount = reviews.filter((review) => review.rating === 5).length;
  const unansweredCount = reviews.filter((review) => !review.response).length;
  const reportedCount = reviews.filter((review) => review.reported).length;

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Course Reviews</h1>
        <p className="text-secondary mb-0">
          Understand student feedback, respond professionally and flag
          inappropriate content.
        </p>
      </div>

      <div className="row g-3 mb-4">
        {[
          ["Average Rating", averageRating.toFixed(1), "bi-star-fill", "warning"],
          ["Five-star Reviews", fiveStarCount, "bi-emoji-smile", "success"],
          ["Awaiting Response", unansweredCount, "bi-reply", "primary"],
          ["Reported", reportedCount, "bi-flag", "danger"],
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
            <div className="col-xl-4">
              <input
                className="form-control"
                placeholder="Search feedback, student or course..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="col-md-4 col-xl-3">
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
            <div className="col-6 col-md-3 col-xl-2">
              <select
                className="form-select"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
              >
                <option value="ALL">All ratings</option>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} stars
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-3 col-xl-2">
              <select
                className="form-select"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="ALL">All reviews</option>
                <option value="RESPONDED">Responded</option>
                <option value="UNANSWERED">Awaiting response</option>
                <option value="REPORTED">Reported</option>
              </select>
            </div>
            <div className="col-md-2 col-xl-1">
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
              <span className="fw-semibold">Student Feedback</span>
              <span className="text-secondary small">
                {visibleReviews.length} found
              </span>
            </div>
            <div className="list-group list-group-flush instructor-review-list">
              {visibleReviews.map((review) => (
                <button
                  type="button"
                  key={review.id}
                  className={`list-group-item list-group-item-action text-start p-3 ${
                    selectedId === review.id ? "active" : ""
                  }`}
                  onClick={() => selectReview(review)}
                >
                  <div className="d-flex justify-content-between gap-2 mb-1">
                    <span className="fw-semibold text-truncate">
                      {review.title}
                    </span>
                    {review.reported && (
                      <span className="badge text-bg-danger">Reported</span>
                    )}
                  </div>
                  <Stars rating={review.rating} />
                  <div className="small mt-1">
                    {review.studentName} · {review.courseTitle}
                  </div>
                  <div
                    className={
                      selectedId === review.id
                        ? "small text-white-50"
                        : "small text-secondary"
                    }
                  >
                    {formatDate(review.createdAt)}
                    {!review.response && " · Awaiting response"}
                  </div>
                </button>
              ))}
              {visibleReviews.length === 0 && (
                <div className="text-center text-secondary p-5">
                  <i className="bi bi-star fs-2 d-block mb-2"></i>
                  No reviews match your filters.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-7">
          {selectedReview ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                  <div>
                    <span className="badge text-bg-light mb-2">
                      {selectedReview.courseTitle}
                    </span>
                    <h2 className="h5 fw-bold mb-1">
                      {selectedReview.title}
                    </h2>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <Stars rating={selectedReview.rating} size="fs-5" />
                      <span className="small text-secondary">
                        by {selectedReview.studentName} ·{" "}
                        {formatDate(selectedReview.createdAt)}
                      </span>
                    </div>
                  </div>
                  {selectedReview.reported ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleRemoveReport}
                    >
                      <i className="bi bi-flag me-2"></i>
                      Remove Report
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setShowReportModal(true);
                        setReportError("");
                      }}
                    >
                      <i className="bi bi-flag me-2"></i>
                      Report Review
                    </button>
                  )}
                </div>

                {selectedReview.reported && (
                  <div className="alert alert-danger py-2">
                    <strong>Sent for moderation:</strong>{" "}
                    {selectedReview.reportReason}
                  </div>
                )}

                <div className="bg-light rounded-3 p-3 mb-4">
                  <p className="mb-0">{selectedReview.comment}</p>
                </div>

                {selectedReview.respondedAt && (
                  <div className="small text-secondary mb-2">
                    Last responded {formatDate(selectedReview.respondedAt)}
                  </div>
                )}

                <form onSubmit={handleResponseSubmit} noValidate>
                  <label htmlFor="reviewResponse" className="form-label fw-semibold">
                    Instructor response
                  </label>
                  <textarea
                    id="reviewResponse"
                    className={`form-control ${
                      responseError ? "is-invalid" : ""
                    }`}
                    rows="6"
                    value={response}
                    onChange={(event) => {
                      setResponse(event.target.value);
                      setResponseError("");
                    }}
                    placeholder="Thank the student or address their feedback..."
                  ></textarea>
                  <div className="invalid-feedback">{responseError}</div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-secondary">
                      Minimum 10 characters
                    </small>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-send me-2"></i>
                      {selectedReview.response
                        ? "Update Response"
                        : "Post Response"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center text-secondary py-5">
                Select a review to read and respond.
              </div>
            </div>
          )}
        </div>
      </div>

      {showReportModal && selectedReview && (
        <div className="curriculum-modal-backdrop">
          <form
            className="card border-0 shadow-lg curriculum-modal"
            onSubmit={handleReportSubmit}
            noValidate
          >
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <h2 className="h5 fw-bold mb-0">Report Review</h2>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowReportModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="card-body">
              <p className="text-secondary">
                Choose why this review should be checked by an administrator.
              </p>
              <label htmlFor="reportReason" className="form-label">
                Report reason
              </label>
              <select
                id="reportReason"
                className={`form-select ${reportError ? "is-invalid" : ""}`}
                value={reportReason}
                onChange={(event) => {
                  setReportReason(event.target.value);
                  setReportError("");
                }}
              >
                <option value="">Select a reason</option>
                <option value="Spam or promotional content">
                  Spam or promotional content
                </option>
                <option value="Abusive or inappropriate language">
                  Abusive or inappropriate language
                </option>
                <option value="Not related to the course">
                  Not related to the course
                </option>
                <option value="Contains personal information">
                  Contains personal information
                </option>
              </select>
              <div className="invalid-feedback">{reportError}</div>
            </div>
            <div className="card-footer bg-white d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                <i className="bi bi-flag me-2"></i>
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default InstructorReviewsPage;
