/* eslint-disable react/prop-types */
import { Likes } from "./Likes";
import { Comments } from "./Comments";
import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks } from "date-fns";
import { Link } from "react-router";
import { useState } from "react";


export function StoryPreview({ story }) {
  
  const [storyComments, setStoryComments] = useState(story.comments || []);
  const { imgUrl, comments, owner, createdAt, txt } = story

  const updateComments = (updatedComments) => {
    setStoryComments(updatedComments);
  };
  const formatTimeAgo = (date) => {
    const now = new Date();
    const seconds = differenceInSeconds(now, date);

    if (seconds < 60) return `${seconds}s`; // Less than a minute
    const minutes = differenceInMinutes(now, date);
    if (minutes < 60) return `${minutes}m`; // Less than an hour
    const hours = differenceInHours(now, date);
    if (hours < 24) return `${hours}h`; // Less than a day
    const days = differenceInDays(now, date);
    if (days < 7) return `${days}d`; // Less than a week
    const weeks = differenceInWeeks(now, date);
    return `${weeks}w`; // More than a week
  };

  const timeAgo = formatTimeAgo(new Date(createdAt));
  const getImageSrc = (image) => 
    image.startsWith('http') ? image : `/src/assets/images/${image}.jpeg`;

  return (
    <div className="border-items-feed">
       <div className="story-header">
        <Link className="owner-story" to={`/user/${owner._id}`} >
        <img src={`src/assets/images/${owner.imgUrl}.jpeg`} className="userProfileImg" ></img>
         {owner?.fullname || "Anonymous"}
         </Link>
        <p className="timeAgo">• {timeAgo}</p>
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
   <Comments
        comments={storyComments}
        storyId={story._id}
        updateStory={updateComments}
      />     
      </div>
  );
}
