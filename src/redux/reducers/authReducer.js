
const initialState = {
    //default names for dev
    username: '',
    userId: null,
    isAdmin: null,
    isAuthenticated: false
}

const SET_USER = 'SET_USER'

export function setUser (username, userId, isAdmin, isAuthenticated) {
    return {
        type: SET_USER,
        payload: {username, userId, isAdmin, isAuthenticated}
    }
}

export default function reducer (state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            const {username, userId, isAdmin, isAuthenticated} = action.payload
            return {...state, username, userId, isAdmin, isAuthenticated}
        default:
            return state
    }
}