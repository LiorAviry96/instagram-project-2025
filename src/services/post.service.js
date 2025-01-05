import { storageService } from './async-storage.service'
import { userService } from './user.service'
import { makeId, saveToStorage,makeLorem, loadFromStorage, getRandomIntInclusive } from './util.service'

const STORAGE_KEY = 'post'

export const postService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyPost
}

window.cs = postService

// Initialize posts storage
_createPosts()

async function query(filterBy = { txt: '' }) {
    let posts = await storageService.query(STORAGE_KEY)
    const { txt } = filterBy

    if (txt) {
        const regex = new RegExp(txt, 'i')
        posts = posts.filter(post => regex.test(post.txt))
    }

    return posts.map(({ _id, txt, imgUrl, owner }) => ({ _id, txt, imgUrl, owner }))
}

function getById(postId) {
    return storageService.get(STORAGE_KEY, postId)
}

async function remove(postId) {
    await storageService.remove(STORAGE_KEY, postId)
}

async function save(post) {
    let savedPost
    if (post._id) {
        const postToSave = {
            _id: post._id,
            txt: post.txt,
            imgUrl: post.imgUrl || '',
            by: post.by || userService.getLoggedinUser(),
            comments: post.comments || [],
            likedBy: post.likedBy || []
        }
        savedPost = await storageService.put(STORAGE_KEY, postToSave)
    } else {
        const postToSave = {
            txt: post.txt,
            imgUrl: post.imgUrl || '',
            by: userService.getLoggedinUser(),
            comments: [],
            likedBy: []
        }
        savedPost = await storageService.post(STORAGE_KEY, postToSave)
    }

    console.log('Saved post:', savedPost)
    return savedPost
}

function getDefaultFilter() {
    return {
        txt: ''
    }
}

function getEmptyPost(txt = '', imgUrl = '') {
    return {
        txt,
        imgUrl,
        owner: null, // Will be set when saving
        msgs: []
    }
}

/*function _createPosts() {
    let posts = loadFromStorage(STORAGE_KEY)
    if (!posts || !posts.length) {
        posts = [
            _createPost('Post 1', '../assets/images/image1.jpeg'),
            _createPost('Post 2', '../assets/images/image1.jpeg'),
            _createPost('Post 3', '../assets/images/image1.jpeg'),
            _createPost('Post 4', '../assets/images/image1.jpeg')
        ]
        saveToStorage(STORAGE_KEY, posts)
    }
}*/

function _createPosts() {
    const posts = []
    const captions = ['Amazing trip!', 'Best day ever!', 'Nature is so beautiful', 'Check out my new post!', 'Feeling inspired']
    const users = loadFromStorage('user')// Ensure users exist

    for (let i = 0; i < 20; i++) {
        const randomUser = users[getRandomIntInclusive(0, users.length - 1)]
        const post = {
            _id: makeId(),
            txt: captions[getRandomIntInclusive(0, captions.length - 1)],
            imgUrl: `https://picsum.photos/200/300?random=${i}`,
            by: {
                _id: randomUser._id,
                fullname: randomUser.fullname,
                imgUrl: randomUser.imgUrl,
            },
            comments: [
                {
                    id: makeId(),
                    by: {
                        _id: users[getRandomIntInclusive(0, users.length - 1)]._id,
                        fullname: makeLorem(2),
                        imgUrl: `https://robohash.org/${i + 1}`,
                    },
                    txt: makeLorem(5),
                },
            ],
            likedBy: [],
        }
        posts.push(post)
    }
    console.log('posts', posts)
    saveToStorage('post', posts)
    return posts
}

