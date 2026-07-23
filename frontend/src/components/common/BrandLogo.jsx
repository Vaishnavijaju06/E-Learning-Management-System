import { Link } from "react-router-dom";

function BrandLogo({ to = "/" }) {
  return (
    <Link className="brand-logo" to={to}>
      <i className="bi bi-mortarboard-fill" />
      <span>SkillForge</span>
    </Link>
  );
}

export default BrandLogo;
