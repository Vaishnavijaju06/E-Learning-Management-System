import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { studentCourses } from "../../data/studentCourses";
import { calculateCourseProgress } from "../../services/courseProgressService";

function StudentCoursesPage() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredCourses = useMemo(() => {
    return studentCourses.filter((course) => {
      const progress = calculateCourseProgress(
        course.id,
        course.totalLessons
      );

      const matchesSearch =
        course.title.toLowerCase().includes(searchText.toLowerCase()) ||
        course.instructor
          .toLowerCase()
          .includes(searchText.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "NOT_STARTED" && progress === 0) ||
        (statusFilter === "IN_PROGRESS" &&
          progress > 0 &&
          progress < 100) ||
        (statusFilter === "COMPLETED" && progress === 100);

      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter]);

  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-1">My Courses</h1>
          <p className="text-secondary mb-0">
            Continue learning and track your course progress.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary-custom"
          onClick={() => navigate("/courses")}
        >
          <i className="bi bi-search me-2"></i>
          Browse Courses
        </button>
      </div>

      <section className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by course or instructor..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="ALL">All Courses</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {filteredCourses.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-5 text-center">
            <i className="bi bi-journal-x display-3 text-secondary"></i>
            <h3 className="fw-bold mt-3">No courses found</h3>
            <p className="text-secondary">
              Change your search or selected filter.
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredCourses.map((course) => {
            const progress = calculateCourseProgress(
              course.id,
              course.totalLessons
            );

            return (
              <div className="col-md-6 col-xl-4" key={course.id}>
                <article className="card border-0 shadow-sm rounded-4 h-100 student-course-card">
                  <div className="card-body p-4">
                    <div
                      className={`student-course-cover bg-${course.color}-subtle text-${course.color}`}
                    >
                      <i className={`bi ${course.icon}`}></i>
                    </div>

                    <span className="badge bg-light text-secondary mt-4">
                      {course.category}
                    </span>

                    <h4 className="fw-bold mt-2">{course.title}</h4>

                    <p className="text-secondary small">
                      Instructor: {course.instructor}
                    </p>

                    <p className="text-secondary">
                      {course.description}
                    </p>

                    <div className="d-flex justify-content-between mb-2">
                      <small className="fw-semibold">Progress</small>
                      <small className="fw-bold text-primary">
                        {progress}%
                      </small>
                    </div>

                    <div className="progress student-course-progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                      <small className="text-secondary">
                        {course.totalLessons} lessons
                      </small>

                      <small
                        className={
                          progress === 100
                            ? "text-success fw-semibold"
                            : "text-secondary"
                        }
                      >
                        {progress === 100
                          ? "Completed"
                          : progress > 0
                          ? "In Progress"
                          : "Not Started"}
                      </small>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary-custom w-100 mt-4"
                      onClick={() =>
                        navigate(
                          `/student/courses/${course.id}/learn`
                        )
                      }
                    >
                      <i className="bi bi-play-fill me-2"></i>
                      {progress > 0
                        ? "Continue Learning"
                        : "Start Learning"}
                    </button>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default StudentCoursesPage;