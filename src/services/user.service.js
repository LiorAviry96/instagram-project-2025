import { storageService } from './async-storage.service'
import { saveToStorage , loadFromStorage } from './util.service'
const STORAGE_KEY_LOGGEDIN_USER = 'user'

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
    console.log('updatedUser service', updatedUser)
    const user = await storageService.get("user", updatedUser._id);
    console.log('Object.assign(user, updatedUser)', Object.assign(user, updatedUser))

    Object.assign(user, updatedUser); // Merge the updated fields into the user object
    await storageService.put("user", user);

    const loggedInUser = getLoggedinUser();
    if (loggedInUser._id === user._id) saveLoggedinUser(user);
    return user;
}


async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username)
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
        username: user.username, 
        password: user.password, 
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
    let users = loadFromStorage(STORAGE_KEY_LOGGEDIN_USER)

    if (!users || !users.length){
         users = [
            {
                _id: "u122",
                username: 'JohnD',
                password: '12345',
                fullname: 'John Doe',
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
                        _id: "u122",
                        fullname: "JohnD",
                        imgUrl: "user1",
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
                        fullname: "John Doe",
                        imgUrl: "postImage1",
                    },
                ],
            },
            {
                _id: "u138",
                username: 'Bob',
                password: '12345',
                fullname: 'Robert Brown',
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
            },
            {
                _id: "u196",
                username: 'Dorothy',
                password: '12345',
                fullname: 'Dorothy Smith',
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
            },
            {
                _id: "u409",
                username: 'Chris',
                password: '12345',
                fullname: 'Chris Taylor',
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
            },
            {
                _id: "u129",
                username: 'Shon123',
                password: '12345',
                fullname: 'Shon Cohen',
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
            },
            {
                _id: "u119",
                username: 'Orlando',
                password: '12345',
                fullname: 'Orlando Bloom',
                imgUrl: "user6",
                following: [],
                followers: [],
                images: [],
            },
        ];
        console.log('users', users)
       saveToStorage(STORAGE_KEY_LOGGEDIN_USER, users);


    }
   
}
