import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {setCurrentPlaylist} from '../../redux/reducers/gameReducer'

const Dashboard = (props) => {
    const [playlists, setPlaylists] = useState([])

    const getPlaylists = async () => {
        const playlistCalls = []
        props.game.playlistIds.forEach(playlistId => {
            playlistCalls.push(axios.post('http://localhost:4000/api/spotify/getPlaylist', {playlistId}))
         })
         const responseArray = await Promise.all(playlistCalls)
         return responseArray.map(item => item.data)
    }

    const newGame = async (e) => {
        const {name, id} = e.target.dataset
        props.setCurrentPlaylist({
            playlistName: name,
            playlistId: id
        })
        const game = await axios.post('/api/game/newGame')
        const {game_id} = game.data
        props.history.push(`/game/${game_id}`)
    }

    useEffect( () => {
        getPlaylists().then(res => setPlaylists(res))
    }, [props.game.playlistIds])

    const playlistMap = playlists.map(item => <div key={item.id}>
        <p>{item.name}</p>
        <img data-name={item.name} data-id={item.id} onClick={newGame} src={item.images[0].url} alt='playlist'/>
    </div>)

    return (
        <div className='dashboard-outer-container'>
            Dashboard
            <div className='dashboard-inner-container'>
            {playlistMap}
            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps, {setCurrentPlaylist})(Dashboard)