/* eslint-disable react/prop-types */
import { useState } from "react";
import { AddComment } from "./AddComment";
import { ImageModal } from "./ImageModal";
import { updateStoryDetails } from "../store/actions/story.actions";
import { useSelector } from "react-redux";

export function Comments({ comments, storyId, updateStory }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const story = useSelector((state) =>
    state.storyModule.storys.find((story) => story._id === storyId)
  );
  //const dispatch = useDispatch();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div>
      {isModalOpen ? (
        <ImageModal
          isModalOpen={isModalOpen}
          image={{ imgUrl: story?.imgUrl }}
          txt={story?.txt}
          story={story}
          updateComments={(updatedComments) => {
            const updatedStory = { ...story, comments: updatedComments };
            updateStoryDetails(updatedStory);
          }}
          toggleModal={toggleModal}
        />
      ) : (
        <div>
          {comments.length > 0 && (
            <button className="show-comments-btn" onClick={toggleModal}>
              View All {comments.length} Comments
            </button>
          )}
          <AddComment storyId={storyId} updateStory={updateStory} />
        </div>
      )}
    </div>
  );
}
