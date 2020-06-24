require('dotenv').config()

const express = require('express'),
    massive = require('massive'),
    session = require('express-session'),
    axios = require('axios'),
    cors = require('cors'),
    http = require('http')

const authCtrl = require('./controllers/authControl'),
    gameCtrl = require('./controllers/gameControl'),
    playlistCtrl = require('./controllers/playlistControl'),
    spotifyCtrl = require('./controllers/spotifyControl'),
    { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

const app = express()




app.use(express.json())
app.use(cors())
app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    secret: SESSION_SECRET
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
})
    .then(db => {
        app.set('db', db)
        console.log('db connected')
    })
    .catch(err => {
        console.log('Could not connect to db:')
        console.log(err)
        process.end()
    })



const server = app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`))

const io = require('socket.io')(server)
require('./utils/sockets')(io)

//auth endpoints

app.post('/api/auth/register', authCtrl.register)

app.post('/api/auth/login', authCtrl.login)

app.post('/api/auth/logout', authCtrl.logout)

//game endpoints

app.post('/api/game/newGame', gameCtrl.newGame)

app.put('/api/game/updateGame', gameCtrl.updateGame)

app.get('/api/game/:gameId', gameCtrl.getGameById)

app.get('/api/game/getUserHighScores/:userId', gameCtrl.getUserHighScores)

app.delete('/api/game/deleteGame', gameCtrl.deleteGame)

//playlist endpoints

app.get('/api/playlists', playlistCtrl.getPlaylists)

app.post('/api/playlists', playlistCtrl.addPlaylist)

app.delete('/api/playlists/:playlistId', playlistCtrl.removePlaylist)

//spotify endpoints

app.post('/api/spotify/getPlaylist', spotifyCtrl.getPlaylist)

app.post('/api/spotify/getPlaylistItems', spotifyCtrl.getPlaylistItems)

app.post('/api/spotify/playlistSearch', spotifyCtrl.playlistSearch)
