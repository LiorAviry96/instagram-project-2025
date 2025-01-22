/* eslint-disable react/prop-types */
import { useState } from "react";
import { userService } from "../services/user.service";
import { storyService } from "../services/story.service";

export function Comments({ comments, storyId, updateStory }) {
  const [newComment, setNewComment] = useState("");

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

  return (
    <div className="comments-container">
      {comments && comments.length > 0 ? (
        <ul>
          {comments.map((comment, index) => (
            <li className="comment" key={comment.id || index}>
              <strong>{comment.by.fullname || "User"}</strong>
              <span>{comment.txt || "No comment text"}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}

      <div className="add-comment">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          className="comment-input"
        />
        {/* <button onClick={handleAddComment} className="comment-submit-btn">
          Post
        </button>*/} 
      </div>
    </div>
  );
}
