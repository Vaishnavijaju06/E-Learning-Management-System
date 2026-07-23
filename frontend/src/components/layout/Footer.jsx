import { Link } from "react-router-dom";
import BrandLogo from "../common/BrandLogo";

function Footer() {
  return (
    <footer className="footer py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <BrandLogo />
            <p className="mt-3 mb-0 text-secondary-emphasis" style={{ maxWidth: 430 }}>
              Practical, career-focused learning that helps every student turn knowledge into opportunity.
            </p>
          </div>
          <div className="col-6 col-lg-2">
            <h2 className="h6 text-white">Explore</h2>
            <div className="d-flex flex-column gap-2">
              <Link className="text-secondary" to="/courses">Courses</Link>
              <Link className="text-secondary" to="/categories">Categories</Link>
              <Link className="text-secondary" to="/instructors">Instructors</Link>
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <h2 className="h6 text-white">Support</h2>
            <div className="d-flex flex-column gap-2">
              <Link className="text-secondary" to="/faq">FAQ</Link>
              <Link className="text-secondary" to="/contact">Contact</Link>
              <Link className="text-secondary" to="/verify-certificate">Verify Certificate</Link>
            </div>
          </div>
          <div className="col-lg-3">
            <h2 className="h6 text-white">Project Evaluation</h2>
            <p className="small text-secondary mb-0">Frontend demo built with React, Vite and Bootstrap 5.</p>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <p className="small text-secondary mb-0">© 2026 SkillForge. Built for learning.</p>
      </div>
    </footer>
  );
}

export default Footer;
