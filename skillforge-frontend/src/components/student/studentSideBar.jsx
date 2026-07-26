import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    title: "Dashboard",
    path: "/student/dashboard",
    icon: "bi-speedometer2",
  },
  {
    title: "My Courses",
    path: "/student/courses",
    icon: "bi-journal-bookmark",
  },
  {
    title: "Wishlist",
    path: "/student/wishlist",
    icon: "bi-heart",
  },
  {
    title: "Quizzes",
    path: "/student/quizzes",
    icon: "bi-ui-checks-grid",
  },
  {
    title: "Certificates",
    path: "/student/certificates",
    icon: "bi-award",
  },
  {
    title: "Profile",
    path: "/student/profile",
    icon: "bi-person",
  },
  {
    title: "Settings",
    path: "/student/settings",
    icon: "bi-gear",
  },
];

function StudentSidebar({ mobile = false, onNavigate }) {
  return (
    <aside
      className={
        mobile ? "student-sidebar h-100" : "student-sidebar d-none d-lg-flex"
      }
    >
      <div className="p-4 border-bottom border-secondary">
        <NavLink
          to="/student/dashboard"
          className="text-white text-decoration-none d-flex align-items-center"
          onClick={onNavigate}
        >
          <span className="student-logo-icon me-2">
            <i className="bi bi-mortarboard-fill"></i>
          </span>

          <span className="fs-4 fw-bold">SkillForge</span>
        </NavLink>

        <small className="text-white-50">Student Portal</small>
      </div>

      <nav className="p-3 flex-grow-1">
        <p className="student-sidebar-label">LEARNING</p>

        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `student-nav-link ${isActive ? "active" : ""}`
            }
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.title}</span>
          </NavLink>
        ))}

        <p className="student-sidebar-label mt-4">DISCOVER</p>

        <NavLink
          to="/courses"
          onClick={onNavigate}
          className="student-nav-link"
        >
          <i className="bi bi-search"></i>
          <span>Browse Courses</span>
        </NavLink>

      </nav>

      <div className="p-3 border-top border-secondary">
        <div className="student-help-card">
          <i className="bi bi-headset fs-3 text-info"></i>
          <h6 className="fw-bold mt-2">Need Help?</h6>
          <p className="small text-white-50 mb-2">
            Contact our student support team.
          </p>

          <button type="button" className="btn btn-sm btn-outline-light w-100">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
}

export default StudentSidebar;
