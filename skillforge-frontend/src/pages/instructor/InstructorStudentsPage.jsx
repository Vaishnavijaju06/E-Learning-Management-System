import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import instructorCourseService from "../../services/instructorCourseService";
import instructorStudentService from "../../services/instructorStudentService";

const progressGroup = (progress) => {
  if (progress === 100) return "COMPLETED";
  if (progress >= 50) return "ON_TRACK";
  return "NEEDS_ATTENTION";
};

const progressColor = (progress) => {
  if (progress === 100) return "success";
  if (progress >= 50) return "primary";
  return "warning";
};

const assignmentBadge = {
  GRADED: "text-bg-success",
  SUBMITTED: "text-bg-info",
  PENDING: "text-bg-warning",
  OVERDUE: "text-bg-danger",
};

function InstructorStudentsPage() {
  const { courseId } = useParams();
  const courses = useMemo(() => instructorCourseService.getCourses(), []);
  const students = useMemo(() => instructorStudentService.getStudents(), []);
  const initialCourseId =
    courseId && courses.some((course) => course.id === Number(courseId))
      ? String(courseId)
      : "ALL";

  const [searchText, setSearchText] = useState("");
  const [courseFilter, setCourseFilter] = useState(initialCourseId);
  const [progressFilter, setProgressFilter] = useState("ALL");
  const [assignmentFilter, setAssignmentFilter] = useState("ALL");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !search ||
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        student.courseTitle.toLowerCase().includes(search);
      const matchesCourse =
        courseFilter === "ALL" ||
        student.courseId === Number(courseFilter);
      const matchesProgress =
        progressFilter === "ALL" ||
        progressGroup(student.progress) === progressFilter;
      const matchesAssignment =
        assignmentFilter === "ALL" ||
        student.assignmentStatus === assignmentFilter;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesProgress &&
        matchesAssignment
      );
    });
  }, [
    students,
    searchText,
    courseFilter,
    progressFilter,
    assignmentFilter,
  ]);

  const summary = useMemo(() => {
    const completed = students.filter(
      (student) => student.progress === 100
    ).length;
    const needsAttention = students.filter(
      (student) => student.progress < 50
    ).length;
    const average =
      students.length === 0
        ? 0
        : Math.round(
            students.reduce((total, student) => total + student.progress, 0) /
              students.length
          );

    return { total: students.length, completed, needsAttention, average };
  }, [students]);

  const resetFilters = () => {
    setSearchText("");
    setCourseFilter("ALL");
    setProgressFilter("ALL");
    setAssignmentFilter("ALL");
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      <div className="mb-4">
        <p className="text-primary fw-semibold mb-1">LEARNER PROGRESS</p>
        <h1 className="h2 fw-bold mb-1">Course Students</h1>
        <p className="text-secondary mb-0">
          Review enrollments, progress, assessments and assignment activity.
        </p>
      </div>

      <div className="row g-3 mb-4">
        {[
          ["Enrolled Students", summary.total, "bi-people", "primary"],
          ["Average Progress", `${summary.average}%`, "bi-bar-chart", "info"],
          ["Course Completed", summary.completed, "bi-award", "success"],
          ["Needs Attention", summary.needsAttention, "bi-exclamation-triangle", "warning"],
        ].map(([label, value, icon, color]) => (
          <div className="col-6 col-xl-3" key={label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className={`instructor-course-stat text-${color} bg-${color}-subtle`}>
                  <i className={`bi ${icon}`}></i>
                </span>
                <div>
                  <p className="small text-secondary mb-1">{label}</p>
                  <h2 className="h4 fw-bold mb-0">{value}</h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="card border-0 shadow-sm">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3 mb-4">
            <div className="col-lg-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search student, email or course"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <select
                className="form-select"
                value={courseFilter}
                onChange={(event) => setCourseFilter(event.target.value)}
                aria-label="Filter students by course"
              >
                <option value="ALL">All courses</option>
                {courses
                  .filter((course) => course.students > 0)
                  .map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-sm-6 col-lg-3">
              <select
                className="form-select"
                value={progressFilter}
                onChange={(event) => setProgressFilter(event.target.value)}
                aria-label="Filter students by progress"
              >
                <option value="ALL">All progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_TRACK">On track (50%+)</option>
                <option value="NEEDS_ATTENTION">Needs attention</option>
              </select>
            </div>
            <div className="col-sm-6 col-lg-2">
              <select
                className="form-select"
                value={assignmentFilter}
                onChange={(event) => setAssignmentFilter(event.target.value)}
                aria-label="Filter students by assignment status"
              >
                <option value="ALL">All assignments</option>
                <option value="GRADED">Graded</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="PENDING">Pending</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-person-x fs-1 text-secondary"></i>
              <h2 className="h5 fw-bold mt-3">No students found</h2>
              <p className="text-secondary">
                Change your search or clear the selected filters.
              </p>
              <button className="btn btn-outline-primary" onClick={resetFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle instructor-student-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Progress</th>
                    <th>Quiz average</th>
                    <th>Assignment</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="student-avatar">
                            {student.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <div>
                            <strong className="d-block">{student.name}</strong>
                            <small className="text-secondary">{student.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="d-inline-block student-course-name">
                          {student.courseTitle}
                        </span>
                      </td>
                      <td style={{ minWidth: "150px" }}>
                        <div className="d-flex justify-content-between small mb-1">
                          <span>{student.completedLessons}/{student.totalLessons} lessons</span>
                          <strong>{student.progress}%</strong>
                        </div>
                        <div className="progress student-progress">
                          <div
                            className={`progress-bar bg-${progressColor(student.progress)}`}
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </td>
                      <td>
                        <strong>{student.quizAverage || "—"}</strong>
                        {student.quizAverage > 0 && "%"}
                        <small className="d-block text-secondary">
                          {student.quizzesAttempted} attempts
                        </small>
                      </td>
                      <td>
                        <span className={`badge ${assignmentBadge[student.assignmentStatus]}`}>
                          {student.assignmentStatus.toLowerCase()}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedStudent(student)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {selectedStudent && (
        <div className="curriculum-modal-backdrop" role="presentation">
          <section
            className="card border-0 shadow-lg curriculum-modal student-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-detail-title"
          >
            <div className="card-header bg-white d-flex justify-content-between align-items-start p-4">
              <div className="d-flex align-items-center gap-3">
                <span className="student-avatar student-avatar-lg">
                  {selectedStudent.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <h2 id="student-detail-title" className="h5 fw-bold mb-1">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-secondary small mb-0">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>
              <button
                className="btn btn-light"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close student details"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="card-body p-4">
              <p className="small text-primary fw-semibold mb-1">ENROLLED COURSE</p>
              <h3 className="h5 fw-bold">{selectedStudent.courseTitle}</h3>

              <div className="row g-3 my-2">
                <div className="col-sm-6">
                  <div className="student-detail-stat">
                    <small>Lesson progress</small>
                    <strong>
                      {selectedStudent.completedLessons}/{selectedStudent.totalLessons}
                    </strong>
                    <span>{selectedStudent.progress}% complete</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="student-detail-stat">
                    <small>Quiz performance</small>
                    <strong>
                      {selectedStudent.quizAverage
                        ? `${selectedStudent.quizAverage}%`
                        : "Not attempted"}
                    </strong>
                    <span>{selectedStudent.quizzesAttempted} quizzes attempted</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="student-detail-stat">
                    <small>Assignments</small>
                    <strong>
                      {selectedStudent.assignmentsCompleted}/{selectedStudent.totalAssignments}
                    </strong>
                    <span className="text-capitalize">
                      Latest: {selectedStudent.assignmentStatus.toLowerCase()}
                    </span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="student-detail-stat">
                    <small>Activity</small>
                    <strong>{selectedStudent.lastActive}</strong>
                    <span>Enrolled {selectedStudent.enrolledAt}</span>
                  </div>
                </div>
              </div>

              {selectedStudent.progress < 50 && (
                <div className="alert alert-warning mt-3 mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  This learner may need support because course progress is below 50%.
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default InstructorStudentsPage;
