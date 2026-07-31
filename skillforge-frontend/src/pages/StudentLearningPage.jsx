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

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="text-primary fw-semibold mb-1">
            STUDENT AREA
          </p>
          <h1 className="fw-bold mb-0">My Learning</h1>
        </div>
        <Link className="btn btn-outline-primary" to="/courses">
          Browse More Courses
        </Link>
      </div>

      <AlertMessage>{error}</AlertMessage>

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-journal-x"></i>
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
              <article className="card h-100 border-0 shadow-sm overflow-hidden">
                <img
                  className="card-img-top learning-card-image"
                  src={
                    enrollment.thumbnailUrl ||
                    "/course-placeholder.svg"
                  }
                  alt=""
                />
                <div className="card-body d-flex flex-column">
                  <span className="badge text-bg-light align-self-start mb-2">
                    {enrollment.status}
                  </span>
                  <h2 className="h5">
                    {enrollment.courseTitle}
                  </h2>

                  <div className="mt-auto pt-3">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Progress</span>
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
