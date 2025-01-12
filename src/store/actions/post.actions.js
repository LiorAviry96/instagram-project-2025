import { store }from '../store'
import { postService } from '../../services/post.service'
import { SET_POST, SET_POSTS, ADD_POST , UPDATE_POST} from '../reducer/posts.reducer'
import { showErrorMsg } from '../../services/event-bus.service'


export async function loadPosts() {
    try {
        const posts = await postService.query()
        console.log(posts)
        store.dispatch(getCmdSetPosts(posts))
    } catch (err) {
        console.log('Cannot load posts', err)
        throw err
    }
}

export async function loadPost(postId) {
    try {
        const post = await postService.getById(postId)
        store.dispatch(getCmdSetPost(post))
    } catch (err) {
        console.log('Cannot load post', err)
        throw err
    }
}
export async function updatePost(updatedPost) {
    try {
        const savedPost = await postService.save(updatedPost);

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

export async function createPost(newPost) {
    try {
        const savedPost = await postService.save(newPost);

        store.dispatch({
            type: ADD_POST,
            post: savedPost,
        });

        console.log('Post created successfully:', savedPost);
        return savedPost;
    } catch (err) {
        console.error('Error creating post:', err);
        showErrorMsg('Failed to create post');
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
