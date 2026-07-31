import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container py-5 text-center">
      <p className="display-1 fw-bold text-primary mb-0">
        404
      </p>
      <h1>Page not found</h1>
      <Link className="btn btn-primary mt-3" to="/">
        Go Home
      </Link>
    </div>
  );
}
