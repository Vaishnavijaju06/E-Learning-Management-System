import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import { dashboardApi } from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const links = {
  ADMIN: [
    ["/admin/manage", "Administration", "bi-shield-check", "Manage users, categories and approvals"],
    ["/courses", "Public Courses", "bi-journal-richtext", "Review the published course catalogue"]
  ],
  INSTRUCTOR: [
    ["/instructor/courses", "Manage Courses", "bi-journal-plus", "Create courses, modules, lessons and quizzes"],
    ["/instructor/assignments", "Assignments", "bi-clipboard2-check", "Publish work and evaluate submissions"],
    ["/instructor/discussions", "Discussions", "bi-chat-square-dots", "Answer student questions"]
  ],
  STUDENT: [
    ["/student/learning", "My Learning", "bi-play-circle", "Continue your enrolled courses"],
    ["/student/assignments", "Assignments", "bi-clipboard2-check", "Submit work and view feedback"],
    ["/student/discussions", "Discussions", "bi-chat-square-dots", "Ask questions to instructors"],
    ["/student/wishlist", "Wishlist", "bi-heart", "View your saved courses"],
    ["/student/certificates", "Certificates", "bi-award", "Download verified certificates"]
  ]
};

const metricIcons = [
  "bi-people",
  "bi-journal-bookmark",
  "bi-graph-up-arrow",
  "bi-award",
  "bi-currency-rupee",
  "bi-check2-circle"
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardApi
      .get()
      .then((response) => setData(response.data))
      .catch((requestError) =>
        setError(getErrorMessage(requestError))
      );
  }, []);

  if (!data && !error) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const metrics = data
    ? Object.entries(data).filter(([key]) => key !== "role")
    : [];

  return (
    <div className="container py-5">
      <section className="dashboard-welcome mb-5">
        <div>
          <span className="dashboard-role-chip">
            <i className="bi bi-grid-fill me-2"></i>
            {user.role} DASHBOARD
          </span>
          <h1>
            Welcome back, {user.firstName}
          </h1>
          <p>
            Here is your latest SkillForge overview and quick access
            to everything you need.
          </p>
        </div>
        <div className="dashboard-welcome-icon">
          <i className="bi bi-mortarboard-fill"></i>
        </div>
      </section>

      <AlertMessage>{error}</AlertMessage>

      <div className="row g-4 mb-5">
        {metrics.map(([key, value], index) => (
          <div className="col-sm-6 col-xl-3" key={key}>
            <article className="metric-card h-100">
              <div className="metric-icon">
                <i
                  className={`bi ${
                    metricIcons[index % metricIcons.length]
                  }`}
                ></i>
              </div>
              <span className="metric-label">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <strong className="metric-value">
                {typeof value === "number"
                  ? value
                  : String(value)}
              </strong>
            </article>
          </div>
        ))}
      </div>

      <div className="section-heading mb-4">
        <span className="section-eyebrow">Quick access</span>
        <h2 className="h3">What would you like to do?</h2>
        <p>
          Open your most-used SkillForge tools directly from the
          dashboard.
        </p>
      </div>

      <div className="row g-3">
        {(links[user.role] || []).map(
          ([to, label, icon, description]) => (
            <div className="col-md-6 col-xl-4" key={to}>
              <Link
                to={to}
                className="quick-action text-decoration-none h-100"
              >
                <span className="quick-action-icon">
                  <i className={`bi ${icon}`}></i>
                </span>
                <span>
                  <strong className="d-block">{label}</strong>
                  <small className="text-secondary">
                    {description}
                  </small>
                </span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}
