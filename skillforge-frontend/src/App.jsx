import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import AdminManagePage from "./pages/AdminManagePage";
import CertificateVerifyPage from "./pages/CertificateVerifyPage";
import CertificatesPage from "./pages/CertificatesPage";
import CourseBuilderPage from "./pages/CourseBuilderPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CoursesPage from "./pages/CoursesPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import InstructorCoursesPage from "./pages/InstructorCoursesPage";
import LearningPage from "./pages/LearningPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import StudentLearningPage from "./pages/StudentLearningPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import WishlistPage from "./pages/WishlistPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route
            path="courses/:courseId"
            element={<CourseDetailsPage />}
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
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
