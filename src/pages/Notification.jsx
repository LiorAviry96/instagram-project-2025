import { useEffect, useState } from "react";
import { socketService } from "../services/socket.service";
import { SOCKET_EVENT_USER_FOLLOWED } from "../services/socket.service";
import { makeId } from "../services/util.service";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
} from "date-fns";
export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  //let loggedInUser = userService.getLoggedinUser();
  // Handle new follow notification

  const handleFollowed = (data) => {
    console.log("handleFollowed is working", data);
    setNotifications((prev) => {
      const newNotification = {
        id: makeId(),
        type: "follow",
        user: data.user,
        date: Date.now(),
        message: "started following you",
      };

      return [newNotification, ...prev];
    });
  };

  useEffect(() => {
    console.log("useEffect is working");
    console.log("Socket Service: ", socketService);
    socketService.on(SOCKET_EVENT_USER_FOLLOWED, (data) => {
      console.log("Follow event received:", data);
      //handleFollowed(data);
    });
    return () => {
      console.log("Cleaning up socket event listener");

      socketService.off(SOCKET_EVENT_USER_FOLLOWED, handleFollowed);
    };
  }, []);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const seconds = differenceInSeconds(now, date);

    if (seconds < 60) return `${seconds}s`;
    const minutes = differenceInMinutes(now, date);
    if (minutes < 60) return `${minutes}m`;
    const hours = differenceInHours(now, date);
    if (hours < 24) return `${hours}h`;
    const days = differenceInDays(now, date);
    if (days < 7) return `${days}d`;
    const weeks = differenceInWeeks(now, date);
    return `${weeks}w`;
  };
  return (
    <div className="notif-modal-container">
      <div className="notif-header">
        <h2>Notifications</h2>
      </div>
      <div className="divider-notif"></div>

      {notifications.length > 0 ? (
        <div className="notif-list">
          {notifications.map((notif) => (
            <div key={notif.id} className="notif-item">
              <img
                src={
                  notif.user.imgUrl
                    ? `/assets/images/${notif.user.imgUrl.imgUrl}.jpeg`
                    : "/default-avatar.jpeg"
                }
                alt={notif.user.fullname}
                className="notif-user-avatar"
              />
              <p className="notif">
                <strong>{notif.user}</strong> {notif.message}
              </p>
              <p className="timeAgo">{formatTimeAgo(notif.date)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-notifications">No new notifications</div>
      )}
    </div>
  );
}
