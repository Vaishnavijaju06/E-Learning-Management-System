import { useNavigate } from "react-router-dom";

function EnrolledCourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">
        <div className="d-flex gap-3">
          <div
            className={`enrolled-course-icon bg-${course.color}-subtle text-${course.color}`}
          >
            <i className={`bi ${course.icon}`}></i>
          </div>

          <div className="flex-grow-1">
            <span className="badge bg-light text-secondary mb-2">
              {course.category}
            </span>

            <h5 className="fw-bold">{course.title}</h5>

            <p className="text-secondary small mb-0">
              By {course.instructor}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="d-flex justify-content-between mb-2">
            <small className="fw-semibold">Course Progress</small>
            <small className="fw-bold text-primary">
              {course.progress}%
            </small>
          </div>

          <div
            className="progress student-course-progress"
            role="progressbar"
            aria-valuenow={course.progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="progress-bar"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>

          <small className="text-secondary d-block mt-2">
            {course.completedLessons} of {course.totalLessons} lessons
            completed
          </small>
        </div>

        <div className="bg-light rounded-3 p-3 mt-4">
          <small className="text-secondary d-block">Next lesson</small>
          <span className="fw-semibold">{course.nextLesson}</span>
        </div>

        <button
          type="button"
          className="btn btn-primary-custom w-100 mt-3"
          onClick={() =>
            navigate(`/student/courses/${course.id}/learn`)
          }
        >
          <i className="bi bi-play-fill me-2"></i>
          Continue Learning
        </button>
      </div>
    </div>
  );
}

export default EnrolledCourseCard;