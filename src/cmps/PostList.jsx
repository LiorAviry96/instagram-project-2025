/* eslint-disable react/prop-types */
import { PostPreview } from "./PostPreview";

export function PostList({ posts }) {
  
  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostPreview key={post._id} post={post} />
        ))
      ) : (
        <p>No posts to display</p>
      )}
    </div>
  );
}
