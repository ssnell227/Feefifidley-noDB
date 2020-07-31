import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/reducers/authReducer'


const Auth = (props) => {
    const [username, setUsername] = useState('')
    const [addUsername, setAddUsername] = useState(false)

    const dispatch = useDispatch()

    

    const continueAsGuest = (e) => {
        e.preventDefault()
        if (username) {
            const isAuthenticated = true
            dispatch(setUser(username, isAuthenticated))
            props.history.push('/dashboard')
        } else {
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
                    {addUsername && <p>Enter a username</p>}
                    <div className='auth-buttons'>
                        <button className='button' onClick={continueAsGuest}>Continue as Guest</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Auth