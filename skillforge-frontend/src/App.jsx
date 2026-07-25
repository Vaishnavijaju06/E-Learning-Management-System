import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import PublicNavbar from "./components/layout/PublicNavbar";
import PublicFooter from "./components/layout/PublicFooter";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import HomePage from "./pages/public/HomePage";
import CoursesPage from "./pages/public/CoursesPage";

import CourseDetailsPage from "./pages/public/CourseDetailsPage";
import ComingSoonPage from "./pages/public/ComingSoonPage";

import LoginPage from "./pages/auth/LoginPage";
import UnauthorizedPage from "./pages/common/UnauthorizedPage";
import DashboardPlaceholder from "./pages/dashboard/DashboardPlaceholder";

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import StudentPlaceholderPage from "./pages/student/StudentPlaceholderPage";
import StudentWishlistPage from "./pages/student/StudentWishlistPage";

import StudentCoursesPage from "./pages/student/StudentCoursesPage";
import CourseLearningPage from "./pages/student/CourseLearningPage";

import StudentQuizzesPage from "./pages/student/StudentQuizzesPage";
import QuizAttemptPage from "./pages/student/QuizAttemptPage";
import QuizResultPage from "./pages/student/QuizResultPage";
import QuizHistoryPage from "./pages/student/QuizHistoryPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import StudentSettingsPage from "./pages/student/StudentSettingsPage";

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
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />

        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />

        <Route path="/categories" element={<ComingSoonPage />} />
        <Route path="/instructors" element={<ComingSoonPage />} />
        <Route path="/about" element={<ComingSoonPage />} />
        <Route path="/contact" element={<ComingSoonPage />} />
        <Route path="/faq" element={<ComingSoonPage />} />

        {/* Authentication routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<ComingSoonPage />} />

        <Route path="/forgot-password" element={<ComingSoonPage />} />

        {/* Student portal */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<StudentDashboardPage />} />

          <Route path="courses" element={<StudentCoursesPage />} />

          <Route
            path="courses/:courseId/learn"
            element={<CourseLearningPage />}
          />

          <Route path="wishlist" element={<StudentWishlistPage />} />

          <Route path="quizzes" element={<StudentQuizzesPage />} />

          <Route path="quizzes/:quizId/attempt" element={<QuizAttemptPage />} />

          <Route
            path="quizzes/result/:attemptId"
            element={<QuizResultPage />}
          />

          <Route path="quizzes/history" element={<QuizHistoryPage />} />

          <Route
            path="certificates"
            element={
              <StudentPlaceholderPage
                title="My Certificates"
                description="Your earned certificates will appear here."
              />
            }
          />

          <Route path="profile" element={<StudentProfilePage />} />

          <Route path="settings" element={<StudentSettingsPage />} />
        </Route>

        {/* Instructor portal */}
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <DashboardPlaceholder title="Instructor Dashboard" />
            </ProtectedRoute>
          }
        />

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
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/404" element={<ComingSoonPage />} />

        <Route path="*" element={<Navigate to="/404" replace />} />

        <Route path="/forgot-password" element={<ComingSoonPage />} />

        <Route path="/404" element={<ComingSoonPage />} />

        {/* Student portal */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<StudentDashboardPage />} />

          <Route
            path="courses"
            element={
              <StudentPlaceholderPage
                title="My Courses"
                description="Your enrolled courses will appear here."
              />
            }
          />

          <Route
            path="courses/:courseId/learn"
            element={
              <StudentPlaceholderPage
                title="Course Learning"
                description="The lesson player will be developed in the next steps."
              />
            }
          />

          <Route
            path="wishlist"
            element={
              <StudentPlaceholderPage
                title="My Wishlist"
                description="Your saved courses will appear here."
              />
            }
          />

          <Route path="quizzes" element={<StudentQuizzesPage />} />

          <Route path="quizzes/:quizId/attempt" element={<QuizAttemptPage />} />

          <Route
            path="quizzes/result/:attemptId"
            element={<QuizResultPage />}
          />

          <Route path="quizzes/history" element={<QuizHistoryPage />} />

          <Route
            path="certificates"
            element={
              <StudentPlaceholderPage
                title="My Certificates"
                description="Your earned certificates will appear here."
              />
            }
          />

          <Route path="profile" element={<StudentProfilePage />} />

          <Route path="settings" element={<StudentSettingsPage />} />
        </Route>
        {/* Instructor portal */}
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <DashboardPlaceholder title="Instructor Dashboard" />
            </ProtectedRoute>
          }
        />

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
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/404" element={<ComingSoonPage />} />

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {!isDashboardRoute && <PublicFooter />}

      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </>
  );
}

export default App;
