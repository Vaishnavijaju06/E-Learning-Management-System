import "./Footer.css";
import logo from "../assets/logo1.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">


        {/* Left Section */}

        <div className="footer-brand">

          <img
            src={logo}
            alt="SkillForge Logo"
            className="footer-logo"
          />

          <h2 className="footer-name">
            SkillForge
          </h2>

          <p className="footer-tagline">
            Learn. Build. Launch.
          </p>

          <p className="footer-description">
            SkillForge is an AI-powered Learning Management System that
            provides interactive courses, quizzes, assignments,
            certificates, AI assistance and personalized learning
            experiences for students and professionals.
          </p>

        </div>


        {/* Company */}

        <div className="footer-column">

          <h3>Company</h3>

          <Link to="/courses">Courses</Link>

          <Link to="/contact" className="footer-link">
            Contact Us
          </Link>

          <Link to="/login">Sign In</Link>

        </div>

        {/* Connect */}

        <div className="footer-column">

          <h3>Connect With Us</h3>

          <a href="mailto:skillforge@gmail.com">
            skillforge@gmail.com
          </a>

          <a href="tel:+919999999999">
            +91 99999 99999
          </a>

          <Link to="/contact">
            Support Center
          </Link>

        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} SkillForge. All Rights Reserved.
      </div>

    </footer>
  );
}