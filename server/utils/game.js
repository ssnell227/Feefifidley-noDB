const axios = require('axios')

const rooms = []

const addRoom = ({username, gameId, playlist, spotifyId}) => {
    rooms.push({
        gameId,
        users: [username],
        playlist,
        spotifyId
    })
}

const addUser = ({gameId, username}) => {
    const users = rooms.find(room => room.gameId === gameId).users

    users.push(username)
}

const removeUser = ({username, gameId}) => {
    const users = rooms.find(room => room.gameId === gameId).users
    
    const index = users.findIndex(user =>  user === username)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (username) => {
    
}

const getRoom = (gameId) => {
    return rooms.find(room => room.gameId === gameId)
}

const getUsersInRoom = (gameId) => {
   return rooms.find(room => room.gameId === gameId).users
}

const getGameData = async () => {
    const playlistItems = await axios.post('/api/spotify/getPlaylistItems', )
}

module.exports = {getRoom, addRoom, addUser, removeUser, getUser, getUsersInRoom, getGameData}