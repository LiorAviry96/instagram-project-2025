export const SET_POSTS = 'SET_POSTS'
export const SET_POST = 'SET_POST'
export const REMOVE_POST = 'REMOVE_POST'
export const ADD_POST = 'ADD_POST'
export const UPDATE_POST = 'UPDATE_POST'

const initialState = {
    posts: [],
    post: null
}


export function postReducer(state = initialState, action) {
    var newState = state
    var posts
    switch (action.type) {
        case SET_POSTS:
            newState = { ...state, posts: action.posts }
            break
        case SET_POST:
            newState = { ...state, post: action.post }
            break
        //case REMOVE_POST:
          //  const lastRemovedPost = state.posts.find(post => post._id === action.postId)
            //posts = state.posts.filter(post => post._id !== action.postId)
            //newState = { ...state, posts, lastRemovedPost }
            //break
        case ADD_POST:
            newState = { ...state, posts: [...state.posts, action.post] }
            break
        case UPDATE_POST:
            posts = state.posts.map(post => (post._id === action.post._id) ? action.post : post)
            newState = { ...state, posts }
            break
       
        default:
    }
    return newState
}