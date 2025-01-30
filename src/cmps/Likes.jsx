/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStoryDetails } from "../store/actions/story.actions";
import { userService } from "../services/user.service";
import { storyService } from "../services/story.service";
import { updateUser } from "../store/actions/user.actions";
import { ImageModal } from "./ImageModal";
import { SvgIcon } from "./SvgIcon";

export function Likes({ initialLikes, likedBy, storyId }) {
  const dispatch = useDispatch();
  const story = useSelector((state) =>
    state.storyModule.storys.find((story) => story._id === storyId)
  );
  const loggedInUser = userService.getLoggedinUser();
  const isInitiallyLiked = likedBy?.some(
    (user) => user._id === loggedInUser?._id
  );
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [likedUsers, setLikedUsers] = useState(likedBy || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const shouldShowLikes2 = isLiked && likes > 0;
  const shouldShowLikes = !isLiked && likes > 0;

  useEffect(() => {
    if (story) {
      setIsLiked(
        story.likedBy.some(
          (user) => user._id === userService.getLoggedinUser()?._id
        )
      );
      setLikes(story.likedBy.length);
      setLikedUsers(story.likedBy);
      const loggedInUser = userService.getLoggedinUser();

      if (loggedInUser) {
        const isStorySaved = loggedInUser.savedStorys.some(
          (savedStory) =>
            savedStory.userId === story.owner._id &&
            savedStory.imgUrl === story.imgUrl
        );
        setIsSaved(isStorySaved);
      }
    }
  }, [story, storyId]);

  const handleLike = async () => {
    const loggedInUser = userService.getLoggedinUser();
    if (!loggedInUser) {
      alert("Please log in to like stories");
      return;
    }

    try {
      const fullStory = await storyService.getById(storyId);
      const updatedLikedBy = isLiked
        ? fullStory.likedBy.filter((user) => user._id !== loggedInUser._id)
        : [...fullStory.likedBy, loggedInUser];

      const updatedStory = {
        ...fullStory,
        likedBy: updatedLikedBy,
      };

      updateStoryDetails(updatedStory);

      setLikes(updatedLikedBy.length);
      setLikedUsers(updatedLikedBy);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Failed to update likes:", err);
    }
  };

  const handleSaveStory = async () => {
    const loggedInUser = userService.getLoggedinUser();

    if (!loggedInUser) {
      alert("Please log in to save stories");
      return;
    }

    try {
      const fullStory = await storyService.getById(storyId);

      const existingSavedStory = loggedInUser.savedStorys.find(
        (savedStory) =>
          savedStory.userId === fullStory.owner._id &&
          savedStory.imgUrl === fullStory.imgUrl
      );

      let updatedSavedStorys;
      if (existingSavedStory) {
        updatedSavedStorys = loggedInUser.savedStorys.filter(
          (savedStory) =>
            savedStory.userId !== fullStory.owner._id ||
            savedStory.imgUrl !== fullStory.imgUrl
        );
        setIsSaved(false);
      } else {
        const savedStory = {
          userId: fullStory.owner._id,
          fullname: fullStory.owner.fullname,
          imgUrl: fullStory.imgUrl,
        };
        updatedSavedStorys = [...loggedInUser.savedStorys, savedStory];
        setIsSaved(true);
      }

      const updatedUser = {
        ...loggedInUser,
        savedStorys: updatedSavedStorys,
      };

      // Update the user in storage
      await userService.update(updatedUser);
      alert(isSaved ? "Story removed from saved" : "Story saved successfully!");
    } catch (err) {
      console.error("Failed to save story:", err);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const getRandomLiker = () => {
    if (likedUsers.length === 0) return "Anonymous";
    const randomIndex = Math.floor(Math.random() * likedUsers.length);
    return likedUsers[randomIndex]?.fullname || "Anonymous";
  };

  const randomLiker = getRandomLiker();
  const othersCount = Math.max(0, likedUsers.length - 1);

  return (
    <div className="likes">
      <div className="icons-container">
        <div className="left-icons">
          <SvgIcon
            className="icons"
            iconName={`${isLiked ? "heart" : "heartRed"}`}
            onClick={handleLike}
          />

          <SvgIcon className="icons" iconName="comment" onClick={toggleModal} />
          <SvgIcon iconName="share" />
        </div>
        <div className="right-icons">
          <SvgIcon
            className={`${isSaved ? "is-saved icons" : "icons"}`}
            iconName="saved"
            onClick={handleSaveStory}
          />
        </div>
      </div>
      {shouldShowLikes && (
        <p className="number-likes">
          Liked by <b>{randomLiker}</b> and{" "}
          <b>{othersCount > 0 && ` ${othersCount} others`}</b>
        </p>
      )}
      {shouldShowLikes2 && <p className="number-likes2">{likes} likes</p>}

      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <ImageModal
            image={{ imgUrl: story?.imgUrl }}
            story={story}
            txt={story.txt}
            toggleModal={toggleModal}
            isModalOpen={isModalOpen}
            updateComments={(updatedComments) => {
              const updatedStory = { ...story, comments: updatedComments };
              dispatch(updateStoryDetails(updatedStory));
            }}
          />
        </div>
      )}
    </div>
  );
}
