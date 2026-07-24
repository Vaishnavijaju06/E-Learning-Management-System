import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <main className="container py-5 min-vh-100">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body text-center p-5">
          <i className="bi bi-shield-exclamation display-1 text-danger"></i>

          <h1 className="fw-bold mt-4">Access Denied</h1>

          <p className="text-secondary">
            Your account does not have permission to access this page.
          </p>

          <Link to="/" className="btn btn-primary-custom">
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default UnauthorizedPage;