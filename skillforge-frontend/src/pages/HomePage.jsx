import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { courseApi } from "../api/skillforgeApi";
import CourseCard from "../components/CourseCard";

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
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-5 py-lg-5">
            <div className="col-lg-7">
              <span className="badge rounded-pill hero-badge mb-3">
                Learn. Practise. Grow.
              </span>
              <h1 className="display-4 fw-bold">
                Build practical skills with
                <span className="text-warning">
                  {" "}SkillForge
                </span>
              </h1>
              <p className="lead opacity-75 my-4">
                Learn from structured courses, track your
                progress, attempt quizzes and earn verified
                certificates.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link
                  className="btn btn-warning btn-lg"
                  to="/courses"
                >
                  Explore Courses
                </Link>
                <Link
                  className="btn btn-outline-light btn-lg"
                  to="/register"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-illustration shadow-lg">
                <i className="bi bi-mortarboard-fill"></i>
                <h2 className="h4 mt-3">
                  Your learning journey starts here
                </h2>
                <div className="row g-2 mt-3 small">
                  <div className="col-6">
                    <div className="hero-stat">
                      <strong>Role-based</strong>
                      <span>Dashboards</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="hero-stat">
                      <strong>Verified</strong>
                      <span>Certificates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <p className="text-primary fw-semibold mb-1">
              START LEARNING
            </p>
            <h2 className="fw-bold mb-0">
              Featured courses
            </h2>
          </div>
          <Link to="/courses" className="btn btn-outline-primary">
            View all
          </Link>
        </div>

        <div className="row g-4">
          {courses.map((course) => (
            <div className="col-md-6 col-lg-4" key={course.id}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-journal-bookmark"></i>
            <p className="mb-0">
              Courses will appear after an administrator
              approves them.
            </p>
          </div>
        )}
      </section>

      <section className="bg-light border-top border-bottom">
        <div className="container py-5">
          <div className="row g-4 text-center">
            {[
              ["bi-play-circle", "Structured lessons"],
              ["bi-check2-square", "Practical quizzes"],
              ["bi-graph-up-arrow", "Progress tracking"],
              ["bi-patch-check", "Verified certificates"]
            ].map(([icon, title]) => (
              <div className="col-6 col-lg-3" key={title}>
                <i className={`bi ${icon} feature-icon`}></i>
                <h3 className="h6 mt-3">{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
