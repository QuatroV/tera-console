import { removeNotification } from "@/store/notification";
import { useAppDispatch, useAppSelector } from "@/utils/redux";
import { useEffect, useState } from "react";

const NotificationPopupList = () => {
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );
  const dispatch = useAppDispatch();
  const [visibleNotifications, setVisibleNotifications] =
    useState(notifications);

  useEffect(() => {
    setVisibleNotifications(notifications);

    const timers = notifications.map((notification) => {
      return setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 3000); // 3 секунды на показ каждой нотификации
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, dispatch]);

  return (
    <div className="fixed bottom-5 right-5 space-y-3 max-h-sm overflow-y-auto">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border max-w-sm overflow-hidden transition-transform duration-300 animate-slide-in ${
            notification.type === "success"
              ? "bg-green-100 border-green-400"
              : notification.type === "info"
              ? "bg-blue-100 border-blue-400"
              : "bg-red-100 border-red-400"
          }`}
        >
          <h4 className="font-bold">{notification.title}</h4>
          <p className="text-ellipsis overflow-hidden">
            {notification.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NotificationPopupList;
