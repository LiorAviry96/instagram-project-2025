/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Likes } from "./Likes";
import { Comments } from "./Comments";
import { ImageModal } from "./ImageModal";
import { PostContext } from "./contexts/PostContext";

export function ImageDetails({ image }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storys = useSelector((state) => state.storyModule.storys);
  const story = storys.find((story) => story.imgUrl === image.imgUrl);
  const [storyComments, setStoryComments] = useState(story?.comments || []);
  const { getImageSrc } = useContext(PostContext);

  const dispatch = useDispatch();

  if (!story) {
    return <div>Story not found for this image.</div>;
  }

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const updateComments = (updatedComments) => {
    setStoryComments(updatedComments);
  };

  return (
    <div className="gallery-item">
      <img
        src={getImageSrc(image)}
        alt="User story"
        onClick={toggleModal}
        style={{ cursor: "pointer" }}
      />

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
