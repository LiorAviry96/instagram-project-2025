/* eslint-disable react/prop-types */
import { useState } from "react";
import { userService } from "../services/user.service";
import { storyService } from "../services/story.service";
import EmojiPicker from "emoji-picker-react";

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
      <svg
        aria-label="Emoji"
        className="emoji-picker-btn"
        fill="currentColor"
        height="24"
        role="img"
        viewBox="0 0 24 24"
        width="24"
        onClick={() => setShowEmojiPicker((prev) => !prev)}
      >
        <title>Emoji</title>
        <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
      </svg>
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
