import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import SocketGame from '../game/SocketGame'
import { connect } from 'react-redux'

import crownIcon from '../../images/crown-icon.svg'

const endpoint = '127.0.0.1:4000'

let socket;

const Lobby = (props) => {
    const [users, setUsers] = useState([])
    const [gameState, setGameState] = useState('lobby')
    const [currentSongObj, setCurrentSongObj] = useState({})
    const [gameOver, setGameOver] = useState(false)

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
        socket.on('sendSongs', (sentSongs) => {
            setCurrentSongObj(sentSongs.currentSongObj)
        })

    }, [currentSongObj])

    useEffect(() => {
        socket.on('roomData', ({ users }) => {
            try {
                const sortedUsers = users.map(user => {
                    const userScore = user.score.map(item => 1 + 1 / (item.date % 100000))
                    return { username: user.username, userScore }
                }).sort((a, b) => b.userScore - a.userScore)
                setUsers(sortedUsers)
            } catch {
                setUsers(users)
            }
        })
        socket.on('begin', () => {
            setGameState('game')
        })
        socket.on('gameOver', () => {
            setGameOver(true)
        })
        socket.on('gameInProgress', () => {
            setGameState('inProgress')
        })
    }, [])


    const usersMap = users.map((user, index) => {
        if (gameState === 'game' && index === 0) {
            return (
                <div key={index}>
                    <p >{user.username}</p>
                    <img className='leader-icon' src={crownIcon} alt='leader!' />
                </div>
            )
        } else {
            return (
                <div key={index}>
                    <p >{user.username}</p>
                </div>
            )
        }
    })

    return (
        <div className='lobby-outer-container'>
            <div className='lobby-inner-container'>
                <p>{props.game.currentPlaylist.playlistName}</p>
                {gameState === 'lobby' && <button onClick={() => startGame()}>Start game</button>}
                <div>
                    <h2>Users</h2>
                    {usersMap}
                    {gameOver &&
                        <div>
                            <p>Winner: {users[0].username}</p>
                            <button>Play again?</button>
                        </div>
                    }
                </div>
                {gameState === 'game' && <SocketGame users={users} gameInfo={{ socketId: socket.id, gameId: props.game.currentRoom }} currentSongObj={currentSongObj} socket={socket} />}
                {gameState === 'inProgress' && <h1>Sorry, this game has already started!</h1>}
            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps)(Lobby)