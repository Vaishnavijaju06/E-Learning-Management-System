export default function DiscussionStatusBadge({ status }) {
  const config = {
    OPEN: {
      className: "bg-success-subtle text-success border border-success-subtle",
      icon: "bi-chat-dots-fill",
      label: "Open"
    },
    RESOLVED: {
      className: "bg-primary-subtle text-primary border border-primary-subtle",
      icon: "bi-check-circle-fill",
      label: "Resolved"
    },
    CLOSED: {
      className: "bg-dark-subtle text-dark border",
      icon: "bi-lock-fill",
      label: "Closed"
    }
  };

  const selected = config[status] || {
    className: "bg-secondary-subtle text-secondary border",
    icon: "bi-circle-fill",
    label: status
  };

  return (
    <span className={`badge ${selected.className}`}>
      <i className={`bi ${selected.icon} me-1`}></i>
      {selected.label}
    </span>
  );
}
