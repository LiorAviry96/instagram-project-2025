import { userService } from '../../services/user.service'
import { socketService } from '../../services/socket.service'
import { store } from '../store'

import { showErrorMsg } from '../../services/event-bus.service'
import { LOADING_DONE, LOADING_START } from '../reducer/system.reducer'
import { REMOVE_USER, SET_USER, SET_USERS, SET_WATCHED_USER } from '../reducer/user.reducer'

export async function loadUsers() {
    try {
        store.dispatch({ type: LOADING_START })
        const users = await userService.getUsers()
        store.dispatch({ type: SET_USERS, users })
    } catch (err) {
        console.log('UserActions: err in loadUsers', err)
    } finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function removeUser(userId) {
    try {
        await userService.remove(userId)
        store.dispatch({ type: REMOVE_USER, userId })
    } catch (err) {
        console.log('UserActions: err in removeUser', err)
    }
}

export async function login(credentials) {
    try {
        const user = await userService.login(credentials)
        store.dispatch({
            type: SET_USER,
            user
        })
        socketService.login(user._id)
        return user
    } catch (err) {
        console.log('Cannot login', err)
        throw err
    }
}

export async function signup(credentials) {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({
            type: SET_USER,
            user
        })
        socketService.login(user._id)
        return user
    } catch (err) {
        console.log('Cannot signup', err)
        throw err
    }
}

export async function logout() {
    try {
        await userService.logout()
        store.dispatch({
            type: SET_USER,
            user: null
        })
        socketService.logout()
        console.log('Logout Successful')
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}

export async function loadUser(userId) {
    try {
        const loggedInUser = userService.getLoggedinUser();
        if (loggedInUser && loggedInUser._id === userId) {
            store.dispatch({ type: SET_WATCHED_USER, user: loggedInUser });
            return; // Skip fetching since it's the same user
        }
        const user = await userService.getById(userId);
        store.dispatch({ type: SET_WATCHED_USER, user });
    } catch (err) {
        showErrorMsg('Cannot load user');
        console.log('Cannot load user', err);
    }
}


export async function updateUserImage(imgUrl) {
    try {
        const loggedInUser = userService.getLoggedinUser();
        if (!loggedInUser) throw new Error("No logged-in user found.");

        // Create a new image object
        const newImage = {
            userId: loggedInUser._id,
            fullname: loggedInUser.fullname,
            imgUrl,
        };
        console.log('newImage', newImage)
        const updatedUser = { ...loggedInUser };
        updatedUser.images = [...updatedUser.images, newImage];
        console.log('updatedUser', updatedUser)
        const user = await userService.update(updatedUser);
        
        store.dispatch({
            type: SET_USER,
            user,
        });

        return user;
    } catch (err) {
        console.error("Failed to update user image:", err);
        throw err;
    }
}

export async function followUser(userIdToFollow) {
    try {
        const loggedInUser = userService.getLoggedinUser();
        if (!loggedInUser) throw new Error('You must be logged in to follow users');

        const targetUser = await userService.getById(userIdToFollow);

        // Avoid duplicates
        if (!loggedInUser.following.some(user => user._id === userIdToFollow)) {
            loggedInUser.following.push({ 
                _id: targetUser._id, 
                username: targetUser.username, 
                imgUrl: targetUser.imgUrl 
            });

            // Add the logged-in user to the target user's followers list
            if (!targetUser.followers.some(user => user._id === loggedInUser._id)) {
                targetUser.followers.push({ 
                    _id: loggedInUser._id, 
                    username: loggedInUser.username, 
                    imgUrl: loggedInUser.imgUrl 
                });
            }

            // Update users in the backend
            await userService.update(loggedInUser);
            await userService.update(targetUser);

            // Update in Redux store
            store.dispatch({ type: SET_USER, user: loggedInUser });
            store.dispatch({ type: SET_WATCHED_USER, user: targetUser }); // Update watchedUser here
        }
    } catch (err) {
        console.error('UserActions: error in followUser', err);
        showErrorMsg('Failed to follow the user');
    }
}

export async function unfollowUser(userIdToUnfollow) {
    try {
        const loggedInUser = userService.getLoggedinUser();
        if (!loggedInUser) throw new Error('You must be logged in to unfollow users');

        const targetUser = await userService.getById(userIdToUnfollow);

        // Remove from following and followers lists
        loggedInUser.following = loggedInUser.following.filter(user => user._id !== userIdToUnfollow);
        targetUser.followers = targetUser.followers.filter(user => user._id !== loggedInUser._id);

        // Update users in the backend
        await userService.update(loggedInUser);
        await userService.update(targetUser);

        // Update in Redux store
        store.dispatch({ type: SET_USER, user: loggedInUser });
        store.dispatch({ type: SET_WATCHED_USER, user: targetUser }); // Update watchedUser here
    } catch (err) {
        console.error('UserActions: error in unfollowUser', err);
        showErrorMsg('Failed to unfollow the user');
    }
}

