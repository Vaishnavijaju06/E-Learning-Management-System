import { NavLink } from "react-router-dom";

const navigationGroups = [
  {
    label: "MANAGE",
    items: [
      {
        title: "Dashboard",
        path: "/instructor/dashboard",
        icon: "bi-speedometer2",
      },
      {
        title: "My Courses",
        path: "/instructor/courses",
        icon: "bi-journal-richtext",
      },
      {
        title: "Students",
        path: "/instructor/students",
        icon: "bi-people",
      },
      {
        title: "Quizzes",
        path: "/instructor/quizzes",
        icon: "bi-ui-checks-grid",
      },
      {
        title: "Assignments",
        path: "/instructor/assignments",
        icon: "bi-file-earmark-check",
      },
    ],
  },
  {
    label: "BUSINESS",
    items: [
      {
        title: "Discussions",
        path: "/instructor/discussions",
        icon: "bi-chat-left-text",
      },
      {
        title: "Reviews",
        path: "/instructor/reviews",
        icon: "bi-star",
      },
      {
        title: "Earnings",
        path: "/instructor/earnings",
        icon: "bi-graph-up-arrow",
      },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      {
        title: "Profile",
        path: "/instructor/profile",
        icon: "bi-person",
      },
      {
        title: "Settings",
        path: "/instructor/settings",
        icon: "bi-gear",
      },
    ],
  },
];

function InstructorSidebar({ mobile = false, onNavigate }) {
  return (
    <aside
      className={
        mobile
          ? "instructor-sidebar h-100"
          : "instructor-sidebar d-none d-lg-flex"
      }
    >
      <div className="p-4 border-bottom border-secondary">
        <NavLink
          to="/instructor/dashboard"
          className="text-white text-decoration-none d-flex align-items-center"
          onClick={onNavigate}
        >
          <span className="instructor-logo-icon me-2">
            <i className="bi bi-mortarboard-fill"></i>
          </span>
          <span className="fs-4 fw-bold">SkillForge</span>
        </NavLink>
        <small className="text-white-50">Instructor Portal</small>
      </div>

      <nav className="p-3 flex-grow-1">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <p className="instructor-sidebar-label">{group.label}</p>

            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `instructor-nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-3 border-top border-secondary">
        <div className="instructor-tip-card">
          <i className="bi bi-lightbulb fs-3 text-warning"></i>
          <h6 className="fw-bold mt-2">Instructor Tip</h6>
          <p className="small text-white-50 mb-0">
            Complete your course curriculum before publishing.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default InstructorSidebar;
