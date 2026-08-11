import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import InstructorAssignmentPage from "./pages/InstructorAssignmentPage";
import StudentAssignmentPage from "./pages/StudentAssignmentPage";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDiscussionPage from "./pages/StudentDiscussionPage";
import AppLayout from "./layouts/AppLayout";
import AdminManagePage from "./pages/AdminManagePage";
import CertificateVerifyPage from "./pages/CertificateVerifyPage";
import CertificatesPage from "./pages/CertificatesPage";
import CourseBuilderPage from "./pages/CourseBuilderPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CoursesPage from "./pages/CoursesPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import InstructorCoursesPage from "./pages/InstructorCoursesPage";
import LearningPage from "./pages/LearningPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StudentLearningPage from "./pages/StudentLearningPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import WishlistPage from "./pages/WishlistPage";
import InstructorDiscussionPage from "./pages/InstructorDiscussionPage";
import ContactPage from "./pages/ContactPage";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          {/* Contact Page */}
          <Route path="contact" element={<ContactPage />} />
          <Route
            path="courses/:courseId"
            element={<CourseDetailsPage />}
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route
            path="forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route
            path="reset-password"
            element={<ResetPasswordPage />}
          />
          <Route
            path="verify-certificate/:serialNumber"
            element={<CertificateVerifyPage />}
          />
          <Route
            path="unauthorized"
            element={<UnauthorizedPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="dashboard"
              element={<DashboardPage />}
            />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route
            element={<ProtectedRoute roles={["STUDENT"]} />}
          >
            <Route
              path="student/learning"
              element={<StudentLearningPage />}
            />
            <Route
              path="student/learning/:courseId"
              element={<LearningPage />}
            />
            <Route
              path="student/wishlist"
              element={<WishlistPage />}
            />
            <Route
              path="student/certificates"
              element={<CertificatesPage />}
            />

            <Route
              path="/student/discussions"
              element={<StudentDiscussionPage />}
            />
            <Route
              path="/student/assignments"
              element={<StudentAssignmentPage />}
            />
          </Route>

          <Route
            element={<ProtectedRoute roles={["INSTRUCTOR"]} />}
          >
            <Route
              path="instructor/courses"
              element={<InstructorCoursesPage />}
            />
            <Route
              path="instructor/courses/:courseId/builder"
              element={<CourseBuilderPage />}
            />
            <Route
              path="/instructor/discussions"
              element={<InstructorDiscussionPage />}
            />
            <Route
              path="/instructor/assignments"
              element={ <InstructorAssignmentPage />}
            />
          </Route>

          <Route
            element={<ProtectedRoute roles={["ADMIN"]} />}
          >
            <Route
              path="admin/manage"
              element={<AdminManagePage />}
            />
          </Route>

          <Route
            path="home"
            element={<Navigate to="/" replace />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}