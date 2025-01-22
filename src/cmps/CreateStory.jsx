/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ImgUploader } from "./ImgUploader";
import { updateUserImage } from "../store/actions/user.actions";
import { useState } from "react";
import { useNavigate } from 'react-router';
import { userService } from "../services/user.service";
import { createStory } from "../store/actions/story.actions";
import { useSelector } from "react-redux";

export function CreateStory({ onClose }) {
    const [newImgUrl, setNewImgUrl] = useState("");
    const [storyText, setStoryText] = useState(""); 
    const navigate = useNavigate();
    const user = useSelector((storeState) => storeState.userModule.user);
    console.log('user',user.imgUrl)


    async function onUpadteImages(ev = null) {
        if (ev) ev.preventDefault();
        if (!newImgUrl) return console.error('Invalid image URL');

        try {
            await updateUserImage(newImgUrl);

            const newStory = {
                txt: storyText,
                imgUrl: newImgUrl,
                owner: {
                    _id: userService.getLoggedinUser()._id,
                    fullname: userService.getLoggedinUser().fullname,
                    imgUrl: userService.getLoggedinUser().imgUrl,
                },
                comment: [],
                likedBy: [],
                createdAt: new Date().toISOString(),
            };

            await createStory(newStory);
            onClose();
            navigate('/');
        } catch (err) {
            console.error('Failed to update user image or create story:', err);
        }
    }

    function onUploaded(imgUrl) {
        setNewImgUrl(imgUrl);
    }

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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                    className="submit-modal-upload"
                    onClick={(e) => {
                        e.stopPropagation();
                       onUpadteImages()
                    }}
                >
                    Submit
                </button>
              
                <div className="modal-horizontal">
                    <div className="modal-image-container">
                        {newImgUrl ? (
                            <img src={newImgUrl} alt="Uploaded preview" className="modal-image" />
                        ) : (
                            <ImgUploader onUploaded={onUploaded} />
                        )}
                    </div>
                    <div className="modal-details">
                   { newImgUrl &&  <div className="username-modal">
                    <img
                            src={`src/assets/images/${user.imgUrl}.jpeg`}
                            alt="Story Image"
                            className="modal-userimg"
                        />
                               <p  className="modal-username"><strong>{user.fullname}</strong> </p> 
                            </div>
                            }
                        <textarea
                            value={storyText}
                            onChange={(ev) => setStoryText(ev.target.value)}
                            placeholder="Write something about your image..."
                            className="modal-textarea"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
