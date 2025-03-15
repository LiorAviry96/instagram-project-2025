import { httpService } from "../http.service";

const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser";

export const userService = {
  login,
  logout,
  signup,
  getUsers,
  getById,
  remove,
  update,
  getLoggedinUser,
  addUserMsg,
  getChatMessages,
  fetchAllNotifications,
};

function getUsers() {
  return httpService.get(`user`);
}

async function getById(userId) {
  const user = await httpService.get(`user/${userId}`);
  return user;
}

function remove(userId) {
  return httpService.delete(`user/${userId}`);
}

async function update(updatedUser) {
  if (!updatedUser || !updatedUser._id) {
    console.error("updateUser: Invalid user object", updatedUser);
    return;
  }
  const user = await httpService.put(`user/${updatedUser._id}`, updatedUser);

  const loggedinUser = getLoggedinUser();
  if (loggedinUser._id === user._id) _saveLocalUser(user);

  return user;
}

async function login(userCred) {
  const user = await httpService.post("auth/", userCred);

  if (user) return _saveLocalUser(user);
}

async function signup(userCred) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png";

  const user = await httpService.post("auth/signup", userCred);
  return _saveLocalUser(user);
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
  return await httpService.post("auth/logout");
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}

async function addUserMsg(user, targetUser, txt) {
  const savedMsg = await httpService.post(`user/${user._Id}/inbox/`, {
    targetUser,
    txt,
  });
  return savedMsg;
}

async function getChatMessages(user, targetUserId) {
  return await httpService.get(`user/${user._id}/inbox/${targetUserId}`);
}
async function fetchAllNotifications(userId) {
  return await httpService.get(`user/${userId}/notifications`);
}

function _saveLocalUser(user) {
  user = {
    _id: user._id,
    username: user.username,
    password: user.password,
    fullname: user.fullname,
    imgUrl: user.imgUrl,
    following: user.following,
    followers: user.followers,
    images: user.images,
    savedStorys: user.savedStorys,
    notifications: user.notifications,
  };
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
  return user;
}
