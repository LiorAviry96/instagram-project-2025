/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Likes } from "./Likes";
import { Comments } from "./Comments";

export function ImageDetails({ image }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const posts = useSelector((state) => state.postModule.posts);
  const post = posts.find((post) => post.imgUrl === image.imgUrl);
  const [postComments, setPostComments] = useState(post.comments || []);

  const dispatch = useDispatch();


  const toggleModal = () => setIsModalOpen(!isModalOpen);
 

  const getImageSrc = (image) => 
   image.startsWith('http') ? image : `/src/assets/images/${image}.jpeg`;

  const updateComments = (updatedComments) => {
    setPostComments(updatedComments);
  };

    if (!post) return null;
    return (
      <div className="gallery-item">
        <img
          src={getImageSrc(image.imgUrl)}
          alt="User post"
          onClick={toggleModal}
          style={{ cursor: "pointer" }}
        />
  
        {isModalOpen && (
          <div className="modal-overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={toggleModal}>
                X
              </button>
              <img
                src={getImageSrc(image.imgUrl)}
                alt="Post Image"
                style={{ width: "100%" }}
              />
              <div className="modal-body">
                <Likes
                  initialLikes={post.likedBy.length}
                  likedBy={post.likedBy}
                  postId={post._id}
                />
                <Comments
                  comments={post.comments}
                  postId={post._id}
                  updatePost={updateComments}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
