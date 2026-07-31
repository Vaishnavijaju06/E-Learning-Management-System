import { Outlet } from "react-router-dom";

import ChatbotWidget from "../components/ChatbotWidget";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />

      {user && <ChatbotWidget />}
    </div>
  );
}
