/* eslint-disable react/prop-types */
import { StoryPreview } from "./StoryPreview";

export function StoryList({ storys }) {
  return (
    <div className="feed-list">
      {storys.length > 0 ? (
        storys
          .slice()
          .reverse()
          .map((story) => <StoryPreview key={story._id} story={story} />)
      ) : (
        <p>No storys to display</p>
      )}
    </div>
  );
}
