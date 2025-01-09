import { storageService } from './async-storage.service'
import { userService } from './user.service'
import { makeId, saveToStorage } from './util.service'

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

async function query() {
    let posts = await storageService.query(STORAGE_KEY);

    // Return all fields of the posts
    return posts.map(({ _id, txt, imgUrl, owner, comments, likedBy, createdAt }) => ({
        _id,
        txt,
        imgUrl,
        owner,
        comments,
        likedBy,
        createdAt,
    }));
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
            likedBy: [],
            createdAt: post.createdAt
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
        owner: null, 
    }
}

async function _createPosts() {

    const posts = [
        {
            _id: makeId(),
            txt: 'Amazing trip!',
            imgUrl: "postImage1",
            owner: {
                _id: "u122",
                fullname: "Muko",
                imgUrl: "user1",
            },
            comments: [
                {
                    id: makeId(),
                    by: {
                        _id: "u196",
                        fullname: "Dorothy",
                        imgUrl: "user3",
                    },
                    txt: "Wow, looks amazing!",
                },
            ],
            likedBy: [
                {
                    _id: "u196",
                    fullname: "Dorothy",
                    imgUrl: "user3",
                },
                {
                    _id: "u119",
                    fullname: "Orlando",
                    imgUrl: "user6",
                },
            ],
            createdAt: "2025-01-13T10:00:00Z"
        },
        {
            _id: makeId(),
            txt: 'Best day ever!',
            imgUrl: "postImage2",
            owner: {
                _id: "u138",
                fullname: "Bob",
                imgUrl: "user2",
            },
            comments: [
                {
                    id: makeId(),
                    by: {
                        _id: "u409",
                        fullname: "Chris",
                        imgUrl: "user4",
                    },
                    txt: "Love it!",
                },
            ],
            likedBy: [
                {
                    _id: "u122",
                    fullname: "Muko",
                    imgUrl: "user1",
                },
                {
                    _id: "u129",
                    fullname: "Shon Smith",
                    imgUrl: "user5",
                },
            ],
            createdAt: "2025-01-12T10:00:00Z"
        },
        // Add 10 more fake posts here with varied data
    ];
    console.log(posts)
    saveToStorage(STORAGE_KEY, posts);
    return posts;
}


