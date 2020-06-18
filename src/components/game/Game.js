import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'

const Game = (props) => {
    const [playlistItems, setPlaylistItems] = useState([])

    const getPlaylistItems = async () => await axios.post('/api/spotify/getPlaylistItems', {playlistId: props.game.currentPlaylist.playlistId})

    useEffect(() => {
        getPlaylistItems().then(res => setPlaylistItems(res.data))
    }, [])
    return (
        <div className='game-outer-container'>
            <div className='game-inner-container'>

            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps)(Game)