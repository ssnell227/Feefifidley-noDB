import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { setUser } from '../../redux/reducers/authReducer'
import {setCurrentRoom, setCurrentPlaylist} from '../../redux/reducers/gameReducer'

const Nav = (props) => {

    const logout = async () => {
        await axios.post('/api/auth/logout')
            .catch(err => console.log(err))
        props.setUser('', null)
        props.setCurrentPlaylist({})
        props.setCurrentRoom('')
        props.history.push('/')
    }

    return (
        <div className='nav-outer-container'>
            <div className='nav-inner-container'>
                <img className='nav-logo' src='' alt='logo'/>
                <div className='nav-buttons-container'>
                    <button onClick={() => props.history.push('/dashboard')}>Dashboard</button>
                    <button onClick={logout}>Log out</button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = reduxState => reduxState

const mapDispatchToProps = {setUser, setCurrentRoom, setCurrentPlaylist}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Nav))