import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="container py-5">
      <div className="verify-panel mx-auto">
        <div className="verify-check invalid">
          <i className="bi bi-shield-lock-fill"></i>
        </div>
        <p className="section-eyebrow text-danger">
          Restricted access
        </p>
        <h1 className="fw-bold">Access denied</h1>
        <p className="text-secondary mb-4">
          Your account does not have permission to open this page.
        </p>
        <Link className="btn btn-primary" to="/dashboard">
          <i className="bi bi-grid me-2"></i>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
