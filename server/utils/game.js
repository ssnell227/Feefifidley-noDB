const axios = require('axios')
const CronJob = require('cron').CronJob

const rooms = []

const rounds = 3;
const dummySongs = 3
const getReadySeconds = 5
const gameSeconds = 10

const getRandomSong = (tracksArray) => {
    let randomIndex = Math.floor(Math.random() * tracksArray.length - 1)
    return tracksArray.splice(randomIndex, 1)
}

const getGameData = async () => {
    const playlistItems = await axios.post('/api/spotify/getPlaylistItems',)
}

const runGame = async (io, gameId) => {
    const currentRoom = getRoom(gameId)
    currentRoom.counter = getReadySeconds

    io.in(gameId).emit('sendSongs', {currentSongObj: currentRoom.gameObjs})
    io.in(gameId).emit('nextRound')

    const getReadyTimer = new CronJob('*/1 * * * * *', () => {
        if (currentRoom.currentRound > rounds) {
            getReadyTimer.stop()
            return io.in(gameId).emit('gameOver')
        }else if (currentRoom.counter > 0) {
            io.in(gameId).emit('timerDecrement', { seconds: currentRoom.counter })
            currentRoom.counter--
        } else if (currentRoom.counter <= 0) {
            getReadyTimer.stop()
            console.log('switch to gamePlay')
            io.in(gameId).emit('switchMode')
            currentRoom.counter = gameSeconds
            gamePlayTimer.start() 
        }
    }) 
     
    const gamePlayTimer = new CronJob('*/1 * * * * *', () => {
        if (currentRoom.counter > 0) {
            io.in(gameId).emit('timerDecrement', { seconds: currentRoom.counter })
            currentRoom.counter--
        } else if (currentRoom.counter <=0) {
            gamePlayTimer.stop()
            currentRoom.currentRound ++  
            currentRoom.counter = getReadySeconds
            console.log('switch to getReady')
            io.in(gameId).emit('switchMode', {})
            io.in(gameId).emit('nextRound')
            getReadyTimer.start()
        }
    })
    getReadyTimer.start() 

}

//room functions

const getRoom = (gameId) => {
    return rooms.find(item => item.gameId === gameId)
}

const addRoom = async ({ username, gameId, playlistName, playlistId, spotifyId }, socketId) => {

    const { data } = await axios.post('http://localhost:4000/api/spotify/getPlaylistItems', { spotifyId })
        .catch(err => console.log(err))

    const withPreview = data.map(item => item.track).filter(item => item.preview_url)


    //use getRandomSong to pull the 5 game tracks with 3 dummy tracks each for gameplay

    const getGameSongs = (songsArray) => {
        const songsArrayCopy = [...songsArray]
        const gameSongs = []
        const gameObjs = []

        for (let i = 0; i < rounds; i++) {
            gameSongs.push(getRandomSong(songsArrayCopy)[0])
        }

        gameSongs.forEach(song => {
            const dummyArray = []
            for (let i = 0; i < dummySongs; i++) {
                dummyArray.push(getRandomSong(songsArrayCopy)[0])
            }
            gameObjs.push({ song, dummyArray })
        })

        return gameObjs
    }

    rooms.push({
        gameId,
        users: [{ username, socketId }],
        playlistName,
        playlistId,
        spotifyId,
        gameObjs: getGameSongs(withPreview),
        playing: false,
        currentRound: 1,
        counter: 0
    })
}

const removeRoom = ({ gameId }) => {
    const index = rooms.findIndex(item => item.gameId === gameId)
    rooms.splice(index, 1)
}

//user functions

const addUser = ({ gameId, username, socketId }) => {
    const users = rooms.find(item => item.gameId === gameId).users

    users.push({ username, socketId })
}

const removeUser = ({ gameId, socketId }) => {
    const users = rooms.find(item => item.gameId === gameId).users


    const index = users.findIndex(user => user.socketId === socketId)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}



const getUsersInRoom = (gameId) => {
    const users = rooms.find(item => item.gameId === gameId).users
    if (users) {
        return users
    }
}


module.exports = { getRoom, addRoom, removeRoom, addUser, removeUser, getUsersInRoom, getGameData, runGame }