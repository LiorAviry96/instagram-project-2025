/* eslint-disable react/prop-types */
import { Likes } from "./Likes";
import { Comments } from "./Comments";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";
import { useState } from "react";


export function StoryPreview({ story }) {
  
  const [storyComments, setStoryComments] = useState(story.comments || []);
  const { imgUrl, comments, owner, createdAt, txt } = story

  const updateComments = (updatedComments) => {
    console.log('update the comments')
    setStoryComments(updatedComments);
  };
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  const getImageSrc = (image) => 
    image.startsWith('http') ? image : `/src/assets/images/${image}.jpeg`;

  return (
    <div className="border-itmes-feed">
       <div className="post-header">
        <Link className="owner-post" to={`/user/${owner._id}`} >
        <img src={`src/assets/images/${owner.imgUrl}.jpeg`} className="userProfileImg" ></img>
         {owner?.fullname || "Anonymous"}
         </Link>
        <p className="timeAgo">{timeAgo}</p>
      </div>
      {imgUrl ? (
        <img className="story-preview" src={getImageSrc(imgUrl)} alt="Story Preview" />
      ) : (
        <p>No image available</p>
      )}
     

    <Likes
      initialLikes={story.likedBy?.length || 0}
      likedBy={story.likedBy || []}
      commentCount={comments?.length || 0}
      storyId = {story._id}
    />   
    
   <p className="description"><strong>{owner?.fullname}</strong> {txt}</p>   
      <Comments comments={storyComments} storyId={story._id} updateStory={updateComments} />
     
      </div>
  );
}
