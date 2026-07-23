import { NavLink } from "react-router-dom";

function PublicNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-3" to="/">
          <i className="bi bi-mortarboard-fill text-primary-custom me-2"></i>
          Skill<span className="text-primary-custom">Forge</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#skillForgeNavbar"
          aria-controls="skillForgeNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="skillForgeNavbar"
        >
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/courses">
                Courses
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/categories">
                Categories
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/instructors">
                Instructors
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="d-flex gap-2">
            <NavLink className="btn btn-outline-primary" to="/login">
              Login
            </NavLink>

            <NavLink className="btn btn-primary-custom px-4" to="/register">
              Register
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;