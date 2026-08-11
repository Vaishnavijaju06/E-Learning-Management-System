import { useNavigate } from "react-router-dom";

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const value = new Date(dateValue);
  const diff = Date.now() - value.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  return value.toLocaleDateString();
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete
}) {
  const navigate = useNavigate();

  async function handleOpen() {
    if (!notification.read) {
      await onMarkAsRead(notification.id);
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  }

  function handleDelete(event) {
    event.stopPropagation();
    onDelete(notification.id);
  }

  return (
    <div
      className={`notification-item ${
        notification.read ? "" : "unread"
      }`}
    >
      <div className="d-flex gap-2 align-items-start">
        <button
          type="button"
          className="btn text-start p-0 flex-grow-1 border-0 shadow-none"
          onClick={handleOpen}
        >
          <div className="d-flex align-items-center gap-2">
            {!notification.read && (
              <span
                className="bg-primary rounded-circle flex-shrink-0"
                style={{ width: 8, height: 8 }}
              ></span>
            )}
            <strong className="small">
              {notification.title}
            </strong>
          </div>

          <p className="small text-secondary mb-1 mt-2 line-clamp-3">
            {notification.message}
          </p>

          <span className="small text-muted">
            <i className="bi bi-clock me-1"></i>
            {formatDate(notification.createdAt)}
          </span>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-light border-0 text-danger"
          title="Delete notification"
          aria-label="Delete notification"
          onClick={handleDelete}
        >
          <i className="bi bi-trash3"></i>
        </button>
      </div>
    </div>
  );
}
