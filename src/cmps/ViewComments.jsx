/* eslint-disable react/prop-types */
import { useEffect, useContext } from "react";
import { PostContext } from "./contexts/PostContext";

export function ViewComments({ comments }) {
  const { getImageSrc } = useContext(PostContext);

  useEffect(() => {}, [comments.length]);
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
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  );
}
