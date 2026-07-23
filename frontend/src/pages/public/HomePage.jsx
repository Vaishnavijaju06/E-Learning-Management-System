import { Link } from "react-router-dom";

const benefits = [
  ["bi-code-slash", "Project-based learning", "Build practical skills through guided, job-ready courses."],
  ["bi-person-video3", "Expert instructors", "Learn from experienced mentors who explain concepts clearly."],
  ["bi-award", "Verified certificates", "Showcase course completion with SkillForge certificates."]
];

function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
                <i className="bi bi-stars text-primary me-2" />
                Learn skills that move your career forward
              </span>
              <h1 className="hero-title">
                Forge your future with <span className="gradient-text">practical learning.</span>
              </h1>
              <p className="lead text-secondary my-4" style={{ maxWidth: 650 }}>
                Master Java, React, Spring Boot, Python and more through structured courses, quizzes and real progress tracking.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link className="btn btn-primary btn-lg px-4" to="/courses">
                  Explore Courses <i className="bi bi-arrow-right ms-2" />
                </Link>
                <Link className="btn btn-outline-primary btn-lg px-4" to="/register">
                  Start Learning Free
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-panel">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="feature-icon"><i className="bi bi-laptop" /></div>
                  <div>
                    <small className="text-secondary">Continue learning</small>
                    <h2 className="h5 mb-0">Java Full Stack Development</h2>
                  </div>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span>Course progress</span><strong>68%</strong>
                </div>
                <div className="progress mb-4" style={{ height: 9 }}>
                  <div className="progress-bar bg-primary" style={{ width: "68%" }} />
                </div>
                <div className="row g-3">
                  {[
                    ["8+", "Career tracks"],
                    ["50+", "Expert courses"],
                    ["10K+", "Learners"]
                  ].map(([value, label]) => (
                    <div className="col-4" key={label}>
                      <div className="metric-card text-center p-3">
                        <div className="fw-bold text-primary">{value}</div>
                        <small className="text-secondary">{label}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold">WHY SKILLFORGE</span>
            <h2 className="display-6 fw-bold mt-2">Everything you need to keep growing</h2>
          </div>
          <div className="row g-4">
            {benefits.map(([icon, title, text]) => (
              <div className="col-md-4" key={title}>
                <div className="feature-card">
                  <div className="feature-icon mb-3"><i className={`bi ${icon}`} /></div>
                  <h3 className="h5 fw-bold">{title}</h3>
                  <p className="text-secondary mb-0">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
