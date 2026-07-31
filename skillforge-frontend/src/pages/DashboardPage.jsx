import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import { dashboardApi } from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const links = {
  ADMIN: [
    ["/admin/manage", "Administration", "bi-shield-check"],
    ["/courses", "Public Courses", "bi-journal-richtext"]
  ],
  INSTRUCTOR: [
    [
      "/instructor/courses",
      "Manage Courses",
      "bi-journal-plus"
    ],
    ["/courses", "Course Catalogue", "bi-collection"]
  ],
  STUDENT: [
    ["/student/learning", "My Learning", "bi-play-circle"],
    ["/student/wishlist", "Wishlist", "bi-heart"],
    [
      "/student/certificates",
      "Certificates",
      "bi-award"
    ]
  ]
};

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
      <div className="dashboard-heading mb-4">
        <p className="text-primary fw-semibold mb-1">
          {user.role} DASHBOARD
        </p>
        <h1 className="fw-bold">
          Welcome, {user.firstName}
        </h1>
        <p className="text-secondary mb-0">
          Here is your current SkillForge overview.
        </p>
      </div>

      <AlertMessage>{error}</AlertMessage>

      <div className="row g-4 mb-5">
        {metrics.map(([key, value]) => (
          <div className="col-sm-6 col-lg-3" key={key}>
            <div className="metric-card h-100">
              <span className="metric-label">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <strong className="metric-value">
                {typeof value === "number"
                  ? value
                  : String(value)}
              </strong>
            </div>
          </div>
        ))}
      </div>

      <h2 className="h4 fw-bold mb-3">Quick actions</h2>
      <div className="row g-3">
        {links[user.role].map(([to, label, icon]) => (
          <div className="col-md-4" key={to}>
            <Link
              to={to}
              className="quick-action text-decoration-none"
            >
              <i className={`bi ${icon}`}></i>
              <span>{label}</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
