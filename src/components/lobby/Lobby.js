import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'
import {connect} from 'react-redux'
const endpoint = '127.0.0.1:4000'

let socket;
 
const Lobby = (props) => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const {currentRoom, currentPlaylist} = props.game
        socket = io(endpoint)

        socket.emit('join', {
            username: props.auth.username,
            gameId: currentRoom,
            playlist: currentPlaylist.playlist_name,
            spotifyId: currentPlaylist.spotifyId
        }, (err) => console.log(err))


        return () => {
            socket.emit('leaveRoom', {gameId: currentRoom, username: props.auth.username})
            socket.off()
        }
    }, [endpoint])

    useEffect(() => {
        socket.on('roomData', ({users}) => {
            setUsers(users)
        })
    }, [])

    const usersMap = users.map((user, index) => <p key={index}>{user}</p>)

    return (
        <div>
            <p>{props.game.currentPlaylist.playlistName}</p>
            <button>Start game</button>
            <div>
                <h2>Users</h2>
                {usersMap}
            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps) (Lobby)