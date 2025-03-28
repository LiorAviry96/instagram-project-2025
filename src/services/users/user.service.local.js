import { storageService } from "../async-storage.service";
import { saveToStorage, loadFromStorage, makeId } from "../util.service";
const STORAGE_KEY_LOGGEDIN_USER = "user";
const NOTIFICATIONS = "notifications";
export const userService = {
  login,
  logout,
  signup,
  getUsers,
  getById,
  remove,
  update,
  getLoggedinUser,
  saveLoggedinUser,
  addUserMsg,
  getChatMessages,
  fetchAllNotifications,
};

_createUsers();

async function getUsers() {
  const users = await storageService.query("user");
  return users.map((user) => {
    delete user.password;
    return user;
  });
}

async function getById(userId) {
  return await storageService.get("user", userId);
}

function remove(userId) {
  return storageService.remove("user", userId);
}

async function update(updatedUser) {
  const user = await storageService.get("user", updatedUser._id);

  Object.assign(user, updatedUser);
  await storageService.put("user", user);

  const loggedInUser = getLoggedinUser();

  if (loggedInUser._id === user._id) saveLoggedinUser(user);
  return user;
}

async function login(userCred) {
  const users = await storageService.query("user");
  const user = users.find((user) => user.username === userCred.username);
  if (user) return saveLoggedinUser(user);
}

async function signup(userCred) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png";

  const user = await storageService.post("user", userCred);
  return saveLoggedinUser(user);
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}

function saveLoggedinUser(user) {
  if (!user || !user._id) {
    throw new Error("Invalid user object provided.");
  }
  user = {
    _id: user._id,
    username: user.username,
    password: user.password,
    fullname: user.fullname,
    imgUrl: user.imgUrl,
    following: user.following || [],
    followers: user.followers || [],
    images: user.images || [],
    savedStorys: user.savedStorys || [],
    notifications: user.notifications || [],
  };
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
  return user;
}

async function addUserMsg(loginUser, targetUser, txt) {
  const user = await getById(loginUser._Id);

  const msg = {
    id: makeId(),
    by: user,
    to: targetUser,
    txt,
  };
  await storageService.put(STORAGE_KEY_LOGGEDIN_USER, user);
  return msg;
}
async function getChatMessages() {}

async function fetchAllNotifications() {
  return JSON.parse(sessionStorage.getItem(NOTIFICATIONS));
}
async function _createUsers() {
  let users = loadFromStorage(STORAGE_KEY_LOGGEDIN_USER);

  if (!users || !users.length) {
    users = [
      {
        _id: "u122",
        username: "JohnD",
        password: "12345",
        fullname: "John Doe",
        imgUrl: "user1",
        following: [
          {
            _id: "u138",
            fullname: "Robert Brown",
            imgUrl: "user2",
          },
          {
            _id: "u196",
            fullname: "Dorothy Smith",
            imgUrl: "user3",
          },
          {
            _id: "u140",
            fullname: "Ronen Chen",
            imgUrl: "user8",
          },
        ],
        followers: [
          {
            _id: "u196",
            fullname: "Dorothy Smith",
            imgUrl: "user3",
          },
          {
            _id: "u140",
            fullname: "Ronen Chen",
            imgUrl: "user8",
          },
        ],
        images: [
          {
            userId: "u122",
            fullname: "John Doe",
            imgUrl: "postImage1",
          },
        ],
        savedStorys: [
          {
            userId: "u409",
            fullname: "Chris Taylor",
            imgUrl: "postImage5",
          },
        ],
        notifications: [],
      },
      {
        _id: "u138",
        username: "Robi",
        password: "12345",
        fullname: "Robert Brown",
        imgUrl: "user2",
        following: [
          {
            _id: "u196",
            fullname: "Dorothy Smith",
            imgUrl: "user3",
          },
        ],
        followers: [
          {
            _id: "u196",
            fullname: "Dorothy Smith",
            imgUrl: "user3",
          },
        ],
        images: [
          {
            userId: "u122",
            fullname: "Robert Brown",
            imgUrl: "postImage2",
          },
          {
            userId: "u122",
            fullname: "Robert Brown",
            imgUrl: "postImage3",
          },
        ],
        savedStorys: [],
        notifications: [],
      },
      {
        _id: "u196",
        username: "Dorothy",
        password: "12345",
        fullname: "Dorothy Smith",
        imgUrl: "user3",
        following: [
          {
            _id: "u122",
            fullname: "JohnD",
            imgUrl: "user1",
          },
          {
            _id: "u138",
            fullname: "Robert Brown",
            imgUrl: "user2",
          },
          {
            _id: "u409",
            fullname: "Chris Taylor",
            imgUrl: "user4",
          },
        ],
        followers: [
          {
            _id: "u122",
            fullname: "JohnD",
            imgUrl: "user1",
          },
          {
            _id: "u138",
            fullname: "Robert Brown",
            imgUrl: "user2",
          },
        ],
        images: [
          {
            userId: "u196",
            fullname: "Dorothy Smith",
            imgUrl: "postImage4",
          },
        ],
        savedStorys: [
          {
            userId: "u140",
            fullname: "Ronen Chen",
            imgUrl: "post9",
          },
        ],
        notifications: [],
      },
      {
        _id: "u409",
        username: "Chris",
        password: "12345",
        fullname: "Chris Taylor",
        imgUrl: "user4",
        following: [],
        followers: [
          {
            _id: "u196",
            fullname: "Dorothy Smith",
            imgUrl: "user3",
          },
          {
            _id: "u129",
            fullname: "Shon Cohen",
            imgUrl: "user5",
          },
        ],
        images: [
          {
            _id: "u409",
            fullname: "Chris Taylor",
            imgUrl: "postImage5",
          },
        ],
        savedStorys: [
          {
            userId: "u140",
            fullname: "Ronen Chen",
            imgUrl: "post9",
          },
        ],
        notifications: [],
      },
      {
        _id: "u129",
        username: "Shon123",
        password: "12345",
        fullname: "Shon Cohen",
        imgUrl: "user5",
        following: [
          {
            _id: "u409",
            fullname: "Chris Taylor",
            imgUrl: "user4",
          },
        ],
        followers: [],
        images: [
          {
            _id: "u129",
            fullname: "Shon Smith",
            imgUrl: "postImage6",
          },
        ],
        savedStorys: [
          {
            userId: "u409",
            fullname: "Chris Taylor",
            imgUrl: "postImage5",
          },
          {
            userId: "u140",
            fullname: "Ronen Chen",
            imgUrl: "post9",
          },
        ],
        notifications: [],
      },
      {
        _id: "u119",
        username: "Orlando",
        password: "12345",
        fullname: "Orlando Bloom",
        imgUrl: "user6",
        following: [],
        followers: [],
        images: [],
        savedStorys: [
          {
            userId: "u140",
            fullname: "Ronen Chen",
            imgUrl: "post8",
          },
        ],
        notifications: [],
      },
      {
        _id: "u140",
        username: "Ronen",
        password: "12345",
        fullname: "Ronen Chen",
        imgUrl: "user8",
        following: [
          {
            _id: "u122",
            fullname: "John Doe",
            imgUrl: "user1",
          },

          {
            _id: "u196",
            fullname: "Dorothy Smith",
            imgUrl: "user3",
          },
        ],
        followers: [
          {
            _id: "u196",
            fullname: "Dorothy Smith",
            imgUrl: "user3",
          },
        ],
        images: [
          {
            userId: "u140",
            fullname: "Ronen Chen",
            imgUrl: "post9",
          },
          {
            userId: "u140",
            fullname: "Ronen Chen",
            imgUrl: "post8",
          },
        ],
        savedStorys: [
          {
            userId: "u409",
            fullname: "Chris Taylor",
            imgUrl: "postImage5",
          },
        ],
        notifications: [],
      },
    ];
    saveToStorage(STORAGE_KEY_LOGGEDIN_USER, users);
  }
  console.log("users", users);
}
