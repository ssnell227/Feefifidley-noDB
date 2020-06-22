import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { setCurrentPlaylist, setCurrentRoom } from '../../redux/reducers/gameReducer'


const Dashboard = (props) => {
    const [playlists, setPlaylists] = useState([])
    const [highScores, setHighScores] = useState([])

    const getPlaylists = async () => {
        const playlistCalls = []
        props.game.playlistIds.forEach(playlistId => {
            playlistCalls.push(axios.post('http://localhost:4000/api/spotify/getPlaylist', { playlistId }))
        })
        const responseArray = await Promise.all(playlistCalls)
        return responseArray.map(item => item.data)
    }

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
        const game = await axios.post('/api/game/newGame', { userId: props.auth.userId, playlist: name })
        const { game_id } = game.data
        props.setCurrentRoom(game_id)
        props.history.push(`/game/${game_id}`)
    }

    useEffect(() => {
        getPlaylists().then(res => setPlaylists(res))
        getHighScores().then(res => setHighScores(res))
    }, [props.game.playlistIds])

    const playlistMap = playlists.map(item => <div className='playlist-card' key={item.id}>
        <img data-name={item.name} data-id={item.id} onClick={newGame} src={item.images[0].url} alt='playlist' />
        <p>{item.name}</p>
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
                <div className='high-scores-container'>
                    <h2>Your high scores</h2>
                    {highScoresMap}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

const mapDispatchToProps = {setCurrentPlaylist, setCurrentRoom}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)