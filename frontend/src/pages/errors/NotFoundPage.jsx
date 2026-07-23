import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light text-center px-3">
      <div>
        <div className="display-1 fw-bold gradient-text">404</div>
        <h1 className="h2 fw-bold">Page not found</h1>
        <p className="text-secondary">The page you requested does not exist.</p>
        <Link className="btn btn-primary" to="/">Return Home</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
