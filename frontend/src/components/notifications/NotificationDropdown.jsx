import NotificationItem from "./NotificationsItems";

export default function NotificationDropdown({
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}) {
  return (
    <div className="notification-dropdown position-absolute end-0 mt-2">
      <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
        <div>
          <h6 className="mb-0 fw-bold">Notifications</h6>
          <small className="text-secondary">
            {notifications.length} total updates
          </small>
        </div>

        {notifications.length > 0 && (
          <button
            type="button"
            className="btn btn-sm btn-link text-decoration-none"
            onClick={onMarkAllAsRead}
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="notification-list">
        {loading ? (
          <div className="text-center p-4">
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            ></div>
            <p className="small text-secondary mt-2 mb-0">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-4">
            <div className="empty-state-icon">
              <i className="bi bi-bell-slash"></i>
            </div>
            <p className="fw-semibold mb-1">
              You are all caught up
            </p>
            <p className="small text-secondary mb-0">
              New activity will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
