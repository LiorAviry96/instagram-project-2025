/* eslint-disable react/prop-types */
import { useState } from "react";

export function Likes({ initialLikes, likedBy }) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
    } else {
      setLikes(likes - 1);
      setIsLiked(false);
    }
  };

  const getRandomLiker = () => {
    if (likedBy.length === 0) return "Anonymous";
    const randomIndex = Math.floor(Math.random() * likedBy.length);
    return likedBy[randomIndex]?.fullname || "Anonymous";
  };

  const randomLiker = getRandomLiker();
  const othersCount = Math.max(0, likedBy.length - 1);

  function handleComment(){

  }
  //<span className="likes">{likes} Likes</span>

  return (
    <div>
    <button >
      <i onClick={handleLike}  className={`heart-icon ${isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}`}></i>
      <i  onClick={handleComment} className="fa-regular fa-comment comment-icon"></i>
    </button>
    {isLiked && (
        <p>
          Liked by <b>{randomLiker}</b> and <b>{othersCount > 0 && ` ${othersCount} others`}</b>
        </p>
      )}
    </div>
  );
}
