require('dotenv').config()
const {LOCAL_HOST, SERVER_PORT} = process.env
const axios = require('axios')
const CronJob = require('cron').CronJob

const rooms = []

const rounds = 4;
const dummySongs = 3
const getReadySeconds = 3
const gameSeconds = 10

const getRandomSong = (tracksArray) => {
    let randomIndex = Math.floor(Math.random() * tracksArray.length - 1)
    return tracksArray.splice(randomIndex, 1)
}

const calculateWinner = (userArray) => {
    const winner = userArray.map(user => {
        const userScore = user.score.map(item => 1 + 1 / (item.date % 100000))
        return { username: user.username, userScore }
    }).sort((a, b) => b.userScore - a.userScore)[0]
    return winner.username
}

const runGame = async (io, gameId) => {

    const currentRoom = getRoom(gameId)
    currentRoom.counter = getReadySeconds

    io.in(gameId).emit('nextRound')

    const getReadyTimer = new CronJob('*/1 * * * * *', () => {
        if (!getUsersInRoom(gameId)) {
            return getReadyTimer.stop()
        } else if (currentRoom.counter > 0) {
            io.in(gameId).emit('timerDecrement', { seconds: currentRoom.counter })
            currentRoom.counter--
        } else if (currentRoom.counter <= 0) {
            getReadyTimer.stop()
            io.in(gameId).emit('switchMode')
            currentRoom.counter = gameSeconds
            io.in(gameId).emit('timerDecrement', { seconds: currentRoom.counter })
            currentRoom.counter--
            gamePlayTimer.start()
        }
    })

    const gamePlayTimer = new CronJob('*/1 * * * * *', () => {
        if (!getUsersInRoom(gameId)) {
            return gamePlayTimer.stop()
        } else if (currentRoom.counter > 0) {
            io.in(gameId).emit('timerDecrement', { seconds: currentRoom.counter })
            currentRoom.counter--
        } else if (currentRoom.currentRound >= rounds) {
            gamePlayTimer.stop()
            
            const userList = currentRoom.users.map(user => user.username).join('#')
            
            const songList = currentRoom.gameObjs.map(round => round.song.name).join('#')
            
            const winner = calculateWinner(currentRoom.users)
            io.in(gameId).emit('gameOver', {winner})
            try {
                axios.put(`http://${LOCAL_HOST}:${SERVER_PORT}/api/game/updateGame`, { gameId, userList, songList, winner })
            } catch (err) {
                console.log(err)
            }
            return 

        }  else if (currentRoom.counter <= 0) {
            gamePlayTimer.stop()
            currentRoom.currentRound++
            currentRoom.counter = getReadySeconds
            io.in(gameId).emit('switchMode', {})
            io.in(gameId).emit('nextRound')
            io.in(gameId).emit('timerDecrement', { seconds: currentRoom.counter })
            currentRoom.counter--
            getReadyTimer.start()
        }
    })
    getReadyTimer.start()

}

const changeScore = ({ gameId, socketId, correctSong, date }) => {

    const users = getUsersInRoom(gameId)

    const user = users.find(user => user.socketId === socketId)

    if (!user.score.includes(correctSong)) {
        user.score.push({ correctSong, date })
    }
}

//room functions

const getRoom = (gameId) => {
    return rooms.find(item => item.gameId === gameId)
}

const addRoom = async ({ username, gameId, playlistName, playlistId, spotifyId }, socketId, io) => {

    const { data } = await axios.post(`http://${LOCAL_HOST}:${SERVER_PORT}/api/spotify/getPlaylistItems`, { spotifyId })
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
            song.correct = true
            for (let i = 0; i < dummySongs; i++) {
                dummyArray.push(getRandomSong(songsArrayCopy)[0])
            }
            dummyArray.forEach(item => item.correct = false)
            gameObjs.push({ song, dummyArray })
        })

        return gameObjs
    }

    rooms.push({
        gameId,
        users: [{ username, socketId, score: [] }],
        playlistName,
        playlistId,
        spotifyId,
        gameObjs: getGameSongs(withPreview),
        playing: false,
        currentRound: 1,
        counter: 0
    })

    io.in(gameId).emit('sendSongs', { currentSongObj: getRoom(gameId).gameObjs })
}

const removeRoom = ({ gameId }) => {
    const index = rooms.findIndex(item => item.gameId === gameId)
    rooms.splice(index, 1)
}

//user functions

const addUser = ({ gameId, username, socketId }, io) => {
    const currentRoom = getRoom(gameId)
    const users = rooms.find(item => item.gameId === gameId).users

    users.push({ username, socketId, score: [] })

    console.log(currentRoom.gameObjs)

    io.in(gameId).emit('sendSongs', { currentSongObj: currentRoom.gameObjs })
}

const removeUser = ({ gameId, socketId }) => {
    try {
        const users = rooms.find(item => item.gameId === gameId).users


        const index = users.findIndex(user => user.socketId === socketId)

        if (index !== -1) {
            return users.splice(index, 1)[0]
        }
    } catch {
        
    }
}

const getUsersInRoom = (gameId) => {
    try {
        return rooms.find(item => item.gameId === gameId).users
    } catch {
        return false
    }
}


module.exports = { getRoom, addRoom, removeRoom, addUser, removeUser, getUsersInRoom, runGame, changeScore }