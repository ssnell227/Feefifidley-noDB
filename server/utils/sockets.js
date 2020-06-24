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
                io.to(userObj.gameId).emit('roomData', {users: getUsersInRoom(userObj.gameId)})
            } else {
                addRoom(userObj).then(() => io.to(userObj.gameId).emit('roomData', {users: getUsersInRoom(userObj.gameId)}))
            }
            

            // remove user from users array and resend room data to other users in room.  If no users in room, remove the room
            socket.on('leaveRoom', (leaveObj) => {
                console.log('player disconnected')
                removeUser(leaveObj)
                io.to(leaveObj.gameId).emit('roomData', {users: getUsersInRoom(leaveObj.gameId)})
                if (!getUsersInRoom(leaveObj.gameId).length) {
                    removeRoom(leaveObj.gameId)
                }
            })
        })
    })
} 