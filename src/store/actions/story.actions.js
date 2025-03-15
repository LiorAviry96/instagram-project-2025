import { store } from "../store";
import { storyService } from "../../services/storys";
import {
  SET_STORY,
  SET_STORYS,
  ADD_STORY,
  UPDATE_STORY,
} from "../reducer/story.reducer";
import {
  socketService,
  SOCKET_EMIT_USER_LIKED,
} from "../../services/socket.service";
import { userService } from "../../services/users";

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
export async function updateStoryDetails(
  updatedStory,
  loggedInUser,
  typeChange
) {
  try {
    console.log("Updating Story:", updatedStory); // Debugging log
    console.log("loggedInUser test test", loggedInUser);
    const savedStory = await storyService.save(updatedStory);
    console.log("savedStory", savedStory);
    store.dispatch({
      type: UPDATE_STORY,
      story: savedStory,
    });

    const notification = {
      type: typeChange,
      fromUser: {
        userId: loggedInUser._id,
        fullname: loggedInUser.fullname,
        imgUrl: loggedInUser.imgUrl,
      },
      timestamp: new Date().toISOString(),
    };

    const targetUser = await userService.getById(updatedStory.owner._id);

    if (!Array.isArray(targetUser.notifications)) targetUser.notifications = [];
    targetUser.notifications.push(notification);
    await userService.update(targetUser);

    console.log(
      `User ${typeChange} Notification updated successfully:`,
      targetUser
    );
    socketService.emit(SOCKET_EMIT_USER_LIKED, {
      loggedInUser: loggedInUser,
      targetUserId: targetUser._id,
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
