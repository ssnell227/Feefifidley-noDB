import {createStore, applyMiddleware, combineReducers } from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import promiseMiddleware from 'redux-promise-middleware'
import authReducer from './reducers/authReducer'
import gameReducer from './reducers/gameReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    game: gameReducer
})

export default createStore(rootReducer, composeWithDevTools(applyMiddleware(promiseMiddleware)))