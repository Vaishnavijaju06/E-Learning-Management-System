import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container py-5">
      <div className="verify-panel mx-auto">
        <div className="empty-state-icon">
          <i className="bi bi-compass"></i>
        </div>
        <p className="section-eyebrow">Error 404</p>
        <h1 className="fw-bold">Page not found</h1>
        <p className="text-secondary mb-4">
          The page you are looking for may have moved or no longer
          exists.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <Link className="btn btn-primary" to="/">
            <i className="bi bi-house me-2"></i>
            Go Home
          </Link>
          <Link className="btn btn-outline-primary" to="/courses">
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
