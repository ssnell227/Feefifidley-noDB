import axios from 'axios'

const initialState = {
    //hardcoded playlist ids for now
    playlistIds: ["37i9dQZF1DX4o1oenSJRJd", '37i9dQZF1DX4UtSsGT1Sbe'],
    playlists: [],
    highScores: [],
    loading: false
}

const GET_PLAYLISTS = 'GET_PLAYLISTS'
const _PENDING = '_PENDING'
const _FULFILLED = '_FULFILLED'
const _REJECTED = '_REJECTED'

export const getPlaylists = (playlistIds) => {
    //who knows whether this'll work
    let playlists
    const playlistCalls = []
    playlistIds.forEach(id => {
       playlistCalls.push(axios.get('/api/spotify/getPlaylist', {id}))
    })
    Promise.all(playlistCalls)
    

    return {
        type: GET_PLAYLISTS,
        payload: { playlists }
    }
}

export default function reducer (state = initialState, action) {
    switch (action.type) {
        case GET_PLAYLISTS + _PENDING:
            return {...state, loading: true}
        case GET_PLAYLISTS + _FULFILLED:
            const {playlists} = action.payload
            return {...state, loading: false, playlists}
        case GET_PLAYLISTS + _REJECTED:
            return {...state, loading: false}
        default:
            return state
    }
}