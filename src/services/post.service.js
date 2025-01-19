import { storageService } from './async-storage.service'
import { userService } from './user.service'
import { makeId, saveToStorage, loadFromStorage } from './util.service'

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

_createPosts()

async function query() {
    let posts = await storageService.query(STORAGE_KEY);

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
    console.log('save post service page' , post)
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
            _id: makeId(),
            txt: post.txt,
            imgUrl: post.imgUrl || '',
            owner: {
                _id:  userService.getLoggedinUser()._id,
                fullname:  userService.getLoggedinUser().fullname,
                imgUrl: userService.getLoggedinUser().imgUrl, 
            },
            comments: [],
            likedBy: [],
            createdAt: post.createdAt
        }
        console.log('Saved post:', savedPost)

        savedPost = await storageService.post(STORAGE_KEY, postToSave)
    }

   
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
 let posts = loadFromStorage(STORAGE_KEY)

    if (!posts || !posts.length){
         posts = [
            {
                _id: makeId(),
                txt: 'Amazing trip!',
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
                createdAt: "2025-01-13T10:00:00Z"
            },
            {
                _id: makeId(),
                txt: 'Amazing Day!!',
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
                createdAt: "2025-01-13T10:00:00Z"
            },
            {
                _id: makeId(),
                txt: 'Best day ever!',
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
                createdAt: "2025-01-12T10:00:00Z"
            },
            {
                _id: makeId(),
                txt: 'Loving the weekend vibes!',
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
                txt: 'Exploring new horizons!',
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
                txt: 'Just chilling with friends.',
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
        saveToStorage(STORAGE_KEY, posts);

    }
    
}



