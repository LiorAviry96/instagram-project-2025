/* eslint-disable react/prop-types */
import { Likes } from "./Likes";
import { Comments } from "./Comments";
import { PostContext } from "./contexts/PostContext";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
} from "date-fns";
import { Link } from "react-router";
import { useContext, useState } from "react";
import { updateStoryDetails } from "../store/actions/story.actions";

export function StoryPreview({ story }) {
  const [storyComments, setStoryComments] = useState(story.comments || []);

  const { getImageSrc } = useContext(PostContext);

  const { imgUrl, comments, owner, createdAt, txt } = story;

  const updateComments = (updatedComments) => {
    setStoryComments(updatedComments);
    updateStoryDetails(updatedComments);
  };
  const formatTimeAgo = (date) => {
    const now = new Date();
    const seconds = differenceInSeconds(now, date);

    if (seconds < 60) return `${seconds}s`;
    const minutes = differenceInMinutes(now, date);
    if (minutes < 60) return `${minutes}m`;
    const hours = differenceInHours(now, date);
    if (hours < 24) return `${hours}h`;
    const days = differenceInDays(now, date);
    if (days < 7) return `${days}d`;
    const weeks = differenceInWeeks(now, date);
    return `${weeks}w`;
  };

  const timeAgo = formatTimeAgo(new Date(createdAt));
  return (
    <div className="border-items-feed">
      <div className="story-header">
        <Link className="owner-story" to={`/user/${owner._id}`}>
          <img src={getImageSrc(owner.imgUrl)} className="userProfileImg"></img>
          {owner?.fullname || "Anonymous"}
        </Link>
        <p className="timeAgo">• {timeAgo}</p>
      </div>
      {imgUrl ? (
        <img
          className="story-preview"
          src={getImageSrc({ imgUrl })}
          alt="Story Preview"
        />
      ) : (
        <p>No image available</p>
      )}

      <Likes
        initialLikes={story.likedBy?.length || 0}
        likedBy={story.likedBy || []}
        commentCount={comments?.length || 0}
        storyId={story._id}
      />

      <p className="description">
        <strong>{owner?.fullname}</strong> {txt}
      </p>
      <Comments
        comments={storyComments}
        storyId={story._id}
        updateStory={updateComments}
      />
    </div>
  );
}
