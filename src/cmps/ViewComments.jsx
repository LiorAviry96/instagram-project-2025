/* eslint-disable react/prop-types */
import { useEffect, useContext } from "react";
import { PostContext } from "./contexts/PostContext";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
} from "date-fns";

export function ViewComments({ comments }) {
  const { getImageSrc } = useContext(PostContext);

  useEffect(() => {}, [comments.length]);

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
    <div className="comments-container">
      {comments && comments.length > 0 ? (
        <ul>
          {comments.map((comment, index) => (
            <li className="comment" key={comment.id || index}>
              <img
                src={getImageSrc(comment.by.imgUrl)}
                className="comment-img"
              ></img>
              <strong>{comment.by.fullname || "User"}</strong>
              <span>{comment.txt || "No comment text"}</span>
              <div className="comment-time">
                <p>{formatTimeAgo(new Date(comment.createdAt))}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  );
}
