import { NavLink } from "react-router-dom";
import BrandLogo from "../common/BrandLogo";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "Categories", path: "/categories" },
  { label: "Instructors", path: "/instructors" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" }
];

function PublicNavbar() {
  return (
    <nav className="navbar navbar-expand-lg public-navbar sticky-top">
      <div className="container">
        <BrandLogo />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNavbar"
          aria-controls="publicNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="publicNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink className="nav-link px-lg-3" to={item.path}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex gap-2">
            <NavLink className="btn btn-outline-primary" to="/login">Login</NavLink>
            <NavLink className="btn btn-primary" to="/register">Get Started</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
