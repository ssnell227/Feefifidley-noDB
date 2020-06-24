import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { setCurrentPlaylist, setCurrentRoom, setPlaylists } from '../../redux/reducers/gameReducer'


const Dashboard = (props) => {
    const [highScores, setHighScores] = useState([])
    const [joinGameInput, setJoinGameInput] = useState([])


    const getHighScores = async () => {
        const highScores = await axios.get(`http://localhost:4000/api/game/getUserHighScores/${props.auth.userId}`)
        return highScores.data
    }

    const newGame = async (e) => {
        const { name, id } = e.target.dataset
        props.setCurrentPlaylist({
            playlistName: name,
            playlistId: id
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
        getHighScores().then(res => setHighScores(res))
    }, [props.game.playlistIds])

    const playlistMap = props.game.playlists.map(item => <div className='playlist-card' key={item.id}>
        <img onClick={(e) => newGame(e)} data-name={item.playlist_name} data-id={item.id} src={item.img_url} alt='playlist' />
        <p>{item.playlist_name}</p>
    </div>)

    const highScoresMap = highScores.map((item, index) => <div key={index}>
        <p>{item.playlist}</p>
        <p>{item.score}</p>
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
                <div className='high-scores-container'>
                    <h2>Your high scores</h2>
                    {highScoresMap}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

const mapDispatchToProps = { setCurrentPlaylist, setCurrentRoom, setPlaylists }

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)