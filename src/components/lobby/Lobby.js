import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import SocketGame from '../game/SocketGame'
import { connect } from 'react-redux'
const endpoint = '127.0.0.1:4000'

let socket;

const Lobby = (props) => {
    const [users, setUsers] = useState([])
    const [gameState, setGameState] = useState('lobby')

    const startGame = () => {
        socket.emit('startGame')
    }
    
    useEffect(() => {
        const { currentRoom, currentPlaylist } = props.game
        
        socket = io(endpoint)

        socket.emit('join', {
            username: props.auth.username,
            gameId: currentRoom,
            playlistName: currentPlaylist.playlistName,
            playlistId: currentPlaylist.playlistId,
            spotifyId: currentPlaylist.spotifyId
        }, (err) => console.log(err))


        return () => {
            socket.emit('leaveRoom', { gameId: currentRoom, username: props.auth.username, socketId: socket.id })
            socket.off()
        }
    }, [endpoint])

    useEffect(() => {
        socket.on('roomData', ({ users }) => {
            const usernames = users.map(user => user.username)
            setUsers(usernames)
        })
    }, [])

    useEffect(() => {
        socket.on('begin', () => {
            setGameState('game')
        })
    }, [])

    useEffect(() => {
        socket.on('gameInProgress' , () => {
            setGameState('inProgress')
        })
    }, [])

    const usersMap = users.map((user, index) => <p key={index}>{user}</p>)

    return (
        <div className='lobby-outer-container'>
            <div className='lobby-inner-container'>
                <p>{props.game.currentPlaylist.playlistName}</p>
                {gameState === 'lobby' && <button onClick={() => startGame()}>Start game</button>}
                <div>
                    <h2>Users</h2>
                    {usersMap}
                </div>
                {gameState === 'game' && <SocketGame socket={socket}/>}
                {gameState ==='inProgress' && <h1>Sorry, this game has already started!</h1>}
            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps)(Lobby)