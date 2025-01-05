import { store }from '../store'
import { postService } from '../../services/post.service'
import { SET_POST, SET_POSTS } from '../reducer/posts.reducer'

export async function loadPosts(filterBy) {
    try {
        const posts = await postService.query(filterBy)
        store.dispatch(getCmdSetPosts(posts))
    } catch (err) {
        console.log('Cannot load cars', err)
        throw err
    }
}

export async function loadPost(postId) {
    try {
        const post = await postService.getById(postId)
        store.dispatch(getCmdSetPost(post))
    } catch (err) {
        console.log('Cannot load car', err)
        throw err
    }
}

function getCmdSetPosts(posts) {
    return {
        type: SET_POSTS,
        posts
    }
}
function getCmdSetPost(post) {
    return {
        type: SET_POST,
        post
    }
}
