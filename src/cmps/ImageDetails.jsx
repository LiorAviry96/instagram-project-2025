/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ImageModal } from "./ImageModal";
import { PostContext } from "./contexts/PostContext";
import { SvgIcon } from "./SvgIcon";

export function ImageDetails({ image }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storys = useSelector((state) => state.storyModule.storys);
  const story = storys.find((story) => story.imgUrl === image.imgUrl);
  const [storyComments, setStoryComments] = useState(story?.comments || []);
  const { getImageSrc } = useContext(PostContext);

  useEffect(() => {
    console.log("ImageDetails props:", image);
  }, [image]);

  console.log("storys", storys);
  console.log("story", story);

  if (!story) {
    return <div>Story not found for this image.</div>;
  }

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const updateComments = (updatedComments) => {
    setStoryComments(updatedComments);
  };

  return (
    <div
      className="gallery-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: "relative" }}
    >
      <img
        src={getImageSrc(image)}
        className="story-details"
        alt="User story"
      />
      {isHovered && (
        <div className="overlay" onClick={toggleModal}>
          <div className="info-container">
            <div className="info">
              <SvgIcon iconName="heart" /> {story.likedBy.length}
            </div>
            <div className="info">
              <SvgIcon iconName="comment" /> {story.comments.length}
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ImageModal
              isModalOpen={isModalOpen}
              txt={story.txt}
              story={story}
              image={image}
              toggleModal={toggleModal}
              updateComments={updateComments}
            />
          </div>
        </div>
      )}
    </div>
  );
}
