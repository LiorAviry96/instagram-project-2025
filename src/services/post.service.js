
import { storageService } from '../async-storage.service'
//import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'post'

export const postService = {
    query,
    getById,
    save,
    remove
}
window.cs = postService


async function query(filterBy = { txt: ''}) {
    var posts = await storageService.query(STORAGE_KEY)
    const { txt } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        posts = posts.filter(post => regex.test(post.txt))
    }
    
    
    posts = posts.map(({ _id, txt}) => ({ _id, txt }))
    return posts
}

function getById(postId) {
    return storageService.get(STORAGE_KEY, postId)
}

async function remove(postId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, postId)
}

async function save(post) {
    var savedPost
    if (post._id) {
        const postToSave = {
            _id: post._id,
            txt: post.txt,
        }
        savedPost = await storageService.put(STORAGE_KEY, postToSave)
    } else {
        const postToSave = {
            txt: post.txt,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            msgs: []
        }
        savedPost = await storageService.post(STORAGE_KEY, postToSave)
    }
    return savedPost
}

