
import axios from 'axios'
import { setCurrentPlaylist, setCurrentRoom, setPlaylists } from '../redux/reducers/gameReducer'


export const newGame = async (e, userId) => {
    const { name, id, spotifyid } = e.target.dataset
    console.log(name, id, spotifyid)
    setCurrentPlaylist({
        playlistName: name,
        playlistId: id,
        spotifyId: spotifyid
    })
    const game = await axios.post('/api/game/newGame', { userId, playlist: name, playlist_id: id })
    const { game_id } = game.data
    setCurrentRoom(game_id)
    return await game_id
}

// export const joinGame = async () => {
//     const {data} = await axios.get(`/api/game/${joinGameInput}`)
//     const {game_id, playlist, playlist_id} = data

//     setCurrentRoom(game_id)
//     setCurrentPlaylist({playlistName: playlist, playlistId: playlist_id})
//     props.history.push(`/game/${game_id}`)
// }