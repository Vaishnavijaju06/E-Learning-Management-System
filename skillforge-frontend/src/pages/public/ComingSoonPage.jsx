import { Link, useLocation } from "react-router-dom";

function ComingSoonPage() {
  const location = useLocation();

  return (
    <main className="container py-5">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body text-center p-5">
          <i className="bi bi-tools display-3 text-primary-custom"></i>

          <h1 className="fw-bold mt-3">Page Under Development</h1>

          <p className="text-secondary">
            The page for <strong>{location.pathname}</strong> will be
            completed in the upcoming steps.
          </p>

          <Link to="/" className="btn btn-primary-custom">
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ComingSoonPage;