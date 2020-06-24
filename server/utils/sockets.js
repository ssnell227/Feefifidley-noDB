const {addRoom, addUser, removeUser, getUser, getUsersInRoom, getGameData, getRoom, removeRoom } = require('./game')

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
            
            //send out users in room to room
            // io.to(userObj.gameId).emit('roomData', {users: getUsersInRoom(userObj.gameId)})

            // pull data for game on initial join
            
            

            // remove user from users array and resend room data to other users in room.  If no users in room, remove the room
            socket.on('leaveRoom', (userObj) => {
                console.log('player disconnected')
                removeUser(userObj)
                io.to(userObj.gameId).emit('roomData', {users: getUsersInRoom(userObj.gameId)})
                if (!getUsersInRoom(userObj.gameId).length) {
                    removeRoom(userObj.gameId)
                }
            })
        })
    })
} 