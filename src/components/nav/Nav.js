import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import {setUser} from '../../redux/reducers/authReducer'
import {withRouter} from 'react-router-dom'

const Nav = (props) => {

    const logout = async () => {
        await axios.post('/api/auth/logout')
            .catch(err => console.log(err))
        props.setUser('', null)
        props.history.push('/')
    }

    return (
        <div className='nav-outer-container'>
            <div className='nav-inner-container'>
                <div className='nav-user-info'>
                    <p>{props.username}</p>
                </div>
                <button onClick={() => props.history.push('/dashboard')}>Dashboard</button>
                <button onClick={logout}>Log out</button>

            </div>
        </div>
    )
}

const mapStateToProps = reduxState => reduxState

export default connect(mapStateToProps, {setUser})(withRouter(Nav))