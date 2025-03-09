import { httpService } from "../http.service";

export const storyService = {
  query,
  getById,
  save,
  remove,
};

async function query() {
  return httpService.get(`story`);
}

function getById(storyId) {
  return httpService.get(`story/${storyId}`);
}

async function remove(storyId) {
  return httpService.delete(`story/${storyId}`);
}

async function save(story) {
  var savedStory;
  console.log("story save", story);
  if (story._id) {
    savedStory = await httpService.put(`story/${story._id}`, story);
  } else {
    savedStory = await httpService.post("story", story);
  }
  return savedStory;
}
