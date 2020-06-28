import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { setCurrentPlaylist, setCurrentRoom, setPlaylists } from '../../redux/reducers/gameReducer'


const Dashboard = (props) => {
    const [joinGameInput, setJoinGameInput] = useState([])

    const newGame = async (e) => {
        const { name, id, spotifyid } = e.target.dataset
        props.setCurrentPlaylist({
            playlistName: name,
            playlistId: id,
            spotifyId: spotifyid
        })
        const game = await axios.post('/api/game/newGame', { userId: props.auth.userId, playlist: name, playlist_id: id })
        const { game_id } = game.data
        props.setCurrentRoom(game_id)
        props.history.push(`/game/${game_id}`)
    }

    const joinGame = async () => {
        const {data} = await axios.get(`/api/game/${joinGameInput}`)
        const {game_id, playlist, playlist_id} = data

        props.setCurrentRoom(game_id)
        props.setCurrentPlaylist({playlistName: playlist, playlistId: playlist_id})
        props.history.push(`/game/${game_id}`)
    }

    useEffect(() => {
        props.setPlaylists()
    }, [props.game.playlistIds])

    const playlistMap = props.game.playlists.map(item => <div className='playlist-card' key={item.id}>
        <img onClick={(e) => newGame(e)} data-name={item.playlist_name} data-id={item.id} data-spotifyid={item.spotify_id} src={item.img_url} alt='playlist' />
        <p>{item.playlist_name}</p>
    </div>)

    

    return (
        <div className='dashboard-outer-container'>
            <div className='dashboard-inner-container'>
                <div className='playlist-map-container'>
                    {playlistMap}
                </div>
                <div>
                    <h2>Join game</h2>
                    <input onChange={(e) => setJoinGameInput(e.target.value)}/>
                    <button onClick={() => joinGame()}>Join</button>
                </div>
                
            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

const mapDispatchToProps = { setCurrentPlaylist, setCurrentRoom, setPlaylists }

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)