/* eslint-disable react/prop-types */
import { useState } from "react";

export function PostPreview({ post }) {
  const [likes, setLikes] = useState(post.likes || 0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <div style={{ border: "1px solid #ddd", marginBottom: "20px", padding: "10px" }}>
      <h3>{post.username || "Anonymous"}</h3>
      {post.imageUrl ? (
        <img src={post.imageUrl} alt={post.caption || "Post Image"} style={{ width: "100%" }} />
      ) : (
        <p>No image available</p>
      )}
      <p>{post.caption || "No caption provided"}</p>
      <button onClick={handleLike}>❤️ {likes} Likes</button>
      <div>
        <h4>Comments:</h4>
        <ul>
          {post.comments?.map((comment, index) => (
            <li key={comment.id || index}>
              <strong>{comment.username || "User"}:</strong> {comment.text || "No comment text"}
            </li>
          )) || <p>No comments yet</p>}
        </ul>
      </div>
    </div>
  );
}
