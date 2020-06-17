
const initialState = {
    //default names for dev
    username: 'Stephen',
    userId: 1000
}

const SET_USER = 'SET_USER'

export function setUser (username, userId) {
    return {
        type: SET_USER,
        payload: {username, userId}
    }
}

export default function reducer (state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            const {username, userId} = action.payload
            return {...state, username, userId}
        default:
            return state
    }
}