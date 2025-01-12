/* eslint-disable react/prop-types */
import { Likes } from "./Likes";
import { Comments } from "./Comments";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";
import { useState } from "react";


export function PostPreview({ post }) {
  
  const [postComments, setPostComments] = useState(post.comments || []);
  const { imgUrl, comments, owner, createdAt,txt } = post

  const updateComments = (updatedComments) => {
    setPostComments(updatedComments);
  };

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  console.log('post', post)
  return (
    <div style={{ border: "1px solid #ddd", marginBottom: "20px", padding: "10px" }}>
       <div className="post-header">
        <Link className="ownerPost" to={`/user/${owner._id}`} >
        <img src={`src/assets/images/${owner.imgUrl}.jpeg`} className="userProfileImg" ></img>
         {owner?.fullname || "Anonymous"}
         </Link>
        <p className="timeAgo">{timeAgo}</p>
      </div>
      {imgUrl ? (
        <img src={`src/assets/images/${imgUrl}.jpeg`} style={{ width: "100%" }} alt="Post Preview" />
      ) : (
        <p>No image available</p>
      )}
      <p className="description">{txt}</p>

    <Likes
      initialLikes={post.likedBy?.length || 0}
      likedBy={post.likedBy || []}
      commentCount={comments?.length || 0}
      postId = {post._id}
    />      
      <Comments comments={postComments} postId={post._id} updatePost={updateComments} />
      </div>
  );
}
