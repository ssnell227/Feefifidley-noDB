import React, { useState } from 'react'
import {useDispatch} from 'react-redux'
import { setUser } from '../../redux/reducers/authReducer'
import axios from 'axios'


const Auth = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [incorrectInfo, setIncorrectInfo] = useState(false)
    const [addUsername, setAddUsername] = useState(false)

    const dispatch = useDispatch()

    const login = async (e) => {
        e.preventDefault()
        if (username && password) {
            const user = await axios.post('/api/auth/login', { username, password })
                .catch(err => {
                    setIncorrectInfo(true)
                    console.log('Somethings gone wrong:', err)
            })
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
                .catch(err => {console.log('Somethings gone wrong:', err)})

            const { user_id } = newUser.data
            const isAuthenticated = true

            dispatch(setUser(username, user_id, null, isAuthenticated))

            props.history.push('/dashboard')
        }
    }

    const continueAsGuest = (e) => {
        e.preventDefault()
        if (username) {
            const isAuthenticated = true
            dispatch(setUser(username,null, null, isAuthenticated))
            props.history.push('/dashboard')
        }else {
            setAddUsername(true)
        }
        
    }

    return (
        <div className='auth-outer-container'>
            <div className='auth-inner-container'>
                <h1>FeeFiFidley.io!</h1>
                <p>A multiplayer music guessing game powered by the Spotify API</p>
                <p>Work in progress.</p>
                 <a href='https://github.com/ssnell227/FeeFiFidley.io'>Check out the GitHub here</a>
                <form className='auth-form'>
                    <label>Username: <input onChange={(e) => setUsername(e.target.value)} /></label>
                    <label>Password: <input type='password' onChange={(e) => setPassword(e.target.value)} /></label>
                    {incorrectInfo && <p>Incorrect username or password</p>}
                    {addUsername && <p>Enter a username</p>}
                    <div className='auth-buttons'>
                        <button className='button' onClick={login} type='submit' >Log in</button>
                        <button className='button' onClick={register}>Register</button>
                        <button className='button' onClick={continueAsGuest}>Continue as Guest</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Auth