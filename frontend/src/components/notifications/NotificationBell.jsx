import { useEffect, useRef, useState } from "react";

import useNotifications from "../../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  async function toggleDropdown() {
    const nextOpenState = !open;
    setOpen(nextOpenState);

    if (nextOpenState) {
      await loadNotifications();
    }
  }

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="position-relative"
    >
      <button
        type="button"
        className="btn btn-light position-relative rounded-circle notification-bell-btn"
        title="Notifications"
        aria-label="Notifications"
        onClick={toggleDropdown}
      >
        <i className="bi bi-bell fs-5"></i>

        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {unreadCount > 99 ? "99+" : unreadCount}

            <span className="visually-hidden">
              unread notifications
            </span>
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          loading={loading}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDelete={deleteNotification}
        />
      )}
    </div>
  );
}