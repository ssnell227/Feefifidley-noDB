import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
// import {getPlaylists} from '../../redux/reducers/gameReducer'

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
    useEffect( () => {
        getPlaylists().then(res => setPlaylists(res))
    }, [])

    return (
        <div className='dashboard-outer-container'>
            Dashboard
            <div className='dashboard-inner-container'>

            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps)(Dashboard)