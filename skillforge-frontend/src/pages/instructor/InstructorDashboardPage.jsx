import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { instructorDashboardData } from "../../data/instructorDashboard";

function InstructorDashboardPage() {
  const { user } = useAuth();

  return (
    <main className="container-fluid p-3 p-md-4">
      <section className="instructor-welcome-card rounded-4 p-4 p-md-5 mb-4 text-white">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-light text-primary mb-3">
              Instructor Dashboard
            </span>
            <h1 className="fw-bold">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-white-50 mb-4">
              Manage your courses and track how your students are
              progressing.
            </p>
            <Link
              to="/instructor/courses/create"
              className="btn btn-light fw-semibold"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create New Course
            </Link>
          </div>

          <div className="col-lg-4 text-center d-none d-lg-block">
            <i className="bi bi-easel2 display-1"></i>
          </div>
        </div>
      </section>

      <section className="row g-4 mb-4">
        {instructorDashboardData.statistics.map((statistic) => (
          <div className="col-sm-6 col-xl-3" key={statistic.id}>
            <article className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4 d-flex align-items-center gap-3">
                <span
                  className={`instructor-stat-icon bg-${statistic.color}-subtle text-${statistic.color}`}
                >
                  <i className={`bi ${statistic.icon}`}></i>
                </span>
                <div>
                  <p className="text-secondary small mb-1">
                    {statistic.title}
                  </p>
                  <h3 className="fw-bold mb-1">{statistic.value}</h3>
                  <small className="text-secondary">
                    {statistic.detail}
                  </small>
                </div>
              </div>
            </article>
          </div>
        ))}
      </section>

      <div className="row g-4">
        <div className="col-xl-8">
          <section className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Course Performance</h4>
                  <p className="text-secondary mb-0">
                    Performance of your published courses
                  </p>
                </div>
                <Link
                  to="/instructor/courses"
                  className="btn btn-outline-primary btn-sm"
                >
                  View All
                </Link>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Students</th>
                      <th>Completion</th>
                      <th>Rating</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructorDashboardData.coursePerformance.map(
                      (course) => (
                        <tr key={course.id}>
                          <td>
                            <div className="fw-semibold">
                              {course.title}
                            </div>
                            <span className="badge bg-success-subtle text-success">
                              {course.status}
                            </span>
                          </td>
                          <td>{course.students}</td>
                          <td style={{ minWidth: "130px" }}>
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress flex-grow-1 instructor-progress">
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${course.completion}%`,
                                  }}
                                ></div>
                              </div>
                              <small>{course.completion}%</small>
                            </div>
                          </td>
                          <td>
                            <i className="bi bi-star-fill text-warning me-1"></i>
                            {course.rating}
                          </td>
                          <td className="fw-semibold">
                            {course.revenue}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <div className="col-xl-4">
          <section className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Recent Enrollments</h4>
                  <p className="text-secondary mb-0">
                    Latest students in your courses
                  </p>
                </div>
                <i className="bi bi-person-plus fs-3 text-success"></i>
              </div>

              <div className="d-flex flex-column gap-3">
                {instructorDashboardData.recentEnrollments.map(
                  (enrollment) => (
                    <article
                      className="instructor-enrollment-item"
                      key={enrollment.id}
                    >
                      <span className="instructor-enrollment-avatar">
                        {enrollment.initials}
                      </span>
                      <div className="min-width-0">
                        <h6 className="fw-semibold mb-1">
                          {enrollment.student}
                        </h6>
                        <p className="small text-secondary mb-1 text-truncate">
                          {enrollment.course}
                        </p>
                        <small className="text-secondary">
                          {enrollment.date}
                        </small>
                      </div>
                    </article>
                  )
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default InstructorDashboardPage;
