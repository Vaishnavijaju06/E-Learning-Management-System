import { Link } from "react-router-dom";

const categories = [
  {
    icon: "bi-code-slash",
    title: "Web Development",
    courses: 18,
    color: "primary",
  },
  {
    icon: "bi-cup-hot",
    title: "Java Development",
    courses: 14,
    color: "danger",
  },
  {
    icon: "bi-database",
    title: "Database",
    courses: 9,
    color: "success",
  },
  {
    icon: "bi-cloud",
    title: "Cloud & DevOps",
    courses: 11,
    color: "warning",
  },
];

const courses = [
  {
    id: 1,
    title: "Java Full Stack Development",
    instructor: "Rahul Sharma",
    price: 4999,
    rating: 4.8,
    students: 1250,
    icon: "bi-cup-hot",
    color: "danger",
  },
  {
    id: 2,
    title: "Spring Boot and Microservices",
    instructor: "Priya Kulkarni",
    price: 3999,
    rating: 4.7,
    students: 980,
    icon: "bi-diagram-3",
    color: "success",
  },
  {
    id: 3,
    title: "React Web Development",
    instructor: "Amit Verma",
    price: 2999,
    rating: 4.9,
    students: 1640,
    icon: "bi-code-square",
    color: "primary",
  },
];

function HomePage() {
  return (
    <>
      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg, #f4f2ff 0%, #eef7ff 100%)",
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 mb-3">
                <i className="bi bi-stars me-2"></i>
                Learn, Build and Grow
              </span>

              <h1 className="display-4 fw-bold mb-4">
                Forge your skills.
                <span className="text-primary-custom">
                  {" "}
                  Build your future.
                </span>
              </h1>

              <p className="lead text-secondary mb-4">
                Learn industry-relevant technologies from experienced
                instructors through practical courses, quizzes and projects.
              </p>

              <div className="input-group input-group-lg shadow-sm mb-4">
                <span className="input-group-text bg-white border-0">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="What do you want to learn?"
                />

                <Link
                  to="/courses"
                  className="btn btn-primary-custom px-4"
                >
                  Search
                </Link>
              </div>

              <div className="d-flex flex-wrap gap-4 text-secondary">
                <span>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Expert instructors
                </span>

                <span>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Practical learning
                </span>

                <span>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Verified certificates
                </span>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-body p-5">
                  <div className="d-flex justify-content-between mb-4">
                    <div>
                      <p className="text-secondary mb-1">
                        Your learning progress
                      </p>
                      <h3 className="fw-bold">Java Full Stack</h3>
                    </div>

                    <div className="bg-primary-subtle text-primary rounded-circle p-3">
                      <i className="bi bi-laptop fs-2"></i>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Course progress</span>
                    <strong>72%</strong>
                  </div>

                  <div
                    className="progress mb-4"
                    style={{ height: "10px" }}
                  >
                    <div
                      className="progress-bar"
                      style={{ width: "72%" }}
                    ></div>
                  </div>

                  <div className="row text-center g-3">
                    <div className="col-4">
                      <div className="bg-light rounded-3 p-3">
                        <h4 className="fw-bold mb-1">24</h4>
                        <small className="text-secondary">Lessons</small>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="bg-light rounded-3 p-3">
                        <h4 className="fw-bold mb-1">8</h4>
                        <small className="text-secondary">Quizzes</small>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="bg-light rounded-3 p-3">
                        <h4 className="fw-bold mb-1">4.8</h4>
                        <small className="text-secondary">Rating</small>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="btn btn-primary-custom w-100 mt-4 py-2"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <p className="text-primary-custom fw-semibold mb-2">
              LEARNING CATEGORIES
            </p>
            <h2 className="fw-bold">Explore popular categories</h2>
          </div>

          <div className="row g-4">
            {categories.map((category) => (
              <div className="col-md-6 col-lg-3" key={category.title}>
                <div className="card h-100 border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <div
                      className={`d-inline-flex bg-${category.color}-subtle text-${category.color} rounded-3 p-3 mb-3`}
                    >
                      <i className={`bi ${category.icon} fs-3`}></i>
                    </div>

                    <h5 className="fw-bold">{category.title}</h5>
                    <p className="text-secondary mb-0">
                      {category.courses} courses
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-light">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-5">
            <div>
              <p className="text-primary-custom fw-semibold mb-2">
                FEATURED COURSES
              </p>
              <h2 className="fw-bold mb-0">
                Start learning something new
              </h2>
            </div>

            <Link to="/courses" className="btn btn-outline-primary">
              View All Courses
            </Link>
          </div>

          <div className="row g-4">
            {courses.map((course) => (
              <div className="col-md-6 col-lg-4" key={course.id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                  <div
                    className={`bg-${course.color}-subtle text-${course.color} text-center py-5`}
                  >
                    <i className={`bi ${course.icon} display-2`}></i>
                  </div>

                  <div className="card-body p-4">
                    <span className="badge bg-primary-subtle text-primary mb-3">
                      Development
                    </span>

                    <h5 className="fw-bold">{course.title}</h5>

                    <p className="text-secondary">
                      By {course.instructor}
                    </p>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-warning">
                        <i className="bi bi-star-fill me-1"></i>
                        {course.rating}
                      </span>

                      <span className="text-secondary">
                        <i className="bi bi-people me-1"></i>
                        {course.students}
                      </span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0">
                        ₹{course.price.toLocaleString("en-IN")}
                      </h5>

                      <Link
                        to={`/courses/${course.id}`}
                        className="btn btn-sm btn-primary-custom"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-dark text-white">
        <div className="container py-4">
          <div className="row text-center g-4">
            <div className="col-6 col-lg-3">
              <h2 className="fw-bold">50+</h2>
              <p className="text-white-50 mb-0">Expert Courses</p>
            </div>

            <div className="col-6 col-lg-3">
              <h2 className="fw-bold">10K+</h2>
              <p className="text-white-50 mb-0">Active Students</p>
            </div>

            <div className="col-6 col-lg-3">
              <h2 className="fw-bold">25+</h2>
              <p className="text-white-50 mb-0">Expert Instructors</p>
            </div>

            <div className="col-6 col-lg-3">
              <h2 className="fw-bold">4.8</h2>
              <p className="text-white-50 mb-0">Average Rating</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;