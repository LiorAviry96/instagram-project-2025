/* eslint-disable react/prop-types */
import { useState } from "react";
import { userService } from "../services/user.service";
import { postService } from "../services/post.service";
import { updatePost } from "../store/actions/post.actions";

export function Likes({ initialLikes, likedBy, postId }) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [likedUsers, setLikedUsers] = useState(likedBy || []);



  const handleLike = async () => {
    const loggedInUser = userService.getLoggedinUser();
  
    if (!loggedInUser) {
      alert('Please log in to like posts');
      return;
    }
  
    try {
      // Get the full post object
      const fullPost = await postService.getById(postId);
  
      const updatedLikedBy = isLiked
        ? fullPost.likedBy.filter(user => user._id !== loggedInUser._id)
        : [...fullPost.likedBy, loggedInUser];
  
      const updatedPost = {
        ...fullPost, 
        likedBy: updatedLikedBy, 
      };
  
      console.log('Updated post:', updatedPost);
  
      await postService.save(updatedPost);
  
      // Update local state
      setLikes(updatedLikedBy.length);
      setLikedUsers(updatedLikedBy);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Failed to update likes:', err);
    }
  };
  

  const getRandomLiker = () => {
    if (likedUsers.length === 0) return "Anonymous";
    const randomIndex = Math.floor(Math.random() * likedUsers.length);
    return likedUsers[randomIndex]?.fullname || "Anonymous";
  };
  
  const randomLiker = getRandomLiker();
  const othersCount = Math.max(0, likedUsers.length - 1);
  

  function handleComment(){

  }

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
