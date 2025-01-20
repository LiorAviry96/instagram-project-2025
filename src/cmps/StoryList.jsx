/* eslint-disable react/prop-types */
import { StoryPreview } from "./StoryPreview";

export function StoryList({ storys }) {
  
  return (
    <div>
      {storys.length > 0 ? (
        storys.map((story) => (
          <StoryPreview key={story._id} story={story} />
        ))
      ) : (
        <p>No storys to display</p>
      )}
    </div>
  );
}
