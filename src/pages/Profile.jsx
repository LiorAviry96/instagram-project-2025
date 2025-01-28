import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loadUser,
  unfollowUser,
  followUser,
} from "../store/actions/user.actions";
import { ImageDetails } from "../cmps/ImageDetails";
import { PostContext } from "../cmps/contexts/PostContext";
import { SavedStorysSvg } from "../cmps/svg/SavedStorysSvg";
import { PostsSvg } from "../cmps/svg/PostsSvg";

export function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const watchedUser = useSelector((state) => state.userModule.watchedUser);
  const loggedInUser = useSelector((state) => state.userModule.user);
  const isFollowing = loggedInUser?.following?.some(
    (follow) => follow._id === watchedUser?._id
  );

  const { getImageSrc } = useContext(PostContext);
  const dispatch = useDispatch();

  const { userId } = useParams();
  console.log("watchedUser", watchedUser);
  console.log("loggedInUser", loggedInUser);

  useEffect(() => {
    if (!watchedUser || watchedUser._id !== userId) {
      console.log("use effect user");
      loadUser(userId);
    }
  }, [userId, watchedUser, dispatch]);

  const isOwnProfile = loggedInUser?._id === watchedUser?._id;

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(watchedUser._id);
    } else {
      followUser(watchedUser._id);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  console.log("activeTab", activeTab);
  if (!watchedUser) return <div>Loading...</div>;
  return (
    <div className="profile-page">
      <header className="profile-header">
        <img className="profile-img" src={getImageSrc(watchedUser.imgUrl)} />
        <div className="profile-info">
          <div className="username-section">
            <h3 className="fullname">{watchedUser.username}</h3>

            {!isOwnProfile && (
              <div className="action-buttons">
                <button
                  className={`follow-btn ${isFollowing ? "active" : ""}`}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button className="message-btn">Message</button>
              </div>
            )}
          </div>

          <div className="stats">
            <span>
              <strong>{watchedUser.images?.length || 0}</strong> posts
            </span>
            <span>
              <strong>{watchedUser.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{watchedUser.following?.length || 0}</strong> following
            </span>
          </div>
          <p className="username">{watchedUser.fullname}</p>
        </div>
      </header>
      <div className="divider"></div>
      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => handleTabClick("posts")}
        >
          <PostsSvg className="icon-profile" ariaLabel="Post Icon" />
          POSTS
        </button>
        {isOwnProfile && (
          <button
            className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => handleTabClick("saved")}
          >
            <SavedStorysSvg className="icon-profile" ariaLabel="Saved Story" />
            SAVED
          </button>
        )}
      </div>
      <section className="profile-gallery">
        {activeTab === "posts"
          ? watchedUser.images?.map((imgUrl, idx) => (
              <div key={idx} className="gallery-item">
                <ImageDetails image={imgUrl} alt={`User story ${idx + 1}`} />
              </div>
            ))
          : watchedUser.savedStorys?.map((imgUrl, idx) => (
              <div key={idx} className="gallery-item">
                <ImageDetails image={imgUrl} alt={`Saved story ${idx + 1}`} />
              </div>
            ))}
      </section>
    </div>
  );
}
