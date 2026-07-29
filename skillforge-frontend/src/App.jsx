import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicFooter from "./components/layout/PublicFooter";
import PublicNavbar from "./components/layout/PublicNavbar";

import StudentLayout from "./layouts/StudentLayout";
import InstructorLayout from "./layouts/InstructorLayout";

import UnauthorizedPage from "./pages/common/UnauthorizedPage";
import DashboardPlaceholder from "./pages/dashboard/DashboardPlaceholder";

import LoginPage from "./pages/auth/LoginPage";

import CertificateVerificationPage from "./pages/public/CertificateVerificationPage";
import ComingSoonPage from "./pages/public/ComingSoonPage";
import CourseDetailsPage from "./pages/public/CourseDetailsPage";
import CoursesPage from "./pages/public/CoursesPage";
import HomePage from "./pages/public/HomePage";

import CertificateViewPage from "./pages/student/CertificateViewPage";
import CheckoutPage from "./pages/student/CheckoutPage";
import CourseLearningPage from "./pages/student/CourseLearningPage";
import QuizAttemptPage from "./pages/student/QuizAttemptPage";
import QuizHistoryPage from "./pages/student/QuizHistoryPage";
import QuizResultPage from "./pages/student/QuizResultPage";
import StudentCertificatesPage from "./pages/student/StudentCertificatesPage";
import StudentCoursesPage from "./pages/student/StudentCoursesPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import StudentQuizzesPage from "./pages/student/StudentQuizzesPage";
import StudentSettingsPage from "./pages/student/StudentSettingsPage";
import StudentWishlistPage from "./pages/student/StudentWishlistPage";

import PaymentSuccessPage from "./pages/student/PaymentSuccessPage";
import PaymentHistoryPage from "./pages/student/PaymentHistoryPage";

import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import InstructorDashboardPage from "./pages/instructor/InstructorDashboardPage";

function App() {
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/instructor") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!isDashboardRoute && <PublicNavbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route
          path="/courses/:courseId"
          element={<CourseDetailsPage />}
        />

        <Route path="/categories" element={<ComingSoonPage />} />
        <Route path="/instructors" element={<ComingSoonPage />} />
        <Route path="/about" element={<ComingSoonPage />} />
        <Route path="/contact" element={<ComingSoonPage />} />
        <Route path="/faq" element={<ComingSoonPage />} />

        <Route
          path="/verify-certificate/:certificateNumber"
          element={<CertificateVerificationPage />}
        />

        {/* Authentication routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        {/* Student portal */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<StudentDashboardPage />}
          />

          <Route
            path="courses"
            element={<StudentCoursesPage />}
          />

          <Route
            path="courses/:courseId/learn"
            element={<CourseLearningPage />}
          />

          <Route
            path="wishlist"
            element={<StudentWishlistPage />}
          />

          <Route
            path="quizzes"
            element={<StudentQuizzesPage />}
          />

          <Route
            path="quizzes/:quizId/attempt"
            element={<QuizAttemptPage />}
          />

          <Route
            path="quizzes/result/:attemptId"
            element={<QuizResultPage />}
          />

          <Route
            path="quizzes/history"
            element={<QuizHistoryPage />}
          />

          <Route
            path="certificates"
            element={<StudentCertificatesPage />}
          />

          <Route
            path="certificates/:certificateNumber"
            element={<CertificateViewPage />}
          />

          <Route
            path="profile"
            element={<StudentProfilePage />}
          />

          <Route
            path="settings"
            element={<StudentSettingsPage />}
          />

          <Route
            path="checkout/:courseId"
            element={<CheckoutPage />}
          />

          <Route
            path="payment-success/:paymentId"
            element={<PaymentSuccessPage />}
          />

          <Route
            path="payments"
            element={<PaymentHistoryPage />}
          />

        </Route>

        {/* Instructor portal */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />
          <Route
            path="dashboard"
            element={<InstructorDashboardPage />}
          />
          <Route
            path="courses"
            element={<DashboardPlaceholder title="Instructor Courses" />}
          />
          <Route
            path="courses/create"
            element={<DashboardPlaceholder title="Create Course" />}
          />
          <Route
            path="students"
            element={<DashboardPlaceholder title="Course Students" />}
          />
          <Route
            path="quizzes"
            element={<DashboardPlaceholder title="Quiz Management" />}
          />
          <Route
            path="assignments"
            element={<DashboardPlaceholder title="Assignment Management" />}
          />
          <Route
            path="discussions"
            element={<DashboardPlaceholder title="Course Discussions" />}
          />
          <Route
            path="reviews"
            element={<DashboardPlaceholder title="Course Reviews" />}
          />
          <Route
            path="earnings"
            element={<DashboardPlaceholder title="Instructor Earnings" />}
          />
          <Route
            path="profile"
            element={<DashboardPlaceholder title="Instructor Profile" />}
          />
          <Route
            path="settings"
            element={<DashboardPlaceholder title="Instructor Settings" />}
          />
        </Route>

        {/* Admin portal */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardPlaceholder title="Admin Dashboard" />
            </ProtectedRoute>
          }
        />

        {/* Common routes */}
        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />

        <Route path="/404" element={<ComingSoonPage />} />

        <Route
          path="*"
          element={<Navigate to="/404" replace />}
        />
      </Routes>

      {!isDashboardRoute && <PublicFooter />}

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="colored"
      />
    </>
  );
}

export default App;
