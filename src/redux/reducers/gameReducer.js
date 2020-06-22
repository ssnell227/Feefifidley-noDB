import axios from 'axios'

const initialState = {
    //hardcoded playlist ids for now
    playlistIds: ['37i9dQZF1DWWEJlAGA9gs0','67ZzN02NhQ4lQ5WodjJRJ0', "37i9dQZF1DX5Ejj0EkURtP", "37i9dQZF1DX4o1oenSJRJd", '37i9dQZF1DXbTxeAdrVG2l', '37i9dQZF1DX4UtSsGT1Sbe', '37i9dQZF1DWTJ7xPn4vNaz', '37i9dQZF1DXaKIA8E7WcJj'],
    currentPlaylist: {},
    currentRoom: '',
    highScores: [],
    loading: false
}

const SET_CURRENT_PLAYLIST = 'SET_CURRENT_PLAYLIST'
const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM'

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

export default function reducer (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_PLAYLIST:
            return {...state, currentPlaylist: action.payload}
        case SET_CURRENT_ROOM:
            return {...state, currentRoom: action.payload}
        default:
            return state
    }
}