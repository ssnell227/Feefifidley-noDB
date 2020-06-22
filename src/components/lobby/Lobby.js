import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'
import {connect} from 'react-redux'
const endpoint = '127.0.0.1:4000'

let socket;

const Lobby = (props) => {
    const [room, setRoom] = useState('')
    const [users, setUsers] = useState([])

    useEffect(() => {
        const {currentRoom} = props.game.currentRoom
        socket = io(endpoint)

        console.log(socket)

        setRoom(currentRoom)
        return () => {
            console.log('disconnect firing')
            socket.emit('disconnect')
            socket.off()
        }
    }, [])

    return (
        <div>
            Lobby
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps) (Lobby)