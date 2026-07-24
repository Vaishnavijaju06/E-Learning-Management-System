import { Link } from "react-router-dom";

function StudentPlaceholderPage({ title, description }) {
  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body text-center p-5">
          <div className="dashboard-placeholder-icon bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center">
            <i className="bi bi-tools display-5"></i>
          </div>

          <h1 className="fw-bold mt-4">{title}</h1>

          <p className="text-secondary">{description}</p>

          <Link
            to="/student/dashboard"
            className="btn btn-primary-custom"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

export default StudentPlaceholderPage;