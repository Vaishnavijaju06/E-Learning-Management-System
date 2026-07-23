import PagePlaceholder from "../../components/common/PagePlaceholder";

function PortalPage({ title, description, icon = "bi-speedometer2" }) {
  return <PagePlaceholder title={title} description={description} icon={icon} />;
}

export default PortalPage;
