/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStory } from "../store/actions/story.actions";
import { userService } from "../services/user.service";
import { storyService } from "../services/story.service";
import { ImageModal } from "./ImageModal";

export function Likes({ initialLikes, likedBy, storyId }) {
  const dispatch = useDispatch();
  const story = useSelector(state => state.storyModule.storys.find(story => story._id === storyId));
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [likedUsers, setLikedUsers] = useState(likedBy || []);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const shouldShowLikes = isLiked && likes > 1;


  useEffect(() => {
    if (story) {
      setIsLiked(story.likedBy.some(user => user._id === userService.getLoggedinUser()?._id));
      setLikes(story.likedBy.length);
      setLikedUsers(story.likedBy);
    }
  }, [story, storyId]);

  const handleLike = async () => {
    const loggedInUser = userService.getLoggedinUser();
    if (!loggedInUser) {
      alert('Please log in to like stories');
      return;
    }

    try {
      const fullStory = await storyService.getById(storyId);
      const updatedLikedBy = isLiked
        ? fullStory.likedBy.filter(user => user._id !== loggedInUser._id)
        : [...fullStory.likedBy, loggedInUser];

      const updatedStory = {
        ...fullStory,
        likedBy: updatedLikedBy,
      };

      updateStory(updatedStory); // Dispatch to update Redux state

      setLikes(updatedLikedBy.length);
      setLikedUsers(updatedLikedBy);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Failed to update likes:', err);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen); // Toggle modal visibility

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
        <i className="fa-regular fa-comment comment-icon" onClick={toggleModal}></i>
        <i className="fa-regular fa-paper-plane send-icon"></i>
      </button>
      {shouldShowLikes && (
        <p>
          Liked by <b>{randomLiker}</b> and <b>{othersCount > 0 && ` ${othersCount} others`}</b>
        </p>
      )}
    {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <ImageModal
            image={{ imgUrl: story?.imgUrl }}
            story={story}
            txt={story.txt}
            toggleModal={toggleModal}
            updateComments={(updatedComments) => {
              const updatedStory = { ...story, comments: updatedComments };
              dispatch(updateStory(updatedStory));
            }}
          />
        </div>
      )}
    </div>
  );
}
