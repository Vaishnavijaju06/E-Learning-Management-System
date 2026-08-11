const icons = {
  success: "bi-check-circle-fill",
  danger: "bi-exclamation-octagon-fill",
  warning: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill",
  primary: "bi-stars"
};

export default function AlertMessage({
  type = "danger",
  children
}) {
  if (!children) {
    return null;
  }

  return (
    <div
      className={`alert alert-${type} skillforge-alert d-flex align-items-start gap-3`}
      role="alert"
    >
      <i
        className={`bi ${icons[type] || icons.info} mt-1`}
      ></i>
      <div>{children}</div>
    </div>
  );
}
