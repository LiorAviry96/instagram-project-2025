/* eslint-disable react/prop-types */

import { Likes } from "./Likes";
import { AddComment } from "./AddComment";
import { ViewComments } from "./ViewComments";
import { useContext } from "react";
import { PostContext } from "./contexts/PostContext";
import { CloseButtonSvg } from "./svg/closeButtonSvg";
import { Link } from "react-router";

export function ImageModal({
  isModalOpen,
  image,
  txt,
  story,
  updateComments,
  toggleModal,
}) {
  const { getImageSrc } = useContext(PostContext);

  return (
    <div className="modal-overlay" onClick={toggleModal}>
      <div
        className="close-modal"
        onClick={(e) => {
          e.stopPropagation();
          toggleModal();
        }}
      >
        <CloseButtonSvg
          onClick={(e) => {
            e.stopPropagation();
            toggleModal();
          }}
        />
      </div>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-horizontal">
          <div className="modal-image-container">
            <img
              src={getImageSrc(image)}
              alt="Story Image"
              className="modal-image"
            />
          </div>
          <div className="modal-details">
            <div className="modal-description">
              <Link to={`/user/${story.owner._id}`}>
                <img
                  src={getImageSrc(story.owner.imgUrl)}
                  alt="Story Image"
                  className="modal-userimg"
                ></img>
                <p className="modal-fullname">
                  <strong>{story.owner?.fullname}</strong>
                </p>
              </Link>

              <p>{txt}</p>
            </div>
            <div className="divider--modal"></div>

            <ViewComments comments={story.comments} />

            <div className="modal-actions">
              <div className="divider--modal"></div>
              <Likes
                initialLikes={story.likedBy.length}
                likedBy={story.likedBy}
                storyId={story._id}
              />
              <AddComment
                comments={story.comments}
                storyId={story._id}
                updateStory={updateComments}
                isModalOpen={isModalOpen}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
