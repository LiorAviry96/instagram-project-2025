/* eslint-disable react/prop-types */
import { useState } from "react";

export function Likes({ initialLikes, commentCount }) {
  const [likes, setLikes] = useState(initialLikes || 0);

  const handleLike = () => {
    setLikes(likes + 1);
  };
  const handleComment = () => {

  }
  //<span className="likes">{likes} Likes</span>

  return (
    <div>
    <button >
      <i onClick={handleLike} className="fa-regular fa-heart heart-icon"></i>
      <i  onClick={handleComment} className="fa-regular fa-comment comment-icon"></i>
    </button>
    <p>Like by</p>
    </div>
  );
}
