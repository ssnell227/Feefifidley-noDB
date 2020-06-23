import React, { useState } from 'react'
import { connect } from 'react-redux'
import {useSelector, useDispatch} from 'react-redux'
import { setUser } from '../../redux/reducers/authReducer'
import axios from 'axios'


const Auth = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const login = async (e) => {
        e.preventDefault()
        if (username && password) {
            const user = await axios.post('/api/auth/login', { username, password })
                .catch(err => console.log('Somethings gone wrong:', err))
            if (user) {
                const { user_id, isadmin } = user.data
                const isAuthenticated = true;
                dispatch(setUser(username, user_id, isadmin, isAuthenticated))
                
                props.history.push('/dashboard')
            }
        }
    }

    const register = async (e) => {
        e.preventDefault()
        if (username && password) {
            const newUser = await axios.post('/api/auth/register', { username, password })
                .catch(err => console.log('Somethings gone wrong:', err))

            const { user_id } = newUser.data
            const isAuthenticated = true

            dispatch(setUser(username, user_id, isAuthenticated))

            props.history.push('/dashboard')
        }
    }

    return (
        <div className='auth-outer-container'>
            <div className='auth-inner-container'>
                <h1>Project Name</h1>
                <form className='auth-form'>
                    <label>Username: <input onChange={(e) => setUsername(e.target.value)} /></label>
                    <label>Password: <input type='password' onChange={(e) => setPassword(e.target.value)} /></label>
                    <div className='auth-buttons'>
                        <input onClick={login} type='submit' value='Log In' />
                        <button onClick={register}>Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Auth