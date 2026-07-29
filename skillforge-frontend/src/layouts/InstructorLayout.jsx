import { useState } from "react";
import { Outlet } from "react-router-dom";

import InstructorHeader from "../components/instructor/InstructorHeader";
import InstructorSidebar from "../components/instructor/InstructorSidebar";

function InstructorLayout() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className="instructor-layout">
      <InstructorSidebar />

      <div className="instructor-main">
        <InstructorHeader
          onMenuClick={() => setShowMobileSidebar(true)}
        />

        <div className="instructor-content">
          <Outlet />
        </div>
      </div>

      {showMobileSidebar && (
        <div className="instructor-mobile-sidebar d-lg-none">
          <button
            type="button"
            className="instructor-sidebar-backdrop"
            onClick={() => setShowMobileSidebar(false)}
            aria-label="Close instructor menu"
          ></button>

          <div className="instructor-mobile-sidebar-panel">
            <button
              type="button"
              className="btn btn-light instructor-sidebar-close"
              onClick={() => setShowMobileSidebar(false)}
              aria-label="Close instructor menu"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <InstructorSidebar
              mobile
              onNavigate={() => setShowMobileSidebar(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorLayout;
