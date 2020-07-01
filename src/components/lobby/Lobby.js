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

        socket.on('playAgain', () => {

        })

        return () => {
            socket.emit('leaveRoom', { gameId: currentRoom, username: props.auth.username, socketId: socket.id })
            socket.off()
        }
    }, [props.game, props.auth.username])

    useEffect(() => {
        let redirectTimer

        socket.on('gameInProgress', () => {
            setGameState('inProgress')
             redirectTimer = setTimeout(() => props.history.push('/dashboard'), 2000)
        })
        socket.on('tooManyPlayers', () => {
            setGameState('tooManyPlayers')
            redirectTimer = setTimeout(() => props.history.push('/dashboard'), 2000)
        })

        return clearTimeout(redirectTimer)

    }, [props.history])

    useEffect(() => {
        socket.on('sendSongs', (sentSongs) => {
            setCurrentSongObj(sentSongs.currentSongObj)
        })

    }, [currentSongObj])

    const usersMap = users.map((user, index) => {
        if (gameState === 'game' && index === 0) {
            return (
                <div className='user-container' key={index}>
                    <p >{user.username}</p>
                    <img className='leader-icon' src={crownIcon} alt='leader!' />
                </div>
            )
        } else {
            return (
                <div className='user-container' key={index}>
                    <p >{user.username}</p>
                </div>
            )
        }
    })

    return (
        <div className='lobby-outer-container'>
            <div className='lobby-inner-container'>
                <div className='side-bar-left'>
                    <div className='playlist-info'>
                        <h2 className='side-bar-title'>Playlist</h2>
                        <img src={props.game.currentPlaylist.playlistImg} alt='playlist' />
                        <p>{props.game.currentPlaylist.playlistName}</p>
                    </div>
                    {gameState === 'lobby' &&
                    <div className='game-start'>
                     <button className='button' onClick={() => startGame()}>Start game</button>
                    <h1>Game number: {props.game.currentRoom}</h1>
                     </div>
                     }
                    <div className='users-container'>
                        <h2 className='side-bar-title'>Users</h2>
                        <div className='users-map-container'>
                            {usersMap}
                        </div>
                    </div>
                </div>
                {gameOver &&
                    <div className='game-over-container'>
                        <p>And the winner is: </p>
                        <p>{users[0].username}!</p>
                        <button className='button' onClick={() => props.history.push('/dashboard')} >Dashboard</button>
                    </div>
                }
                {gameState === 'game' && <SocketGame users={users} gameInfo={{ socketId: socket.id, gameId: props.game.currentRoom }} currentSongObj={currentSongObj} socket={socket} />}
                {gameState === 'inProgress' && <h1 className='problem-message'>Sorry, this game has already started!</h1>}
                {gameState === 'tooManyPlayers' && <h1 className='problem-message'>Sorry, this game is full!</h1>}
            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps)(Lobby)