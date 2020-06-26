const {addRoom, addUser, removeUser, getUsersInRoom, getGameData, getRoom, removeRoom, runGame } = require('./game')

module.exports = function (io) {
    io.on('connection',  (socket) => {

        socket.on('join', (userObj, cb) => {
            const { username, gameId, playlistName, playlistId, spotifyId} = userObj
            socket.join(gameId)



            
            //if room exists, add user to room, else, create room
            if (getRoom(gameId) && !getRoom(gameId).playing) {
                addUser({gameId, username, socketId: socket.id})
                io.in(gameId).emit('roomData', {users: getUsersInRoom(gameId)})
            } else if(getRoom(gameId) && getRoom(gameId).playing) {
                io.in(gameId).emit('gameInProgress')
            }else {
                addRoom(userObj, socket.id).then(() => io.in(gameId).emit('roomData', {users: getUsersInRoom(gameId)}))
            }

            socket.on('startGame', () => {
                getRoom(gameId).playing = true
                io.in(gameId).emit('begin')
                runGame(io, gameId)
            })
            

            // remove user from users array and resend room data to other users in room.  If no users in room, remove the room
            socket.on('leaveRoom', (leaveObj) => {
                removeUser(leaveObj)
                io.in(leaveObj.gameId).emit('roomData', {users: getUsersInRoom(leaveObj.gameId)})
                if (!getUsersInRoom(leaveObj.gameId).length) {
                    removeRoom(leaveObj.gameId)
                    
                }
            })
            socket.on('disconnect', () => {
                removeUser({gameId, socketId: socket.id})
                io.in(gameId).emit('roomData', {users: getUsersInRoom(gameId)})
                if (!getUsersInRoom(gameId).length) {
                    removeRoom(gameId)
                }
            })
        })
    })
} 