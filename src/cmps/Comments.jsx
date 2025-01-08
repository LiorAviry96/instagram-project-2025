/* eslint-disable react/prop-types */
export function Comments({ comments }) {
    return (
      <div>
        <h4>Comments:</h4>
        {comments && comments.length > 0 ? (
          <ul>
            {comments.map((comment, index) => (
              <li key={comment.id || index}>
                <strong>{comment.by.fullname || "User"}:</strong> {comment.txt || "No comment text"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    );
  }
  