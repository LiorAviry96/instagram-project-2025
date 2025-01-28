import { storageService } from "./async-storage.service";
import { userService } from "./user.service";
import { makeId, saveToStorage, loadFromStorage } from "./util.service";

const STORAGE_KEY = "storys";

export const storyService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getEmptyStory,
};

window.cs = storyService;

_createStorys();

async function query() {
  let storys = await storageService.query(STORAGE_KEY);

  return storys.map(
    ({ _id, txt, imgUrl, owner, comments, likedBy, createdAt }) => ({
      _id,
      txt,
      imgUrl,
      owner,
      comments,
      likedBy,
      createdAt,
    })
  );
}

function getById(storyId) {
  return storageService.get(STORAGE_KEY, storyId);
}

async function remove(storyId) {
  await storageService.remove(STORAGE_KEY, storyId);
}

async function save(story) {
  console.log("save story service page", story);
  let savedStory;
  if (story._id) {
    const storyToSave = {
      _id: story._id,
      txt: story.txt,
      imgUrl: story.imgUrl || "",
      by: story.by || userService.getLoggedinUser(),
      comments: story.comments || [],
      likedBy: story.likedBy || [],
    };
    savedStory = await storageService.put(STORAGE_KEY, storyToSave);
  } else {
    const storyToSave = {
      _id: makeId(),
      txt: story.txt,
      imgUrl: story.imgUrl || "",
      owner: {
        _id: userService.getLoggedinUser()._id,
        fullname: userService.getLoggedinUser().fullname,
        imgUrl: userService.getLoggedinUser().imgUrl,
      },
      comments: [],
      likedBy: [],
      createdAt: story.createdAt,
    };
    console.log("Saved story:", savedStory);

    savedStory = await storageService.post(STORAGE_KEY, storyToSave);
  }

  return savedStory;
}

function getDefaultFilter() {
  return {
    txt: "",
  };
}

function getEmptyStory(txt = "", imgUrl = "") {
  return {
    txt,
    imgUrl,
    owner: null,
  };
}

async function _createStorys() {
  let storys = loadFromStorage(STORAGE_KEY);

  if (!storys || !storys.length) {
    storys = [
      {
        _id: makeId(),
        txt: "Amazing trip!",
        imgUrl: "postImage1",
        owner: {
          _id: "u122",
          fullname: "John Doe",
          imgUrl: "user1",
        },
        comments: [
          {
            id: makeId(),
            by: {
              _id: "u196",
              fullname: "Dorothy Smith",
              imgUrl: "user3",
            },
            txt: "Wow, looks amazing!",
          },
        ],
        likedBy: [
          {
            _id: "u196",
            fullname: "Dorothy Smith",
            imgUrl: "user3",
          },
          {
            _id: "u119",
            fullname: "Orlando Bloom",
            imgUrl: "user6",
          },
        ],
        createdAt: "2025-01-13T10:00:00Z",
      },
      {
        _id: makeId(),
        txt: "Amazing Day!!",
        imgUrl: "postImage2",
        owner: {
          _id: "u122",
          fullname: "Robert Brown",
          imgUrl: "user2",
        },
        comments: [
          {
            id: makeId(),
            by: {
              _id: "u196",
              fullname: "Dorothy Smith",
              imgUrl: "user3",
            },
            txt: "Wow, looks amazing!",
          },
        ],
        likedBy: [
          {
            _id: "u196",
            fullname: "Dorothy Smith",
            imgUrl: "user3",
          },
          {
            _id: "u119",
            fullname: "Orlando Bloom",
            imgUrl: "user6",
          },
          {
            _id: "u409",
            fullname: "Chris Taylor",
            imgUrl: "user4",
          },
        ],
        createdAt: "2025-01-13T10:00:00Z",
      },
      {
        _id: makeId(),
        txt: "Best day ever!",
        imgUrl: "postImage3",
        owner: {
          _id: "u138",
          fullname: "Robert Brown",
          imgUrl: "user2",
        },
        comments: [
          {
            id: makeId(),
            by: {
              _id: "u409",
              fullname: "Chris Taylor",
              imgUrl: "user4",
            },
            txt: "Love it!",
          },
        ],
        likedBy: [
          {
            _id: "u122",
            fullname: "John Doe",
            imgUrl: "user1",
          },
          {
            _id: "u129",
            fullname: "Shon Smith",
            imgUrl: "user5",
          },
        ],
        createdAt: "2025-01-12T10:00:00Z",
      },
      {
        _id: makeId(),
        txt: "Loving the weekend vibes!",
        imgUrl: "postImage4",
        owner: {
          _id: "u196",
          fullname: "Dorothy Smith",
          imgUrl: "user3",
        },
        comments: [
          {
            id: makeId(),
            by: {
              _id: "u122",
              fullname: "John Doe",
              imgUrl: "user1",
            },
            txt: "Sounds like fun!",
          },
          {
            id: makeId(),
            by: {
              _id: "u138",
              fullname: "Robert Brown",
              imgUrl: "user2",
            },
            txt: "Wish I was there!",
          },
        ],
        likedBy: [
          {
            _id: "u129",
            fullname: "Shon Smith",
            imgUrl: "user5",
          },
          {
            _id: "u119",
            fullname: "Orlando Bloom",
            imgUrl: "user6",
          },
        ],
        createdAt: "2025-01-14T09:00:00Z",
      },
      {
        _id: makeId(),
        txt: "Exploring new horizons!",
        imgUrl: "postImage5",
        owner: {
          _id: "u409",
          fullname: "Chris Taylor",
          imgUrl: "user4",
        },
        comments: [
          {
            id: makeId(),
            by: {
              _id: "u138",
              fullname: "Robert Brown",
              imgUrl: "user2",
            },
            txt: "Amazing journey!",
          },
        ],
        likedBy: [
          {
            _id: "u122",
            fullname: "John Doe",
            imgUrl: "user1",
          },
        ],
        createdAt: "2025-01-15T08:30:00Z",
      },
      {
        _id: makeId(),
        txt: "Just chilling with friends.",
        imgUrl: "postImage6",
        owner: {
          _id: "u129",
          fullname: "Shon Smith",
          imgUrl: "user5",
        },
        comments: [
          {
            id: makeId(),
            by: {
              _id: "u409",
              fullname: "Chris Taylor",
              imgUrl: "user4",
            },
            txt: "Looks relaxing!",
          },
        ],
        likedBy: [
          {
            _id: "u196",
            fullname: "Dorothy Smith",
            imgUrl: "user3",
          },
          {
            _id: "u138",
            fullname: "Robert Brown",
            imgUrl: "user2",
          },
        ],
        createdAt: "2025-01-15T11:00:00Z",
      },
    ];
    saveToStorage(STORAGE_KEY, storys);
  }
}
