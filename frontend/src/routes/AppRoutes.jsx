import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PortalLayout from "../layouts/PortalLayout";
import HomePage from "../pages/public/HomePage";
import GenericPage from "../pages/common/GenericPage";
import PortalPage from "../pages/common/PortalPage";
import AuthPage from "../pages/auth/AuthPage";
import NotFoundPage from "../pages/errors/NotFoundPage";

const publicPages = [
  ["/about", "About Us", "Discover the purpose and people behind SkillForge.", "bi-info-circle"],
  ["/courses", "Explore Courses", "Find practical courses for your next career goal.", "bi-journal-richtext"],
  ["/courses/:courseId", "Course Details", "Review the curriculum, instructor and learning outcomes.", "bi-book"],
  ["/categories", "Course Categories", "Browse learning paths by technology and interest.", "bi-grid"],
  ["/instructors", "Our Instructors", "Learn from experienced and supportive mentors.", "bi-person-video3"],
  ["/contact", "Contact Us", "We are ready to help with your learning journey.", "bi-envelope"],
  ["/faq", "Frequently Asked Questions", "Quick answers about learning on SkillForge.", "bi-question-circle"],
  ["/verify-certificate", "Verify Certificate", "Confirm a SkillForge certificate using its number.", "bi-patch-check"]
];

const portalPages = {
  student: [
    ["dashboard", "Student Dashboard"], ["learning", "My Learning"], ["wishlist", "My Wishlist"],
    ["quizzes", "My Quizzes"], ["certificates", "My Certificates"], ["profile", "Profile & Settings"]
  ],
  instructor: [
    ["dashboard", "Instructor Dashboard"], ["courses", "My Courses"], ["students", "Students"],
    ["analytics", "Instructor Analytics"], ["earnings", "Earnings"], ["profile", "Profile & Settings"]
  ],
  admin: [
    ["dashboard", "Admin Dashboard"], ["users", "User Management"], ["courses", "Course Management"],
    ["categories", "Category Management"], ["payments", "Payments & Refunds"],
    ["analytics", "Platform Analytics"], ["settings", "Platform Settings"]
  ]
};

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        {publicPages.map(([path, title, description, icon]) => (
          <Route key={path} path={path} element={<GenericPage title={title} description={description} icon={icon} />} />
        ))}
      </Route>

      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />

      {Object.entries(portalPages).map(([role, pages]) => (
        <Route key={role} path={`/${role}`} element={<PortalLayout role={role} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          {pages.map(([path, title]) => (
            <Route key={path} path={path} element={<PortalPage title={title} />} />
          ))}
        </Route>
      ))}

      <Route path="/unauthorized" element={<GenericPage title="Unauthorized" description="You do not have access to this page." icon="bi-shield-lock" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
