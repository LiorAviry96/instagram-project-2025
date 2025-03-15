/* eslint-disable react/prop-types */
import { useState } from "react";
import { userService } from "../services/users";
import { storyService } from "../services/storys";
import EmojiPicker from "emoji-picker-react";
import { SvgIcon } from "./SvgIcon";

export function AddComment({ storyId, updateStory }) {
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  const handleAddComment = async () => {
    const loggedInUser = userService.getLoggedinUser();

    if (!loggedInUser) {
      alert("Please log in to comment on storys");
      return;
    }

    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const fullStory = await storyService.getById(storyId);

      const updatedComments = [
        ...fullStory.comments,
        {
          id: Date.now(),
          by: loggedInUser,
          txt: newComment,
          createdAt: new Date().toISOString(),
        },
      ];

      const updatedStory = {
        ...fullStory,
        comments: updatedComments,
      };
      //console.log("updatedStory", updatedStory);

      await storyService.save(updatedStory);
      setNewComment("");
      //console.log("updatedComments", updatedComments);
      updateStory(updatedComments, loggedInUser, "comment");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };
  const handleEmojiButtonClick = (e) => {
    setShowEmojiPicker((prev) => !prev);

    if (!showEmojiPicker) {
      const buttonRect = e.currentTarget.getBoundingClientRect();
      const topPosition = buttonRect.top + window.scrollY - 250;

      document.documentElement.style.setProperty(
        "--emoji-picker-top",
        `${topPosition}px`
      );
      document.documentElement.style.setProperty(
        "--emoji-picker-left",
        `${buttonRect.left}px`
      );
    }
  };

  return (
    <div className="add-comment">
      <SvgIcon iconName="emojiBig" onClick={handleEmojiButtonClick} />
      {showEmojiPicker && (
        <div className="emoji-picker">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <input
        type="text"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        onKeyDown={handleKeyDown}
        className="comment-input-modal"
      />
      {newComment && (
        <button onClick={handleAddComment} className="comment-submit-btn">
          Post
        </button>
      )}
    </div>
  );
}
