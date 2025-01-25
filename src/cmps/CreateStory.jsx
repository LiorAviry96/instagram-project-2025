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


    async function onUpdateImages(ev = null) {
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
            navigate('/home');
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
            {newImgUrl && <button
                    className="submit-modal-upload"
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpdateImages();
                    }}
                >
                    Submit
                </button>
                }
                <div className="modal-horizontal">
                    {newImgUrl ? (
                        <>
                            <div className="modal-image-container">
                                <img src={newImgUrl} alt="Uploaded preview" className="modal-image-upload" />
                            </div>
                            <div className="modal-details">
                                    <div className="modal-description">
                                        <img
                                            src={`/src/assets/images/${user.imgUrl}.jpeg`}
                                            alt="Story Image"
                                            className="modal-userimg"
                                        />
                                        <p className="modal-username">
                                            <strong>{user.fullname}</strong>
                                        </p>
                                </div>
                                        <textarea
                                            value={storyText}
                                            onChange={(ev) => setStoryText(ev.target.value)}
                                            placeholder="Write something about your image..."
                                            className="modal-textarea"
                                        />
                                   
                                
                            </div>
                        </>
                    ) : (
                        <div>
                        <h2 htmlFor="label">Create New Post</h2>

                        <ImgUploader onUploaded={onUploaded} />
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}
