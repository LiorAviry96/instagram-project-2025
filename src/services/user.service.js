import { storageService } from './async-storage.service'
import { makeId, saveToStorage } from './util.service'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

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
}

_createUsers()

async function getUsers() {
    const users = await storageService.query('user')
    return users.map(user => {
        delete user.password
        return user
    })
}

async function getById(userId) {
    return await storageService.get('user', userId)
}

function remove(userId) {
    return storageService.remove('user', userId)
}

async function update(updatedUser) {
    const user = await storageService.get("user", updatedUser._id);
    Object.assign(user, updatedUser); // Merge the updated fields into the user object
    await storageService.put("user", user);

    const loggedInUser = getLoggedinUser();
    if (loggedInUser._id === user._id) saveLoggedinUser(user);

    return user;
}


async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username)
    console.log('user service', user)
    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    userCred.score = 10000

    const user = await storageService.post('user', userCred)
    return saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
    if (!user || !user._id) {
        throw new Error("Invalid user object provided.");
    }
	user = { 
        _id: user._id, 
        fullname: user.fullname, 
        imgUrl: user.imgUrl, 
        following: user.following || [],
        followers: user.followers || [],
        images: user.images || [],   
    }
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}


async function _createUsers() {
    const users = [
        {
            _id: makeId(),
            username: 'Muko',
            password: '12345', // Random 9-digit password
            fullname: 'John Doe',
            imgUrl: "image1", // Assuming the image exists in the assets folder
            following: [
                {
                    _id: "u122",
                    fullname: "Alice",
                    imgUrl: "image2",
                },
                {
                    _id: "u138",
                    fullname: "Bob",
                    imgUrl: "image3",
                },
                
            ],
            followers: [
                {
                    _id: "u196",
                    fullname: "Dorothy",
                    imgUrl: "image1",                },
               
            ],
            images: [],
        },
        {
            _id: makeId(),
            username: 'Dob',
            password: '12345',
            fullname: 'Alice Johnson',
            imgUrl: "image3",
            following: [
                {
                    _id: "u122",
                    fullname: "Muko",
                    imgUrl: "image2",                },
                {
                    _id: "u138",
                    fullname: "Dan",
                    imgUrl: "image1",
                },
  
            ],
            followers: [
              
            ],
            images: [],
        },
        {
            _id: makeId(),
            username: 'Bob',
            password: '12345',
            fullname: 'Robert Brown',
            imgUrl: "image1",
            following: [
                {
                    _id: "u122",
                    fullname: "Chris",
                    imgUrl: "image1",                },
                {
                    _id: "u138",
                    fullname: "Sam",
                    imgUrl: "image3",                },
                {
                    _id: "u409",
                    fullname: "Taylor",
                    imgUrl: "image1",                }
            ],
            followers: [
                {
                    _id: "u196",
                    fullname: "Janet",
                    imgUrl: "image1",                },
             
            ],
            images: [],
        },
        {
            _id: makeId(),
            username: 'Alice',
            password: '12345',
            fullname: 'Alice White',
            imgUrl: "image3",
            following: [
                {
                    _id: "u122",
                    fullname: "Taylor",
                    imgUrl: "image1",                },
                {
                    _id: "u138",
                    fullname: "Jamie",
                    imgUrl: "image2",                },
                {
                    _id: "u409",
                    fullname: "John",
                    imgUrl: "image3",                }
            ],
            followers: [
                {
                    _id: "u196",
                    fullname: "Sara",
                    imgUrl: "image1",                },
                {
                    _id: "u119",
                    fullname: "Lucas",
                    imgUrl: "image2",                },
                {
                    _id: "u129",
                    fullname: "Chris",
                    imgUrl: "image3",                }
            ],
            images: [],
        },
        // Add more users here following the same pattern...
    ]

    console.log('users', users)
    saveToStorage('user', users)
    return users
}
