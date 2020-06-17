import React, {useEffect} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {getPlaylists} from '../../redux/reducers/gameReducer'

const Dashboard = (props) => {
    useEffect(() => {
        props.getPlaylists(props.game.playlistIds)
    }, [props.playlists, props.playlistIds])

    return (
        <div className='dashboard-outer-container'>
            Dashboard
            <div className='dashboard-inner-container'>

            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps, {getPlaylists})(Dashboard)