import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import NotificationBell from "./notifications/NotificationBell";
import logo from "../assets/logo1.png";

function linkClass({ isActive }) {
  return `nav-link skillforge-nav-link ${
    isActive ? "active" : ""
  }`;
}

function roleLabel(role) {
  if (role === "ADMIN") {
    return "Admin";
  }

  if (role === "INSTRUCTOR") {
    return "Instructor";
  }

  return "Student";
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    toast.info("You have been signed out safely.");
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-xl navbar-dark skillforge-navbar sticky-top">
      <div className="container">
        <Link
          className="navbar-brand skillforge-brand"
          to="/"
          aria-label="SkillForge home"
        >
          <img
            src={logo}
            alt="SkillForge Logo"
            className="brand-logo"
          />
          <span className="brand-copy">
            <strong>SkillForge</strong>
            <small>Learn. Build. Grow.</small>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavigation"
          aria-controls="mainNavigation"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="mainNavigation"
        >
          <ul className="navbar-nav me-auto mb-3 mb-xl-0 ms-xl-4">
            <li className="nav-item">
              <NavLink className={linkClass} to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={linkClass} to="/courses">
                Courses
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={linkClass} to="/contact">
                Contact
              </NavLink>
            </li>

            {user && (
              <li className="nav-item">
                <NavLink
                  className={linkClass}
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
              </li>
            )}

            {user?.role === "STUDENT" && (
              <>
                <li className="nav-item">
                  <NavLink
                    className={linkClass}
                    to="/student/learning"
                  >
                    My Learning
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={linkClass}
                    to="/student/assignments"
                  >
                    Assignments
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={linkClass}
                    to="/student/discussions"
                  >
                    Discussions
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={linkClass}
                    to="/student/wishlist"
                  >
                    Wishlist
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={linkClass}
                    to="/student/certificates"
                  >
                    Certificates
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === "INSTRUCTOR" && (
              <>
                <li className="nav-item">
                  <NavLink
                    className={linkClass}
                    to="/instructor/courses"
                  >
                    Manage Courses
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={linkClass}
                    to="/instructor/discussions"
                  >
                    Discussions
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={linkClass}
                    to="/instructor/assignments"
                  >
                    Assignments
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === "ADMIN" && (
              <li className="nav-item">
                <NavLink
                  className={linkClass}
                  to="/admin/manage"
                >
                  Administration
                </NavLink>
              </li>
            )}
          </ul>

          <div className="navbar-actions">
            {user ? (
              <>
                <NotificationBell />

                <Link
                  className="user-account-pill"
                  to="/profile"
                  title="Open profile"
                >
                  <span className="user-avatar">
                    {user.firstName?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </span>
                  <span className="user-account-copy">
                    <strong>{user.firstName}</strong>
                    <small>{roleLabel(user.role)}</small>
                  </span>
                </Link>

                <button
                  type="button"
                  className="btn navbar-logout-btn"
                  onClick={handleLogout}
                  title="Sign out"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-outline-light btn-sm px-3"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="btn btn-warning btn-sm px-3 fw-semibold"
                  to="/register"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
