function PagePlaceholder({ title, description, icon = "bi-grid" }) {
  return (
    <div className="container py-5">
      <div className="placeholder-card text-center mx-auto" style={{ maxWidth: 760 }}>
        <div className="feature-icon mx-auto mb-3">
          <i className={`bi ${icon}`} />
        </div>
        <h1 className="h3 fw-bold">{title}</h1>
        <p className="text-secondary mb-0">
          {description || "This screen is prepared and will receive its complete workflow in the upcoming phase."}
        </p>
      </div>
    </div>
  );
}

export default PagePlaceholder;
