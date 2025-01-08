/* eslint-disable react/prop-types */
import { Likes } from "./Likes";
import { Comments } from "./Comments";

export function PostPreview({ post }) {
  console.log(post)
 
  const { imgUrl, comments, owner } = post
  console.log('imageUrl',imgUrl)
  console.log('comments',comments)

  return (
    <div style={{ border: "1px solid #ddd", marginBottom: "20px", padding: "10px" }}>
      <h3 className="ownerPost">{owner?.fullname || "Anonymous"}</h3>
      {imgUrl ? (
        <img src={`../assets/images/${imgUrl}.jpeg`} style={{ width: "100%" }} alt="Post Preview" />
      ) : (
        <p>No image available</p>
      )}
      <Likes initialLikes={post.likedBy?.length || 0} />
      <Comments comments={comments} />
    </div>
  );
}
