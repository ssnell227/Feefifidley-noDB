module.exports = function (io) {
    io.on('connection',  (socket) => {
        console.log('player connected')
        socket.on('disconnect', () => {
            console.log('player disconnected')
        })
    })
}