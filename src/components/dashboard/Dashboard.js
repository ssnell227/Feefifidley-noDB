import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { setCurrentPlaylist, setCurrentRoom, setPlaylists } from '../../redux/reducers/gameReducer'


const Dashboard = (props) => {
    const [joinGameInput, setJoinGameInput] = useState([])

    const newGame = async (e) => {
        const { name, id, spotifyid, img } = e.target.dataset
        props.setCurrentPlaylist({
            playlistName: name,
            playlistId: id,
            spotifyId: spotifyid,
            playlistImg: img
        })
        const game = await axios.post('/api/game/newGame', { userId: props.auth.userId, playlist: name, playlist_id: id })
        const { game_id } = game.data
        props.setCurrentRoom(game_id)
        props.history.push(`/game/${game_id}`)
    }

    const joinGame = async () => {
        const { data } = await axios.get(`/api/game/${joinGameInput}`)
        const { game_id, playlist, playlist_id } = data

        props.setCurrentRoom(game_id)
        props.setCurrentPlaylist({ playlistName: playlist, playlistId: playlist_id })
        props.history.push(`/game/${game_id}`)
    }

    useEffect(() => {
        props.setPlaylists()
    }, [props.game.playlistIds])

    const playlistMap = props.game.playlists.map(item => <div className='playlist-card' key={item.id}>
        <img onClick={(e) => newGame(e)} data-name={item.playlist_name} data-id={item.id} data-img={item.img_url} data-spotifyid={item.spotify_id} src={item.img_url} alt='playlist' />
        <p>{item.playlist_name}</p>
    </div>)



    return (
        <div className='dashboard-outer-container'>
            <div className='dashboard-inner-container'>
                    <h2 className='game-title'>Join someone's game:</h2>
                <div className='join-game-container'>
                    <input placeholder='Game number' onChange={(e) => setJoinGameInput(e.target.value)} />
                    <button className='button' onClick={() => joinGame()}>Join</button>
                </div>
                <h2 className='game-title'>Click a playlist to start a new game:</h2>
                <div className='playlist-map-container'>
                    {playlistMap}
                </div>

            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

const mapDispatchToProps = { setCurrentPlaylist, setCurrentRoom, setPlaylists }

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)