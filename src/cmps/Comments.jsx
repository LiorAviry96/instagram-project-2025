/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { AddComment } from "./AddComment";

export function Comments({ comments, storyId, updateStory, isModalOpen }) {

  useEffect(() => {
    
  }, [comments.length]);
  console.log('isModalOpen',isModalOpen)
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

    {!isModalOpen && (
      <AddComment storyId={storyId} updateStory={updateStory} />
    )}
      
    </div>
  );
}