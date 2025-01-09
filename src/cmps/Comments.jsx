/* eslint-disable react/prop-types */
export function Comments({ comments }) {
    return (
      <div>
        {comments && comments.length > 0 ? (
          <ul>
            {comments.map((comment, index) => (
              <li className="comment" key={comment.id || index}>
                <strong>{comment.by.fullname || "User"}</strong><span>{comment.txt || "No comment text"}</span> 
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    );
  }
  