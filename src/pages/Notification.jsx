import { useEffect, useState } from "react";
import { userService } from "../services/users";

import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
} from "date-fns";

export function Notifications() {
  const loggedInUser = userService.getLoggedinUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!loggedInUser) return;

    fetchNotifications();
  }, [loggedInUser]);

  const fetchNotifications = async () => {
    try {
      const notificationsData = await userService.fetchAllNotifications(
        loggedInUser._id
      );
      setNotifications(notificationsData); // Update state
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

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

  /*function likeStoryHandler(data) {
    console.log("function is working");
    const newNotification = {
      type: "like",
      userId: data.fromUser.userId,
      fullname: data.fromUser.fullname,
      date: Date.now(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
  }
  function handleFollowed(data) {
    console.log("handleFollowed", data);
    const newNotification = {
      type: "follow",
      userId: data.fromUser.userId,
      fullname: data.fromUser.fullname,
      date: Date.now(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
  }*/

  const getNotificationText = (type) => {
    if (type === "follow") return "started to follow you";
    if (type === "like") return "liked your photo";
    if (type === "comment") return "commented on your photo";
    return "";
  };

  return (
    <div className="notif-modal-container">
      <div className="notif-header">
        <h2>Notifications</h2>
      </div>
      <div className="divider-notif"></div>

      {notifications.length > 0 ? (
        <div className="notif-list">
          {notifications
            .slice()
            .reverse()
            .map((notif) => (
              <div key={notif.timestamp} className="notif-item">
                <img
                  src={
                    notif.fromUser.imgUrl
                      ? `/assets/images/${notif.fromUser.imgUrl}.jpeg`
                      : "/default-avatar.jpeg"
                  }
                  alt={notif.user}
                  className="notif-user-avatar"
                />
                <p className="notif">
                  <strong>{notif.fromUser.fullname}</strong>{" "}
                  {getNotificationText(notif.type)}
                </p>
                <p className="timeAgo-notif">
                  {formatTimeAgo(notif.timestamp)}
                </p>
              </div>
            ))}
        </div>
      ) : (
        <div className="no-notifications">No new notifications</div>
      )}
    </div>
  );
}
