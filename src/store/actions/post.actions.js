import { store }from '../store'
import { postService } from '../../services/post.service'
import { SET_POST, SET_POSTS , UPDATE_POST} from '../reducer/posts.reducer'

export async function loadPosts() {
    try {
        const posts = await postService.query()
        console.log(posts)
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
export async function updatePost(updatedPost) {
    try {
        // Save the updated post to the storage or backend
        const savedPost = await postService.save(updatedPost);

        // Dispatch the updated post to the Redux store
        store.dispatch({
            type: UPDATE_POST,
            post: savedPost,
        });

        console.log('Post updated successfully:', savedPost);
    } catch (err) {
        console.error('Error updating post:', err);
        throw err;
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
