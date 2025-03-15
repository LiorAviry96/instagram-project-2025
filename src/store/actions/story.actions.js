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
  SOCKET_EMIT_USER_COMMENT,
} from "../../services/socket.service";
import { userService } from "../../services/users";

export async function loadStorys() {
  try {
    const storys = await storyService.query();
    store.dispatch(getCmdSetStorys(storys));
    console.log("Load storys successfully", storys);
  } catch (err) {
    console.log("Cannot load storys", err);
    throw err;
  }
}

export async function loadStory(storyId) {
  try {
    const story = await storyService.getById(storyId);
    store.dispatch(getCmdSetStory(story));
    console.log("Load story successfully", story);
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
    const savedStory = await storyService.save(updatedStory);

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

    socketService.emit(SOCKET_EMIT_USER_LIKED, {
      loggedInUser: loggedInUser,
      targetUserId: targetUser._id,
    });
    socketService.emit(SOCKET_EMIT_USER_COMMENT, {
      loggedInUser: loggedInUser,
      targetUserId: targetUser._id,
    });
    console.log(
      `User ${typeChange} Notification updated successfully:`,
      targetUser
    );
    console.log("Story updated successfully:", savedStory);
  } catch (err) {
    console.error("Error updating story:", err);
    throw err;
  }
}

export async function createStory(newStory) {
  try {
    const savedStory = await storyService.save(newStory);

    store.dispatch({
      type: ADD_STORY,
      story: savedStory,
    });
    console.log("Create story successfully", savedStory);

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
