import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="container py-5 text-center">
      <i className="bi bi-shield-lock display-1 text-danger"></i>
      <h1 className="mt-3">Access denied</h1>
      <p className="text-secondary">
        Your account does not have permission to open this page.
      </p>
      <Link className="btn btn-primary" to="/dashboard">
        Return to Dashboard
      </Link>
    </div>
  );
}
