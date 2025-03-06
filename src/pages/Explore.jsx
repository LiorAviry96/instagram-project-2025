import { useSelector } from "react-redux";
import { ImageDetails } from "../cmps/ImageDetails";
import { loadStorys } from "../store/actions/story.actions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export function Explore() {
  const dispatch = useDispatch();

  const storys = useSelector((storeState) => storeState.storyModule.storys);
  console.log("storys", storys);

  useEffect(() => {
    loadStorys();
  }, [dispatch]);

  return (
    <div className="profile-page">
      <section className="profile-gallery">
        {storys.map((imgUrl, idx) => (
          <div key={idx} className="gallery-item">
            <ImageDetails image={imgUrl} alt={`User story ${idx + 1}`} />
          </div>
        ))}
      </section>
    </div>
  );
}
