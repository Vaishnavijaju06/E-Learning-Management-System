import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { courseApi } from "../api/skillforgeApi";
import CourseCard from "../components/CourseCard";
import AnnouncementRibbon from "../components/common/AnnouncementRibbon/AnnouncementRibbon";
import StatsCounter from "../components/home/StatsCounter";

const featureItems = [
  {
    icon: "bi-journal-play",
    title: "Structured learning",
    text: "Learn through organised modules, lessons and practical resources."
  },
  {
    icon: "bi-ui-checks-grid",
    title: "Quizzes & assignments",
    text: "Practise concepts and receive clear instructor feedback."
  },
  {
    icon: "bi-chat-square-dots",
    title: "Course discussions",
    text: "Ask questions and communicate directly with your instructor."
  },
  {
    icon: "bi-patch-check-fill",
    title: "Verified certificates",
    text: "Earn downloadable certificates with public verification."
  }
];

export default function HomePage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    courseApi
      .list()
      .then((response) =>
        setCourses(response.data.slice(0, 3))
      )
      .catch(() => setCourses([]));
  }, []);

  return (
    <>
      {/* Announcement Ribbon */}
      <AnnouncementRibbon />

      <section className="hero-section">
        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>

        <div className="container position-relative py-5">
          <div className="row align-items-center g-5 py-lg-5">
            <div className="col-lg-7">
              <span className="hero-badge mb-4">
                <i className="bi bi-stars me-2"></i>
                A smarter way to learn practical skills
              </span>

              <h1 className="hero-title">
                Learn today.
                <br />
                Build your <span>future.</span>
              </h1>

              <p className="hero-description">
                SkillForge brings courses, assignments,
                discussions, secure payments and verified
                certificates into one simple learning
                experience.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link
                  className="btn btn-warning btn-lg hero-primary-btn"
                  to="/courses"
                >
                  Explore Courses
                  <i className="bi bi-arrow-up-right ms-2"></i>
                </Link>
                <Link
                  className="btn btn-outline-light btn-lg hero-secondary-btn"
                  to="/register"
                >
                  Create Free Account
                </Link>
              </div>

              <div className="hero-trust-row">
                <div>
                  <strong>Role-based</strong>
                  <span>learning dashboards</span>
                </div>
                <div>
                  <strong>Secure</strong>
                  <span>Razorpay checkout</span>
                </div>
                <div>
                  <strong>Verified</strong>
                  <span>digital certificates</span>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-dashboard-card">
                <div className="hero-dashboard-top">
                  <div>
                    <span className="dashboard-dot"></span>
                    <span className="dashboard-dot"></span>
                    <span className="dashboard-dot"></span>
                  </div>
                  <span>Student Workspace</span>
                </div>

                <div className="hero-learning-preview">
                  <div className="preview-icon">
                    <i className="bi bi-mortarboard-fill"></i>
                  </div>
                  <div>
                    <small>Continue learning</small>
                    <h2>Spring Boot Fundamentals</h2>
                    <div className="progress hero-progress">
                      <div
                        className="progress-bar"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                    <span>72% course progress</span>
                  </div>
                </div>

                <div className="row g-3 mt-1">
                  <div className="col-6">
                    <div className="preview-stat-card">
                      <i className="bi bi-check2-circle"></i>
                      <strong>12</strong>
                      <span>Lessons done</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="preview-stat-card">
                      <i className="bi bi-trophy"></i>
                      <strong>86%</strong>
                      <span>Quiz score</span>
                    </div>
                  </div>
                </div>

                <div className="hero-mini-notice">
                  <i className="bi bi-bell-fill"></i>
                  <div>
                    <strong>Assignment evaluated</strong>
                    <span>Your instructor shared feedback.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container">
          <div className="section-heading d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <span className="section-eyebrow">
                Featured learning
              </span>
              <h2>Courses built for practical growth</h2>
              <p>
                Explore approved courses created by SkillForge
                instructors.
              </p>
            </div>
            <Link
              to="/courses"
              className="btn btn-outline-primary"
            >
              Browse all courses
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

          <div className="row g-4">
            {courses.map((course) => (
              <div
                className="col-md-6 col-lg-4"
                key={course.id}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="bi bi-journal-bookmark"></i>
              </div>
              <h3 className="h5">Courses are coming soon</h3>
              <p className="mb-0">
                Approved courses will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="feature-section section-space">
        <div className="container">
          <div className="section-heading text-center mx-auto mb-5">
            <span className="section-eyebrow">
              Everything in one place
            </span>
            <h2>A complete learning workflow</h2>
            <p>
              From enrolment to certification, each part of the
              learning journey stays connected.
            </p>
          </div>

          <div className="row g-4">
            {featureItems.map((item) => (
              <div className="col-md-6 col-xl-3" key={item.title}>
                <article className="feature-card h-100">
                  <div className="feature-icon-box">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container">
          <div className="home-cta">
            <div>
              <span className="section-eyebrow text-warning">
                Start your journey
              </span>
              <h2>Ready to forge your next skill?</h2>
              <p>
                Create your account and begin learning through
                courses designed for real-world practice.
              </p>
            </div>
            <div className="d-flex flex-wrap gap-3">
              <Link
                className="btn btn-warning btn-lg"
                to="/register"
              >
                Join SkillForge
              </Link>
              <Link
                className="btn btn-outline-light btn-lg"
                to="/courses"
              >
                View Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatsCounter />
    </>
  );
}
