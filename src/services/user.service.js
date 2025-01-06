import { storageService } from './async-storage.service'
import { makeId, makeLorem, saveToStorage } from './util.service'
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

async function update({ _id, score }) {
    const user = await storageService.get('user', _id)
    user.score = score
    await storageService.put('user', user)

	// When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser()
    if (loggedinUser._id === user._id) saveLoggedinUser(user)

    return user
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

// To quickly create an admin user, uncomment the next line
// _createUser()
/*async function _createUser() {
    const user = {
        username: 'admin',
        password: 'admin',
        fullname: 'Mustafa Adminsky',
        imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
        score: 10000,
    }

    const newUser = await storageService.post('user', user)
    console.log('newUser: ', newUser)
}*/

function _createUsers() {
    const users = []
    const names = ['Muko', 'Dob', 'Bob', 'Alice', 'Jane', 'John', 'Chris', 'Sam', 'Taylor', 'Jamie']
    for (let i = 0; i < 10; i++) {
        const user = {
            _id: makeId(),
            username: names[i] || makeLorem(1),
            password: 'password' + i,
            fullname: makeLorem(2),
            imgUrl: `https://robohash.org/${i}`,
            following: [
                {
                    _id: "u122",
                    fullname: "Dob",
                    imgUrl: "https://robohash.org/2"
                  },
                  {
                    _id: "u138",
                    fullname: "Dan",
                    imgUrl: "https://robohash.org/3"
                  },
                  {
                    _id: "u409",
                    fullname: "Ben",
                    imgUrl: "https://robohash.org/4"
                  }
            ],
            followers: [
                {
                    _id: "u196",
                    fullname: "Dor",
                    imgUrl: "https://robohash.org/8"
                  },
                  {
                    _id: "u119",
                    fullname: "Or",
                    imgUrl: "https://robohash.org/9"
                  },
                  {
                    _id: "u129",
                    fullname: "Shon",
                    imgUrl: "https://robohash.org/7"
                  }
            ],
            images: [],
        }
        users.push(user)
    }
    console.log('users', users)
    saveToStorage('user', users)
    return users
}
