/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Likes } from "./Likes";
import { Comments } from "./Comments";
import { ImageModal } from "./ImageModal";

export function ImageDetails({ image }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const storys = useSelector((state) => state.storyModule.storys);
  const story = storys.find((story) => story.imgUrl === image.imgUrl);
  const [storyComments, setStoryComments] = useState(story?.comments || []);
  const dispatch = useDispatch();



  if (!story) {
    return <div>Story not found for this image.</div>; // Provide meaningful fallback UI
  }


  const toggleModal = () => setIsModalOpen(!isModalOpen);
  
  const getImageSrc = (image) => 
   image.startsWith('http') ? image : `/src/assets/images/${image}.jpeg`;

  const updateComments = (updatedComments) => {
    setStoryComments(updatedComments);
  };

    return (
      <div className="gallery-item">
        <img
          src={getImageSrc(image.imgUrl)}
          alt="User story"
          onClick={toggleModal}
          style={{ cursor: "pointer" }}
        />
  
        {isModalOpen && (
          <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>  
           <ImageModal txt={story.txt} story={story} image={image} toggleModal={toggleModal} updateComments={updateComments} /> 
      </div>
      </div>
        )}
      </div>
    );
}
