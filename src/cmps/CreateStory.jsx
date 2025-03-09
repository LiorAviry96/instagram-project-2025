/* eslint-disable react/prop-types */
import { ImgUploader } from "./ImgUploader";
import { updateUserImage } from "../store/actions/user.actions";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { userService } from "../services/users";
import { createStory } from "../store/actions/story.actions";
import { useSelector } from "react-redux";
import { PostContext } from "./contexts/PostContext";
import EmojiPicker from "emoji-picker-react";

export function CreateStory({ onClose }) {
  const navigate = useNavigate();
  const [newImgUrl, setNewImgUrl] = useState("");
  const [storyText, setStoryText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { getImageSrc } = useContext(PostContext);
  const user = useSelector((storeState) => storeState.userModule.user);

  async function onUpdateImages(ev = null) {
    if (ev) ev.preventDefault();
    if (!newImgUrl) return console.error("Invalid image URL");

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
        comments: [],
        likedBy: [],
        createdAt: new Date().toISOString(),
      };

      await createStory(newStory);
      onClose();
      navigate("/home");
    } catch (err) {
      console.error("Failed to update user image or create story:", err);
    }
  }
  const handleEmojiClick = (emojiObject) => {
    setStoryText((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false); // Close the emoji picker after selecting an emoji
  };

  function onUploaded(imgUrl) {
    setNewImgUrl(imgUrl);
  }

  return (
    <div className="modal-content create" onClick={(e) => e.stopPropagation()}>
      <div className="modal-grid">
        <h2>Create new post</h2>
        {newImgUrl && (
          <button
            className="submit-modal-upload"
            onClick={(e) => {
              e.stopPropagation();
              onUpdateImages();
            }}
          >
            Share
          </button>
        )}

        {newImgUrl ? (
          <>
            <div className="modal-image-container create">
              <img
                src={newImgUrl}
                alt="Uploaded preview"
                className="modal-image-upload"
              />
            </div>
            <div className="modal-details-create">
              <div className="modal-description-create">
                <img
                  src={getImageSrc(user.imgUrl)}
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
              <div className="emoji-container">
                <svg
                  aria-label="Emoji"
                  className="emoji-picker-btn"
                  fill="currentColor"
                  height="24"
                  role="img"
                  viewBox="0 0 24 24"
                  width="24"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  <title>Emoji</title>
                  <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                </svg>
              </div>
              {showEmojiPicker && (
                <div className="emoji-picker">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <div className="divider--modal"></div>
            </div>
          </>
        ) : (
          <div className="modal-upload-container">
            <ImgUploader onUploaded={onUploaded} />
          </div>
        )}
      </div>
    </div>
  );
}
