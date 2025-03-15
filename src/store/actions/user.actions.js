import { userService } from "../../services/users";
import { socketService } from "../../services/socket.service";
import { store } from "../store";

import { LOADING_DONE, LOADING_START } from "../reducer/system.reducer";
import {
  REMOVE_USER,
  SET_USER,
  SET_USERS,
  SET_WATCHED_USER,
} from "../reducer/user.reducer";
import { SOCKET_EMIT_USER_FOLLOWED } from "../../services/socket.service";
export async function loadUsers() {
  try {
    store.dispatch({ type: LOADING_START });
    const users = await userService.getUsers();
    store.dispatch({ type: SET_USERS, users });
    console.log("Load users successfully:", users);
  } catch (err) {
    console.log("UserActions: err in loadUsers", err);
  } finally {
    store.dispatch({ type: LOADING_DONE });
  }
}

export async function removeUser(userId) {
  try {
    await userService.remove(userId);
    store.dispatch({ type: REMOVE_USER, userId });
    console.log("Remove user successfully");
  } catch (err) {
    console.log("UserActions: err in removeUser", err);
  }
}

export async function login(credentials) {
  try {
    const user = await userService.login(credentials);
    store.dispatch({
      type: SET_USER,
      user,
    });
    socketService.login(user._id);
    console.log("Login successfully");
    return user;
  } catch (err) {
    console.log("Cannot login", err);
    throw err;
  }
}

export async function signup(credentials) {
  try {
    const user = await userService.signup(credentials);
    store.dispatch({
      type: SET_USER,
      user,
    });
    socketService.login(user._id);
    console.log("Signup successfully");
    return user;
  } catch (err) {
    console.log("Cannot signup", err);
    throw err;
  }
}

export async function logout() {
  try {
    await userService.logout();
    store.dispatch({
      type: SET_USER,
      user: null,
    });
    socketService.logout();
    console.log("Logout Successful");
  } catch (err) {
    console.log("Cannot logout", err);
    throw err;
  }
}

export async function loadUser(userId) {
  try {
    const loggedInUser = userService.getLoggedinUser();
    if (loggedInUser && loggedInUser._id === userId) {
      store.dispatch({ type: SET_WATCHED_USER, user: loggedInUser });
      return; // Skip fetching since it's the same user
    }
    const user = await userService.getById(userId);
    store.dispatch({ type: SET_WATCHED_USER, user });
    console.log("Load user successfully:", user);
  } catch (err) {
    console.log("Cannot load user", err);
  }
}

export async function updateUser(updatedUser) {
  try {
    const savedUser = await userService.update(updatedUser);

    store.dispatch({
      type: SET_USER,
      story: savedUser,
    });

    console.log("User updated successfully:", savedUser);
  } catch (err) {
    console.error("Error updating user", err);
    throw err;
  }
}

export async function updateUserImage(imgUrl) {
  try {
    const loggedInUser = userService.getLoggedinUser();
    if (!loggedInUser) throw new Error("No logged-in user found.");

    // Create a new image object
    const newImage = {
      userId: loggedInUser._id,
      fullname: loggedInUser.fullname,
      imgUrl,
    };

    const updatedUser = { ...loggedInUser };
    updatedUser.images = Array.isArray(updatedUser.images)
      ? [...updatedUser.images, newImage]
      : [newImage];
    const user = await userService.update(updatedUser);

    store.dispatch({
      type: SET_USER,
      user,
    });
    console.log("Update User Image successfully");

    return user;
  } catch (err) {
    console.error("Failed to update user image:", err);
    throw err;
  }
}

export async function followUser(userIdToFollow) {
  console.log("loggedIn", userService.getLoggedinUser());
  try {
    const loggedInUser = userService.getLoggedinUser();
    if (!loggedInUser) throw new Error("You must be logged in to follow users");

    const targetUser = await userService.getById(userIdToFollow);

    if (!Array.isArray(loggedInUser.following)) loggedInUser.following = [];
    if (!Array.isArray(targetUser.followers)) targetUser.followers = [];

    if (!loggedInUser.following.some((user) => user._id === userIdToFollow)) {
      loggedInUser.following.push({
        _id: targetUser._id,
        fullname: targetUser.fullname,
        imgUrl: targetUser.imgUrl,
      });

      if (!targetUser.followers.some((user) => user._id === loggedInUser._id)) {
        targetUser.followers.push({
          _id: loggedInUser._id,
          fullname: loggedInUser.fullname,
          imgUrl: loggedInUser.imgUrl,
        });
      }

      const notification = {
        type: "follow",
        fromUser: {
          userId: loggedInUser._id,
          fullname: loggedInUser.fullname,
          imgUrl: loggedInUser.imgUrl,
        },
        timestamp: new Date().toISOString(),
      };

      if (!Array.isArray(targetUser.notifications))
        targetUser.notifications = [];

      targetUser.notifications.push(notification);

      await userService.update(loggedInUser);
      await userService.update(targetUser);

      socketService.emit(SOCKET_EMIT_USER_FOLLOWED, {
        loggedInUser: loggedInUser,
        targetUserId: targetUser._id,
      });
      store.dispatch({ type: SET_USER, user: loggedInUser });
      store.dispatch({ type: SET_WATCHED_USER, user: targetUser }); // Update watchedUser here

      console.log("Update follow user successfully");
    }
  } catch (err) {
    console.error("UserActions: error in followUser", err);
  }
}

export async function unfollowUser(userIdToUnfollow) {
  try {
    const loggedInUser = userService.getLoggedinUser();
    if (!loggedInUser)
      throw new Error("You must be logged in to unfollow users");

    const targetUser = await userService.getById(userIdToUnfollow);

    loggedInUser.following = loggedInUser.following.filter(
      (user) => user._id !== userIdToUnfollow
    );
    targetUser.followers = targetUser.followers.filter(
      (user) => user._id !== loggedInUser._id
    );

    await userService.update(loggedInUser);
    await userService.update(targetUser);

    store.dispatch({ type: SET_USER, user: loggedInUser });
    store.dispatch({ type: SET_WATCHED_USER, user: targetUser });

    console.log("Update unfollow user successfully");
  } catch (err) {
    console.error("UserActions: error in unfollowUser", err);
  }
}
