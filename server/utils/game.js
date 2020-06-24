const axios = require('axios')

const rooms = []

const addRoom = async ({username, gameId, playlistName, playlistId, spotifyId}) => {

    const {data} = await axios.post('http://localhost:4000/api/spotify/getPlaylistItems', { spotifyId })
    .catch(err => console.log(err))
    rooms.push({
        gameId,
        users: [username],
        playlistName,
        playlistId,
        spotifyId,
        tracks: data
    })
    console.log(rooms.find(room => room.gameId === gameId))
}

const removeRoom = ({gameId}) => {
    const index = rooms.findIndex(room => room.gameId === gameId)
    rooms.splice(index, 1)
    console.log(rooms)
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
   const users = rooms.find(room => room.gameId === gameId).users
   if (users) {
       return users
   }
}

const getGameData = async () => {
    const playlistItems = await axios.post('/api/spotify/getPlaylistItems', )
}

module.exports = {getRoom, addRoom, removeRoom, addUser, removeUser, getUser, getUsersInRoom, getGameData}