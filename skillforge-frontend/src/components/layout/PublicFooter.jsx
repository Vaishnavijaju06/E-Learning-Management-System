import { Link } from "react-router-dom";

function PublicFooter() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <h3 className="fw-bold">
              <i className="bi bi-mortarboard-fill me-2"></i>
              SkillForge
            </h3>

            <p className="text-white-50 mt-3">
              A modern e-learning platform that helps students develop
              practical, industry-relevant skills.
            </p>
          </div>

          <div className="col-6 col-lg-3">
            <h5>Quick Links</h5>
            <div className="d-flex flex-column gap-2 mt-3">
              <Link className="text-white-50" to="/courses">
                Courses
              </Link>
              <Link className="text-white-50" to="/about">
                About Us
              </Link>
              <Link className="text-white-50" to="/contact">
                Contact
              </Link>
              <Link className="text-white-50" to="/faq">
                FAQ
              </Link>
            </div>
          </div>

          <div className="col-6 col-lg-4">
            <h5>Contact</h5>
            <div className="text-white-50 mt-3">
              <p>
                <i className="bi bi-envelope me-2"></i>
                support@skillforge.com
              </p>
              <p>
                <i className="bi bi-telephone me-2"></i>
                +91 98765 43210
              </p>
              <p>
                <i className="bi bi-geo-alt me-2"></i>
                Pune, Maharashtra
              </p>
            </div>
          </div>
        </div>

        <hr className="border-secondary" />

        <p className="text-center text-white-50 mb-0">
          © 2026 SkillForge. CDAC Project.
        </p>
      </div>
    </footer>
  );
}

export default PublicFooter;