/* eslint-disable react/prop-types */
import { Likes } from "./Likes";
import { Comments } from "./Comments";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";

export function PostPreview({ post }) {
  
  const { imgUrl, comments, owner, createdAt, } = post


  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div style={{ border: "1px solid #ddd", marginBottom: "20px", padding: "10px" }}>
       <div className="post-header">
        <Link className="ownerPost" to={`/user/${owner._id}`}>
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
    <Likes
      initialLikes={post.likedBy?.length || 0}
      likedBy={post.likedBy || []}
      commentCount={comments?.length || 0}
    />      
    <Comments comments={comments} />
    </div>
  );
}
