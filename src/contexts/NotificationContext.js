import { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext(null);

const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    type: "info",
    message: "Welcome to Equipment Rental Management System",
    read: false,
    timestamp: new Date().toISOString(),
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.setItem(
      "notifications",
      JSON.stringify(INITIAL_NOTIFICATIONS)
    );
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      id: `n${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    return newNotification;
  };

  const dismissNotification = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    const clearedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    setNotifications(clearedNotifications);
    localStorage.setItem("notifications", JSON.stringify(clearedNotifications));
  };

  const getUnreadCount = () => {
    return notifications.filter((notification) => !notification.read).length;
  };

  const resetNotifications = (notificationsArray) => {
    setNotifications(notificationsArray);
    localStorage.setItem("notifications", JSON.stringify(notificationsArray));
  };

  const value = {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications,
    getUnreadCount,
    resetNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
