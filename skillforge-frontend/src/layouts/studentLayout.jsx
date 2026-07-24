import { useState } from "react";
import { Outlet } from "react-router-dom";

import StudentHeader from "../components/student/StudentHeader";
import StudentSidebar from "../components/student/StudentSidebar";

function StudentLayout() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className="student-layout">
      <StudentSidebar />

      <div className="student-main">
        <StudentHeader
          onMenuClick={() => setShowMobileSidebar(true)}
        />

        <div className="student-content">
          <Outlet />
        </div>
      </div>

      {showMobileSidebar && (
        <div className="student-mobile-sidebar d-lg-none">
          <button
            type="button"
            className="student-sidebar-backdrop"
            onClick={() => setShowMobileSidebar(false)}
            aria-label="Close student menu"
          ></button>

          <div className="student-mobile-sidebar-panel">
            <button
              type="button"
              className="btn btn-light student-sidebar-close"
              onClick={() => setShowMobileSidebar(false)}
              aria-label="Close student menu"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <StudentSidebar
              mobile
              onNavigate={() => setShowMobileSidebar(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentLayout;