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
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}

export async function loadUser(userId) {
    try {
        const user = await userService.getById(userId)
        store.dispatch({ type: SET_WATCHED_USER, user })
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.log('Cannot load user', err)
    }
}

export async function updateUserImage(imgUrl) {
    if (!imgUrl) throw new Error('Image URL is required for update');
    try {
        const loggedInUser = userService.getLoggedinUser();
        if (!loggedInUser) throw new Error('No logged-in user');

        // Update user in the backend
        const updatedUser = {
            ...loggedInUser,
            images: [...(loggedInUser.images || []), imgUrl],
        };
        await userService.update(updatedUser);

        // Update in Redux store
        store.dispatch({ type: SET_USER, user: updatedUser });

        // Save to session storage
        userService.saveLoggedinUser(updatedUser);
    } catch (err) {
        console.error('Error updating user image:', err);
        throw err;
    }
}

export async function followUser(userIdToFollow) {
    try {
        const loggedInUser = userService.getLoggedinUser();
        if (!loggedInUser) throw new Error('You must be logged in to follow users');

        // Add the user to the logged-in user's following list
        if (!loggedInUser.following.some(user => user._id === userIdToFollow)) {
            const targetUser = await userService.getById(userIdToFollow);
            loggedInUser.following.push(targetUser);
            
            // Add the logged-in user to the target user's followers list
            if (!targetUser.followers.some(user => user._id === loggedInUser._id)) {
                targetUser.followers.push(loggedInUser);
            }

            // Update users in the backend
            await userService.update(loggedInUser);
            await userService.update(targetUser);

            // Update in Redux store
            store.dispatch({ type: SET_USER, user: loggedInUser });
            store.dispatch({ type: SET_WATCHED_USER, user: targetUser });
        }
    } catch (err) {
        console.log('UserActions: error in followUser', err);
        showErrorMsg('Failed to follow the user');
    }
}

export async function unfollowUser(userIdToUnfollow) {
    try {
        const loggedInUser = userService.getLoggedinUser();
        if (!loggedInUser) throw new Error('You must be logged in to unfollow users');

        const targetUser = await userService.getById(userIdToUnfollow);
        loggedInUser.following = loggedInUser.following.filter(user => user._id !== userIdToUnfollow);

        targetUser.followers = targetUser.followers.filter(user => user._id !== loggedInUser._id);

        await userService.update(loggedInUser);
        await userService.update(targetUser);

        store.dispatch({ type: SET_USER, user: loggedInUser });
        store.dispatch({ type: SET_WATCHED_USER, user: targetUser });
    } catch (err) {
        console.log('UserActions: error in unfollowUser', err);
        showErrorMsg('Failed to unfollow the user');
    }
}
