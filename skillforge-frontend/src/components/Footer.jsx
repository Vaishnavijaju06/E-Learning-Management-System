export default function Footer() {
  return (
    <footer className="border-top bg-white py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between gap-2 small text-secondary">
        <span>
          © {new Date().getFullYear()} SkillForge LMS
        </span>
        <span>CDAC PG-DAC Academic Project</span>
      </div>
    </footer>
  );
}
