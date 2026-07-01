import {
  createContext,
  useContext,
  useState,
} from "react";

const NotificationContext =
  createContext();

export function NotificationProvider({
  children,
}) {

  const [notifications, setNotifications] =
    useState([]);

  const addNotification = (
    message,
    type = "info"
  ) => {

    const newNotification = {
      id: Date.now(),
      message,
      type,
      read: false,
      createdAt:
        new Date().toLocaleTimeString(),
    };

    setNotifications((prev) => {

      const updated = [
        newNotification,
        ...prev,
      ];

      return updated.slice(0, 100);
    });
  };

  const markAllAsRead = () => {

    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  };

  return (

    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAllAsRead,
      }}
    >

      {children}

    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}