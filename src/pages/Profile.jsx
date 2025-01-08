import { useEffect } from "react";
import { useParams } from 'react-router-dom'
import { useSelector } from "react-redux";
import { loadUser } from "../store/actions/user.actions";
import { Image } from "../cmps/Image";

export function Profile() {
    //const dispatch = useDispatch();
    const watchedUser = useSelector((state) => state.userModule.watchedUser);
    const { userId } = useParams()
    useEffect(() => {
        loadUser(userId); // Load profile data when component mounts
    }, [userId]);

    
    if (!watchedUser) return <div>Loading...</div>;
    console.log('watchedUser',watchedUser)
    console.log('watchedUser.imgUrl',watchedUser.imgUrl)

    return (
        <div className="profile-page">
            <header className="profile-header">
                <img
                    className="profile-img"
                    src={`/src/assets/images/${watchedUser.imgUrl}.jpeg`}
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
                        <Image imgUrl={imgUrl[idx]} alt={`User post ${idx + 1}`}/>
                    </div>
                ))}
            </section>
        </div>
    );
}

