import { Link } from "react-router-dom";

import DashboardStatCard from "../../components/student/DashboardStatCard";
import EnrolledCourseCard from "../../components/student/EnrolledCourseCard";
import { useAuth } from "../../context/AuthContext";
import { studentDashboardData } from "../../data/studentDashboard";

function StudentDashboardPage() {
  const { user } = useAuth();

  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <main className="container-fluid p-3 p-md-4">
      <section className="student-welcome-card rounded-4 p-4 p-md-5 mb-4 text-white">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-light text-primary mb-3">
              Student Dashboard
            </span>

            <h1 className="fw-bold">
              {greeting}, {user.firstName}!
            </h1>

            <p className="text-white-50 mb-4">
              Continue learning and move one step closer to your goals.
            </p>

            <Link to="/courses" className="btn btn-light fw-semibold">
              <i className="bi bi-search me-2"></i>
              Explore Courses
            </Link>
          </div>

          <div className="col-lg-4 text-center d-none d-lg-block">
            <i className="bi bi-mortarboard display-1"></i>
          </div>
        </div>
      </section>

      <section className="row g-4 mb-5">
        {studentDashboardData.statistics.map((statistic) => (
          <div
            className="col-sm-6 col-xl-3"
            key={statistic.id}
          >
            <DashboardStatCard statistic={statistic} />
          </div>
        ))}
      </section>

      <section className="mb-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <div>
            <h3 className="fw-bold mb-1">Continue Learning</h3>
            <p className="text-secondary mb-0">
              Resume your recently accessed courses.
            </p>
          </div>

          <Link
            to="/student/courses"
            className="btn btn-outline-primary"
          >
            View All Courses
          </Link>
        </div>

        <div className="row g-4">
          {studentDashboardData.enrolledCourses.map((course) => (
            <div className="col-md-6 col-xl-4" key={course.id}>
              <EnrolledCourseCard course={course} />
            </div>
          ))}
        </div>
      </section>

      <div className="row g-4">
        <div className="col-xl-7">
          <section className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Upcoming Learning</h4>
                  <p className="text-secondary mb-0">
                    Your scheduled lessons and assignments
                  </p>
                </div>

                <i className="bi bi-calendar-event fs-3 text-primary"></i>
              </div>

              <div className="d-flex flex-column gap-3">
                {studentDashboardData.upcomingLessons.map((lesson) => (
                  <div
                    className="upcoming-lesson-item"
                    key={lesson.id}
                  >
                    <div
                      className={`upcoming-lesson-icon bg-${lesson.color}-subtle text-${lesson.color}`}
                    >
                      <i className={`bi ${lesson.icon}`}></i>
                    </div>

                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{lesson.title}</h6>
                      <p className="text-secondary small mb-1">
                        {lesson.course}
                      </p>

                      <small>
                        <i className="bi bi-calendar3 me-1"></i>
                        {lesson.date}

                        <span className="mx-2">•</span>

                        <i className="bi bi-clock me-1"></i>
                        {lesson.time}
                      </small>
                    </div>

                    <span className="badge bg-light text-dark">
                      {lesson.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="col-xl-5">
          <section className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Recent Activity</h4>
                  <p className="text-secondary mb-0">
                    Your latest learning updates
                  </p>
                </div>

                <i className="bi bi-activity fs-3 text-success"></i>
              </div>

              <div className="activity-timeline">
                {studentDashboardData.recentActivities.map(
                  (activity) => (
                    <div className="activity-item" key={activity.id}>
                      <div
                        className={`activity-icon text-${activity.color}`}
                      >
                        <i className={`bi ${activity.icon}`}></i>
                      </div>

                      <div>
                        <h6 className="fw-semibold mb-1">
                          {activity.title}
                        </h6>

                        <p className="small text-secondary mb-1">
                          {activity.description}
                        </p>

                        <small className="text-secondary">
                          {activity.time}
                        </small>
                      </div>
                    </div>
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

export default StudentDashboardPage;