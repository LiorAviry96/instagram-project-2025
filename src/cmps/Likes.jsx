import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../store/actions/post.actions";
import { userService } from "../services/user.service";
import { postService } from "../services/post.service";

export function Likes({ initialLikes, likedBy, postId }) {
  const dispatch = useDispatch();
  
  const post = useSelector(state => state.postModule.posts.find(post => post._id === postId));
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [likedUsers, setLikedUsers] = useState(likedBy || []);
  
  useEffect(() => {
    if (post) {
      setIsLiked(post.likedBy.some(user => user._id === userService.getLoggedinUser()?._id));
      setLikes(post.likedBy.length);
      setLikedUsers(post.likedBy);
    }
  }, [post, postId]);

  const handleLike = async () => {
    const loggedInUser = userService.getLoggedinUser();
    
    if (!loggedInUser) {
      alert('Please log in to like posts');
      return;
    }

    try {
      const fullPost = await postService.getById(postId);
      const updatedLikedBy = isLiked
        ? fullPost.likedBy.filter(user => user._id !== loggedInUser._id)
        : [...fullPost.likedBy, loggedInUser];

      const updatedPost = {
        ...fullPost,
        likedBy: updatedLikedBy,
      };

      dispatch(updatePost(updatedPost)); // Dispatch to update Redux state

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

  return (
    <div className="likes">
      <button>
        <i
          onClick={handleLike}
          className={`heart-icon ${isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}`}
        ></i>
        <i className="fa-regular fa-comment comment-icon"></i>
        <i className="fa-regular fa-paper-plane send-icon"></i>
      </button>
      {isLiked && (
        <p>
          Liked by <b>{randomLiker}</b> and <b>{othersCount > 0 && ` ${othersCount} others`}</b>
        </p>
      )}
    </div>
  );
}
