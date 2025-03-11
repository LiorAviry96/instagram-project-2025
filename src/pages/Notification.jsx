import { useEffect, useState } from "react";
import { socketService } from "../services/socket.service";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socketService.on("user-followed", (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          type: "follow",
          user: data.user,
          message: "started following you",
          read: false,
        },
        ...prev,
      ]);
    });

    return () => {
      socketService.off("user-followed");
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((notif) => (
        <ul key={notif._id}>
          <li className="flex-1">
            <span>{notif.user}</span> {notif.message}
          </li>
        </ul>
      ))}
    </div>
  );
}
