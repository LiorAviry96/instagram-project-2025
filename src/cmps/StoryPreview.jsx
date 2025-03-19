/* eslint-disable react/prop-types */
import { Link } from "react-router";
import { useContext, useState } from "react";
import { Likes } from "./Likes";
import { Comments } from "./Comments";
import { PostContext } from "./contexts/PostContext";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
} from "date-fns";

import {
  updateStoryDetails,
  deleteStory,
} from "../store/actions/story.actions";
import { updateUser } from "../store/actions/user.actions";
import { userService } from "../services/users";
import { SvgIcon } from "./SvgIcon";
import { Modal } from "./Modal";
import { DeletePostModal } from "./DeletePostModal";

export function StoryPreview({ story }) {
  const [storyComments, setStoryComments] = useState(story.comments || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getImageSrc } = useContext(PostContext);
  const loggedInUser = userService.getLoggedinUser();
  const { imgUrl, comments, owner, createdAt, txt } = story;
  const updateComments = (updatedComments) => {
    const updatedStory = { ...story, comments: updatedComments };
    setStoryComments(updatedComments);
    updateStoryDetails(updatedStory, loggedInUser, "comment");
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
  function closeModal() {
    setIsModalOpen(false);
  }

  async function onRemoveStory() {
    try {
      if (!loggedInUser) return;
      console.log("id", story._id);

      await deleteStory(story._id);

      const updatedUser = { ...loggedInUser };

      updatedUser.images = updatedUser.images.filter(
        (img) => img.imgUrl !== story.imgUrl
      );

      updatedUser.savedStorys = updatedUser.savedStorys.filter(
        (saved) => saved.imgUrl !== story.imgUrl
      );

      await updateUser(updatedUser);

      console.log("Story removed successfully");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to remove story:", err);
    }
  }

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const timeAgo = formatTimeAgo(new Date(createdAt));
  return (
    <div className="border-items-feed">
      <div className="story-header">
        <Link className="owner-story" to={`/user/${owner._id}`}>
          <img src={getImageSrc(owner.imgUrl)} className="userProfileImg"></img>
          {owner?.fullname || "Anonymous"}
        </Link>
        <p className="timeAgo">• {timeAgo}</p>
        {loggedInUser && loggedInUser._id === owner._id && (
          <SvgIcon
            iconName="options"
            className="three-dots"
            onClick={toggleModal}
          />
        )}
      </div>
      {imgUrl ? (
        <img
          className="story-preview"
          src={getImageSrc({ imgUrl })}
          alt="Story Preview"
        />
      ) : (
        <p>No image available</p>
      )}

      <Likes
        initialLikes={story.likedBy?.length || 0}
        likedBy={story.likedBy || []}
        commentCount={comments?.length || 0}
        storyId={story._id}
      />

      <p className="description">
        <strong>{owner?.fullname}</strong> {txt}
      </p>
      <Comments
        comments={storyComments}
        storyId={story._id}
        updateStory={updateComments}
      />

      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <Modal show={isModalOpen}>
            <DeletePostModal
              onClose={closeModal}
              onRemoveStory={onRemoveStory}
            />
          </Modal>
        </div>
      )}
    </div>
  );
}
