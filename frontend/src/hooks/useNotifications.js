import { useEffect, useState } from "react";
import notificationApi from "../api/notificationApi";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const response = await notificationApi.getAll();

      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response =
        await notificationApi.getUnreadCount();

      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);

      await loadNotifications();
      await loadUnreadCount();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();

      await loadNotifications();
      await loadUnreadCount();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationApi.delete(id);

      await loadNotifications();
      await loadUnreadCount();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
  const token = localStorage.getItem("skillforge_token");

  if (!token) {
    return;
  }

  loadNotifications();
  loadUnreadCount();

  const interval = setInterval(() => {
    loadUnreadCount();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
}