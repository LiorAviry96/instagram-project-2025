/* eslint-disable react/prop-types */
import { useState } from "react";
import { userService } from "../services/user.service";
import { storyService } from "../services/story.service";
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
        },
      ];

      const updatedStory = {
        ...fullStory,
        comments: updatedComments,
      };

      await storyService.save(updatedStory);

      updateStory(updatedComments);

      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false); // Close the emoji picker after selecting an emoji
  };

  return (
    <div className="add-comment">
      <SvgIcon
        iconName="emojiBig"
        onClick={() => setShowEmojiPicker((prev) => !prev)}
      />
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
