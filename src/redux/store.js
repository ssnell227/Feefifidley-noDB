import {createStore, applyMiddleware } from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import authReducer from './reducers/authReducer'

export default createStore(authReducer, composeWithDevTools())