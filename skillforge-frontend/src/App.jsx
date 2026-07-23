import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import PublicNavbar from "./components/layout/PublicNavbar";
import PublicFooter from "./components/layout/PublicFooter";
import HomePage from "./pages/public/HomePage";
import CoursesPage from "./pages/public/CoursesPage";
import ComingSoonPage from "./pages/public/ComingSoonPage";

function App() {
  return (
    <>
      <PublicNavbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<ComingSoonPage />} />
        <Route path="/categories" element={<ComingSoonPage />} />
        <Route path="/instructors" element={<ComingSoonPage />} />
        <Route path="/about" element={<ComingSoonPage />} />
        <Route path="/contact" element={<ComingSoonPage />} />
        <Route path="/faq" element={<ComingSoonPage />} />

        <Route path="/login" element={<ComingSoonPage />} />
        <Route path="/register" element={<ComingSoonPage />} />
        <Route path="/forgot-password" element={<ComingSoonPage />} />

        <Route path="/404" element={<ComingSoonPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      <PublicFooter />

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="colored"
      />
    </>
  );
}

export default App;