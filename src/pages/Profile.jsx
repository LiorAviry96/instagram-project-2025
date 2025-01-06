import { useEffect } from "react";
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "../store/actions/user.actions";

export function Profile() {
    const dispatch = useDispatch();
    const watchedUser = useSelector((state) => state.userModule.watchedUser);
    const { userId } = useParams()
    useEffect(() => {
        loadUser(userId); // Load profile data when component mounts
    }, [userId]);

    if (!watchedUser) return <div>Loading...</div>;

    return (
        <div className="profile-page">
            <header className="profile-header">
                <img
                    className="profile-img"
                    src={watchedUser.imgUrl}
                    alt={`${watchedUser.fullname}'s profile`}
                />
                <div className="profile-info">
                    <h2 className="username">{watchedUser.username}</h2>
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
                    <p className="fullname">{watchedUser.fullname}</p>
                </div>
            </header>
            <section className="profile-gallery">
                {watchedUser.images?.map((imgUrl, idx) => (
                    <div key={idx} className="gallery-item">
                        <img src={imgUrl} alt={`User post ${idx + 1}`} />
                    </div>
                ))}
            </section>
        </div>
    );
}
