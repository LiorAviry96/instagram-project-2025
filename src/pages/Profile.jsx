import { useEffect } from "react";
import { useParams } from 'react-router-dom'
import { useSelector } from "react-redux";
import { loadUser, unfollowUser, followUser } from "../store/actions/user.actions";
import { ImageDetails } from "../cmps/ImageDetails";
export function Profile() {
    //const dispatch = useDispatch();
    const watchedUser = useSelector((state) => state.userModule.watchedUser);
    const loggedInUser = useSelector((state) => state.userModule.user); 

    const { userId } = useParams()
    useEffect(() => {
        loadUser(userId); // Load profile data when component mounts
    }, [userId]);

  
    const isFollowing = loggedInUser?.following?.includes(watchedUser?._id);
    const handleFollowToggle = () => {
        if (isFollowing) {
            unfollowUser(watchedUser._id);
        } else {
            followUser(watchedUser._id);
        }
    };
    if (!watchedUser) return <div>Loading...</div>;
    return (
        <div className="profile-page">
            <header className="profile-header">
                <img
                    className="profile-img"
                    src={`/src/assets/images/${watchedUser.imgUrl}.jpeg`}
                />
                <div className="profile-info">
                    <div className="username-section">
                        <h2 className="username">{watchedUser.username}</h2>
                        <div className="action-buttons">
                            <button
                                className={`follow-btn ${isFollowing ? "active" : ""}`}
                                onClick={handleFollowToggle}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                            <button className="message-btn">Message</button>
                        </div>

                    </div>
                    <p className="fullname">{watchedUser.fullname}</p>

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
                </div>
            </header>
            <section className="profile-gallery">
                {watchedUser.images?.map((imgUrl, idx) => (
                    <div key={idx} className="gallery-item">
                        <ImageDetails image={imgUrl} alt={`User post ${idx + 1}`} />
                    </div>
                ))}
            </section>
        </div>
    );
}

