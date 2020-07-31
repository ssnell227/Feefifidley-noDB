
const initialState = {
    username: '',
    isAuthenticated: false
}

const SET_USER = 'SET_USER'

export function setUser (username,isAuthenticated) {
    return {
        type: SET_USER,
        payload: {username,isAuthenticated}
    }
}

export default function reducer (state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            const {username, isAuthenticated} = action.payload
            return {...state, username, isAuthenticated}
        default:
            return state
    }
}