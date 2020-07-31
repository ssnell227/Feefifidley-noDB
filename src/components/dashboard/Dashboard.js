import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import createHash from 'hash-generator'
import { setCurrentPlaylist, setCurrentRoom, setPlaylists } from '../../redux/reducers/gameReducer'


const Dashboard = (props) => {
    const [joinGameInput, setJoinGameInput] = useState([])

    const {setCurrentPlaylist, setCurrentRoom, setPlaylists} = props

    const newGame = async (e) => {
        const { name, id, spotifyid, img } = e.target.dataset
        setCurrentPlaylist({
            playlistName: name,
            playlistId: id,
            spotifyId: spotifyid,
            playlistImg: img
        })
        // const game = await axios.post('/api/game/newGame', { userId: props.auth.userId, playlist: name, playlist_id: id })
        // const { game_id } = game.data
        const gameHash = createHash(10)
        setCurrentRoom(gameHash)
        props.history.push(`/game/${gameHash}`)
    }

    const joinGame = async () => {
        // const { data } = await axios.get(`/api/game/joinGameInfo/${joinGameInput}`)
        // const { game_id, playlist_name, id, img_url } = data

        setCurrentRoom(joinGameInput)
        // setCurrentPlaylist({ playlistName: playlist_name, playlistId: id, playlistImg: img_url })
        props.history.push(`/game/${joinGameInput}`)
    }

    useEffect(() => {
        setPlaylists()
    }, [props.game.playlistIds, setPlaylists])

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