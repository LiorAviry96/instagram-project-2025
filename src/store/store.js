import { legacy_createStore as createStore, combineReducers } from 'redux'
import { postReducer } from './reducer/posts.reducer'
import { userReducer } from './reducer/user.reducer'
import { systemReducer } from './reducer/system.reducer'

const rootReducer = combineReducers({
    postModule: postReducer,
    userModule: userReducer,
    systemModule: systemReducer,

})


const middleware = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : undefined
export const store = createStore(rootReducer, middleware)