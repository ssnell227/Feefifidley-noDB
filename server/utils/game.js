const axios = require('axios')

const rooms = []

const rounds = 5;
const dummySongs = 3

const getRandomSong = (tracksArray) => {
    let randomIndex = Math.floor(Math.random() * tracksArray.length -1)
    return tracksArray.splice(randomIndex, 1)
}

const addRoom = async ({username, gameId, playlistName, playlistId, spotifyId}) => {

    const {data} = await axios.post('http://localhost:4000/api/spotify/getPlaylistItems', { spotifyId })
    .catch(err => console.log(err))

    const withPreview = data.map(item => item.track).filter(item=> item.preview_url)

    
    //use getRandomSong to pull the 5 game tracks with 3 dummy tracks each for gameplay
    
    const getGameSongs = (songsArray) => {
        const songsArrayCopy = [...songsArray]
        const gameSongs = []
        const gameObjs = []

        for (let i=0; i<rounds; i++) {
            gameSongs.push(getRandomSong(songsArrayCopy)[0])
        }

        gameSongs.forEach(song => {
            const dummyArray = []
            for (let i=0; i < dummySongs; i++) {
                dummyArray.push(getRandomSong(songsArrayCopy)[0])
            }
            gameObjs.push({song, dummyArray})
        })

        return gameObjs
    }

    rooms.push({
        gameId,
        users: [username],
        playlistName,
        playlistId,
        spotifyId,
        gameObjs: getGameSongs(withPreview)
    })
    console.log(rooms[0].gameObjs)
}

const removeRoom = ({gameId}) => {
    const index = rooms.findIndex(room => room.gameId === gameId)
    rooms.splice(index, 1)
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