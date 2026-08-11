import apiClient from "./apiClient";

const notificationApi = {
  getAll() {
    return apiClient.get("/notifications");
  },

  getUnread() {
    return apiClient.get("/notifications/unread");
  },

  getUnreadCount() {
    return apiClient.get("/notifications/unread-count");
  },

  markAsRead(notificationId) {
    return apiClient.put(
      `/notifications/${notificationId}/read`
    );
  },

  markAllAsRead() {
    return apiClient.put("/notifications/read-all");
  },

  delete(notificationId) {
    return apiClient.delete(
      `/notifications/${notificationId}`
    );
  }
};

export default notificationApi;