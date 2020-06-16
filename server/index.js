require('dotenv').config()

const express = require('express'),
    massive = require('massive'),
    session = require('express-session')

const authCtrl = require('./authControl'),
    gameCtrl = require('./gameControl'),
    spotifyCtrl = require('./spotifyControl'),
    { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

const app = express()

app.use(express.json())
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

app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`))

//auth endpoints

app.post('/api/auth/register', authCtrl.register)

app.post('/api/auth/login', authCtrl.login)

app.delete('/api/auth/logout', authCtrl.logout)

