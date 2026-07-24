import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function StudentHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`;

  return (
    <header className="student-header bg-white border-bottom sticky-top">
      <div className="d-flex align-items-center justify-content-between px-3 px-md-4 py-3">
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-outline-secondary d-lg-none me-3"
            onClick={onMenuClick}
            aria-label="Open student menu"
          >
            <i className="bi bi-list fs-5"></i>
          </button>

          <div>
            <h5 className="fw-bold mb-0">Student Portal</h5>
            <small className="text-secondary">
              Learn, practise and grow
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          <button
            type="button"
            className="btn btn-light position-relative"
            aria-label="Notifications"
          >
            <i className="bi bi-bell"></i>

            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </button>

          <div className="dropdown">
            <button
              type="button"
              className="btn border-0 d-flex align-items-center gap-2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="student-avatar">{initials}</span>

              <span className="d-none d-md-block text-start">
                <span className="d-block fw-semibold">
                  {user.firstName} {user.lastName}
                </span>

                <small className="text-secondary">Student</small>
              </span>

              <i className="bi bi-chevron-down small"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
              <li>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => navigate("/student/profile")}
                >
                  <i className="bi bi-person me-2"></i>
                  My Profile
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => navigate("/student/courses")}
                >
                  <i className="bi bi-book me-2"></i>
                  My Courses
                </button>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <button
                  type="button"
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StudentHeader;