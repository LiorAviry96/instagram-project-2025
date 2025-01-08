/* eslint-disable react/prop-types */
import { useState } from "react";

export function Likes({ initialLikes }) {
  const [likes, setLikes] = useState(initialLikes || 0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <button onClick={handleLike}>
      <span className="heart-icon">❤️</span>
      <span>{likes} Likes</span>
    </button>
  );
}
