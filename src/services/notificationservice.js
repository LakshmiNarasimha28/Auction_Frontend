import API from "./axios";

export const getNotifications = () =>
  API.get("/notifications");

export const markAsRead = (id) =>
  API.patch(`/notifications/${id}/read`);

export const markAllAsRead = () =>
  API.patch("/notifications/mark-all/read");

export const deleteNotification = (id) =>
  API.delete(`/notifications/${id}`);