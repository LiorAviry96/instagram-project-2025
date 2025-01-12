/* eslint-disable react/prop-types */
import { useState } from "react";
//import { Likes } from "./Likes";
//import { Comments } from "./Comments";

export function ImageDetails({ image }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="gallery-item">
      <img src={image} alt="User post" onClick={toggleModal} style={{ cursor: "pointer" }} />
      
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={toggleModal}>X</button>
            <img
              src={image}
              alt="Post Image"
              style={{ width: "100%" }}
            />
            <div className="modal-body">
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
