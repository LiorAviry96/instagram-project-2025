import { store } from "../store";
import { storyService } from "../../services/storys";
import {
  SET_STORY,
  SET_STORYS,
  ADD_STORY,
  UPDATE_STORY,
} from "../reducer/story.reducer";
import { showErrorMsg } from "../../services/event-bus.service";

export async function loadStorys() {
  try {
    const storys = await storyService.query();
    console.log(storys);
    store.dispatch(getCmdSetStorys(storys));
  } catch (err) {
    console.log("Cannot load storys", err);
    throw err;
  }
}

export async function loadStory(storyId) {
  try {
    const story = await storyService.getById(storyId);
    store.dispatch(getCmdSetStory(story));
  } catch (err) {
    console.log("Cannot load story", err);
    throw err;
  }
}
export async function updateStoryDetails(updatedStory) {
  try {
    const savedStory = await storyService.save(updatedStory);
    console.log("savedStory", savedStory);
    store.dispatch({
      type: UPDATE_STORY,
      story: savedStory,
    });

    console.log("Story updated successfully:", savedStory);
  } catch (err) {
    console.error("Error updating story:", err);
    throw err;
  }
}

export async function createStory(newStory) {
  try {
    console.log("newStory actions page", newStory);
    const savedStory = await storyService.save(newStory);

    store.dispatch({
      type: ADD_STORY,
      story: savedStory,
    });

    console.log("Story created successfully:", savedStory);
    return savedStory;
  } catch (err) {
    console.error("Error creating story:", err);
    showErrorMsg("Failed to create story");
    throw err;
  }
}

function getCmdSetStorys(storys) {
  return {
    type: SET_STORYS,
    storys,
  };
}
function getCmdSetStory(story) {
  return {
    type: SET_STORY,
    story,
  };
}
