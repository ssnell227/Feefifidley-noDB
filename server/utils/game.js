const axios = require('axios')

const rooms = []

const rounds = 5;
const dummySongs = 3

const getRandomSong = (tracksArray) => {
    let randomIndex = Math.floor(Math.random() * tracksArray.length - 1)
    return tracksArray.splice(randomIndex, 1)
}

const getGameData = async () => {
    const playlistItems = await axios.post('/api/spotify/getPlaylistItems',)
}

const runGame = async (io, gameId) => {
    const getReady = (io, gameId) => {
        const currentRoom = getRoom(gameId)
        currentRoom.counter = 5

        if (currentRoom) {
            return new Promise(res => {
                const getReadyTimer = setInterval(() => {
                    if (currentRoom.currentRound > rounds) {
                        return io.in(gameId).emit('gameOver')
                    } else if (currentRoom.counter > 0) {
                        io.in(gameId).emit('timerDecrement', { seconds: currentRoom.counter })
                        currentRoom.counter--
                    } else {
                        console.log('get ready', gameId)
                        clearInterval(getReadyTimer)
                        io.to(gameId).emit('switchMode')
                        guessSong(io, gameId)
                        res()
                    }
                }, 1000)
            })
        }
    }

    const guessSong = (io, gameId, songsObj) => {
        const currentRoom = getRoom(gameId)
        currentRoom.counter = 10

        return new Promise(res => {
            guessTimer = setInterval(() => {
                if (currentRoom.counter > 0) {
                    io.in(gameId).emit('timerDecrement', { seconds: currentRoom.counter })
                    currentRoom.counter--
                } else {
                    console.log('guessSong', gameId)
                    clearInterval(guessTimer)
                    io.in(gameId).emit('switchMode')
                    currentRoom.currentRound++
                    getReady(io, gameId)
                    res()
                }
            }, 1000)
        })
    }

    getReady(io, gameId)
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