import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import BrandLogo from "../components/common/BrandLogo";

const portalMenus = {
  student: [
    ["Dashboard", "/student/dashboard", "bi-speedometer2"],
    ["My Learning", "/student/learning", "bi-play-circle"],
    ["Wishlist", "/student/wishlist", "bi-heart"],
    ["Quizzes", "/student/quizzes", "bi-patch-question"],
    ["Certificates", "/student/certificates", "bi-award"],
    ["Profile", "/student/profile", "bi-person"]
  ],
  instructor: [
    ["Dashboard", "/instructor/dashboard", "bi-speedometer2"],
    ["My Courses", "/instructor/courses", "bi-journal-richtext"],
    ["Students", "/instructor/students", "bi-people"],
    ["Analytics", "/instructor/analytics", "bi-bar-chart"],
    ["Earnings", "/instructor/earnings", "bi-wallet2"],
    ["Profile", "/instructor/profile", "bi-person"]
  ],
  admin: [
    ["Dashboard", "/admin/dashboard", "bi-speedometer2"],
    ["Users", "/admin/users", "bi-people"],
    ["Courses", "/admin/courses", "bi-journal-check"],
    ["Categories", "/admin/categories", "bi-tags"],
    ["Payments", "/admin/payments", "bi-credit-card"],
    ["Analytics", "/admin/analytics", "bi-graph-up"],
    ["Settings", "/admin/settings", "bi-gear"]
  ]
};

function PortalLayout({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menu = portalMenus[role];
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <BrandLogo to={`/${role}/dashboard`} />
        <div className="small text-uppercase text-secondary fw-semibold mt-4 mb-2">{roleLabel} Portal</div>
        <nav>
          {menu.map(([label, path, icon]) => (
            <NavLink
              className="sidebar-link"
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${icon}`} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <NavLink className="sidebar-link mt-4" to="/">
          <i className="bi bi-box-arrow-left" />
          <span>Back to Website</span>
        </NavLink>
      </aside>
      <div className="portal-main">
        <header className="portal-topbar d-flex align-items-center justify-content-between">
          <button
            className="btn btn-light d-lg-none"
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Open sidebar"
          >
            <i className="bi bi-list fs-5" />
          </button>
          <div>
            <span className="text-secondary small">SkillForge</span>
            <div className="fw-semibold">{roleLabel} Workspace</div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-light rounded-circle" type="button" title="Notifications">
              <i className="bi bi-bell" />
            </button>
            <div className="rounded-circle bg-primary text-white d-grid place-items-center p-2">
              <i className="bi bi-person-fill" />
            </div>
          </div>
        </header>
        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PortalLayout;
