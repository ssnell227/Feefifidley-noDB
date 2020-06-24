import axios from 'axios'

const initialState = {
    playlists: [],
    currentPlaylist: {},
    currentRoom: '',
    highScores: [],
    loading: false
}

const SET_CURRENT_PLAYLIST = 'SET_CURRENT_PLAYLIST'
const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM'
const SET_PLAYLISTS = 'SET_PLAYLISTS'

export const setCurrentPlaylist = (currentPlaylist) => {
    return {
        type: SET_CURRENT_PLAYLIST,
        payload: currentPlaylist
    }
}

export const setCurrentRoom = (gameId) => {
    return {
        type: SET_CURRENT_ROOM,
        payload: gameId
    }
}

export const setPlaylists = () => {
    const response = axios.get('/api/playlists')
    
    return {
        type: SET_PLAYLISTS,
        payload: response
    }
}

export default function reducer (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_PLAYLIST:
            return {...state, currentPlaylist: action.payload}
        case SET_CURRENT_ROOM:
            return {...state, currentRoom: action.payload}
        case SET_PLAYLISTS + '_PENDING':
            return {...state, loading: true}
        case SET_PLAYLISTS + '_REJECTED':
            return {...state, loading: false}
        case SET_PLAYLISTS + '_FULFILLED':
            return {...state, loading: false, playlists: action.payload.data}
        default:
            return state
    }
}