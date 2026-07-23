import PagePlaceholder from "../../components/common/PagePlaceholder";

function GenericPage({ title, description, icon }) {
  return (
    <>
      <section className="page-banner">
        <div className="container text-center">
          <span className="text-primary fw-semibold">SKILLFORGE</span>
          <h1 className="display-5 fw-bold mt-2">{title}</h1>
          {description && <p className="lead text-secondary mb-0">{description}</p>}
        </div>
      </section>
      <PagePlaceholder title={`${title} foundation ready`} icon={icon} />
    </>
  );
}

export default GenericPage;
