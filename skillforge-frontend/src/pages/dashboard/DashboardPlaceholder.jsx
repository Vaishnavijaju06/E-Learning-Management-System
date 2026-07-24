import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DashboardPlaceholder({ title }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="container py-5 min-vh-100">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-5 text-center">
          <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center dashboard-placeholder-icon">
            <i className="bi bi-person-check display-5"></i>
          </div>

          <h1 className="fw-bold mt-4">{title}</h1>

          <p className="text-secondary">
            Welcome, {user.firstName} {user.lastName}
          </p>

          <span className="badge bg-primary mb-4">
            {user.role}
          </span>

          <div>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPlaceholder;