const {addRoom, addUser, removeUser, getUser, getUsersInRoom, getGameData, getRoom } = require('./game')

module.exports = function (io) {
    io.on('connection',  (socket) => {
        console.log('player connected')

        socket.on('join', (userObj, cb) => {
            const { username, gameId, playlist, spotifyId} = userObj
            socket.join(userObj.gameId)
            
            //if room exists, add user to room, else, create room
            if (getRoom(userObj.gameId)) {
                addUser({gameId, username})
            } else {
                addRoom(userObj)
            }
            // pull data for game on initial join
            
            //send out users in room
            io.to(userObj.gameId).emit('roomData', {users: getUsersInRoom(userObj.gameId)})
            

            // remove user from users array and resend room data to other users in room
            socket.on('leaveRoom', (userObj) => {
                console.log('player disconnected')
                removeUser(userObj)
                io.to(userObj.gameId).emit('roomData', {users: getUsersInRoom(userObj.gameId)})
            })
        })

    })
} 