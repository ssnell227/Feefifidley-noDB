import React, { useState } from 'react'
import { connect } from 'react-redux'
import { setUser } from '../../redux/reducers/authReducer'
import axios from 'axios'

const Auth = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const login = async (e) => {
        //is it that i'm using async await syntax?
        console.log('firing')
        e.preventDefault()
        if (username && password) {
            console.log('firing')
            const user = await axios.post('/api/auth/login', { username, password })
                .catch(err => console.log('Somethings gone wrong:', err))

            const { user_id } = user.data
            
            props.setUser(username, user_id)
        }
    }

    return (
        <div className='auth-outer-container'>
            <div className='auth-inner-container'>
                <h1>Project Name</h1>
                <form className='auth-form'>
                    <label>Username: <input onChange={(e) => setUsername(e.target.value)} /></label>
                    <label>Password: <input type='password' onChange={(e) => setPassword(e.target.value)} /></label>
                    <input onClick={login} type='submit' value='Log In' />
                    <button>Register</button>
                </form>
            </div>
        </div>
    )
}

export default connect(null, { setUser })(Auth)