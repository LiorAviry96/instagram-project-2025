/* eslint-disable react/prop-types */

import { Likes } from "./Likes";
import { Comments } from "./Comments";

export function ImageModal({ image, txt, story, updateComments, toggleModal }) {
    const getImageSrc = (image) => {
        if (!image || !image.imgUrl) {
            console.error("Image source is not available");
            return "";
        }
        return image.imgUrl.startsWith("http") 
            ? image.imgUrl 
            : `/src/assets/images/${image.imgUrl}.jpeg`;
    };

    return (
        <div className="modal-overlay" onClick={toggleModal}>
            <button className="close-modal" onClick={(e) => {
                e.stopPropagation();
                toggleModal();
            }}>
                X
            </button>
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
                        <img
                            src={`src/assets/images/${story.owner.imgUrl}.jpeg`}
                            alt="Story Image"
                            className="modal-userimg"
                        />
                            <p className="modal-fullname">
                                <strong>{story.owner?.fullname}</strong> 
                            </p>
                            <p>
                            {txt}
                            </p>
                        </div>
                        <div className="modal-actions">
                            <div className="divider--modal"></div>
                            <Likes
                                initialLikes={story.likedBy.length}
                                likedBy={story.likedBy}
                                storyId={story._id}
                            />
                            <Comments
                                comments={story.comments}
                                storyId={story._id}
                                updateStory={updateComments}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
