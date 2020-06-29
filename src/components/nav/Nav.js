import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter, Link } from 'react-router-dom'
import { setUser } from '../../redux/reducers/authReducer'
import { setCurrentRoom, setCurrentPlaylist } from '../../redux/reducers/gameReducer'

const Nav = (props) => {

    const logout = async () => {
        await axios.post('/api/auth/logout')
            .catch(err => console.log(err))
        props.setUser('', null, false, false)
        props.setCurrentPlaylist({})
        props.setCurrentRoom('')
        props.history.push('/')
    }

    return (
        <div className='nav-outer-container'>
            <div className='nav-inner-container'>
                <Link to='/dashboard'><p className='nav-title'>FeeFiFidley.io</p></Link>
                <div className='nav-buttons-container'>
                    {props.auth.isAdmin && <button className='button' onClick={() => props.history.push('/admin')}>Admin</button>}
                    <button className='button' onClick={() => props.history.push('/dashboard')}>Dashboard</button>
                    <button className='button' onClick={logout}>Log out</button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = reduxState => reduxState

const mapDispatchToProps = { setUser, setCurrentRoom, setCurrentPlaylist }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Nav))