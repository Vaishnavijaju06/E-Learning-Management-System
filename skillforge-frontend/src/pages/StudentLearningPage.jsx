import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import { enrollmentApi } from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

export default function StudentLearningPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    enrollmentApi
      .mine()
      .then((response) => setEnrollments(response.data))
      .catch((requestError) =>
        setError(getErrorMessage(requestError))
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your courses..." />;
  }

  const averageProgress = enrollments.length
    ? Math.round(
        enrollments.reduce(
          (total, item) => total + item.progressPercent,
          0
        ) / enrollments.length
      )
    : 0;

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div className="section-heading">
          <span className="section-eyebrow">
            Student workspace
          </span>
          <h1>My Learning</h1>
          <p>
            Continue courses, track progress and complete your
            learning goals.
          </p>
        </div>
        <Link className="btn btn-outline-primary" to="/courses">
          Browse More Courses
          <i className="bi bi-arrow-right ms-2"></i>
        </Link>
      </div>

      <AlertMessage>{error}</AlertMessage>

      {enrollments.length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="metric-card h-100">
              <div className="metric-icon">
                <i className="bi bi-journal-bookmark"></i>
              </div>
              <span className="metric-label">Enrolled courses</span>
              <strong className="metric-value">
                {enrollments.length}
              </strong>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="metric-card h-100">
              <div className="metric-icon">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <span className="metric-label">Average progress</span>
              <strong className="metric-value">
                {averageProgress}%
              </strong>
            </div>
          </div>
        </div>
      )}

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-journal-x"></i>
          </div>
          <h2 className="h4">No courses yet</h2>
          <p className="text-secondary">
            Enroll in a course to start learning.
          </p>
          <Link className="btn btn-primary" to="/courses">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {enrollments.map((enrollment) => (
            <div
              className="col-md-6 col-xl-4"
              key={enrollment.id}
            >
              <article className="card course-card h-100 border-0 overflow-hidden">
                <div className="course-image-wrapper">
                  <img
                    className="card-img-top learning-card-image"
                    src={
                      enrollment.thumbnailUrl ||
                      "/course-placeholder.svg"
                    }
                    alt={enrollment.courseTitle}
                    onError={(event) => {
                      event.currentTarget.src =
                        "/course-placeholder.svg";
                    }}
                  />
                  <span className="course-category-chip">
                    {enrollment.status}
                  </span>
                </div>

                <div className="card-body d-flex flex-column p-4">
                  <h2 className="h5 fw-bold">
                    {enrollment.courseTitle}
                  </h2>

                  <div className="mt-auto pt-4">
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="text-secondary">
                        Course progress
                      </span>
                      <strong>
                        {enrollment.progressPercent}%
                      </strong>
                    </div>
                    <div
                      className="progress mb-3"
                      role="progressbar"
                      aria-label="Course progress"
                      aria-valuenow={
                        enrollment.progressPercent
                      }
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ height: 8 }}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          width: `${enrollment.progressPercent}%`
                        }}
                      ></div>
                    </div>

                    <Link
                      className="btn btn-primary w-100"
                      to={`/student/learning/${enrollment.courseId}`}
                    >
                      <i className="bi bi-play-circle me-2"></i>
                      {enrollment.progressPercent > 0
                        ? "Continue Learning"
                        : "Start Learning"}
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
