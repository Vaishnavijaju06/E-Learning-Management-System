import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function linkClass({ isActive }) {
  return `nav-link ${isActive ? "active fw-semibold" : ""}`;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark skillforge-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <span className="brand-mark me-2">S</span>
          SkillForge
        </Link>

        <button
          className="navbar-toggler"
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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

            {user && (
              <li className="nav-item">
                <NavLink className={linkClass} to="/dashboard">
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
              <li className="nav-item">
                <NavLink
                  className={linkClass}
                  to="/instructor/courses"
                >
                  Manage Courses
                </NavLink>
              </li>
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

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <Link
                  className="text-white text-decoration-none small"
                  to="/profile"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user.firstName}
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-outline-light btn-sm"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="btn btn-warning btn-sm"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
