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

  const getImageSrc = (image) => 
    image.startsWith('http') ? image : `/src/assets/images/${image}.jpeg`;

  return (
    <div className="border-itmes-feed">
       <div className="post-header">
        <Link className="ownerPost" to={`/user/${owner._id}`} >
        <img src={`src/assets/images/${owner.imgUrl}.jpeg`} className="userProfileImg" ></img>
         {owner?.fullname || "Anonymous"}
         </Link>
        <p className="timeAgo">{timeAgo}</p>
      </div>
      {imgUrl ? (
        <img src={getImageSrc(imgUrl)} style={{ width: "100%" }} alt="Post Preview" />
      ) : (
        <p>No image available</p>
      )}
     

    <Likes
      initialLikes={post.likedBy?.length || 0}
      likedBy={post.likedBy || []}
      commentCount={comments?.length || 0}
      postId = {post._id}
    />   
     <p className="description">{txt}</p>   
      <Comments comments={postComments} postId={post._id} updatePost={updateComments} />
      </div>
  );
}
