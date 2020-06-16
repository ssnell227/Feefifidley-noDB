const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const {username, password} = req.body

        const [alreadyExists] = await db.users.find({username})

        if (alreadyExists) {
            return res.status(400).send('Username taken')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = await db.users.insert({username, hash})

        delete newUser.hash
        req.session.user = newUser
        res.status(201).send(req.session.user)
    },
    login: async (req, res) => {
        const db = req.app.get('db')
        const {username, password} = req.body

        const [user] = await db.users.find({username})

        if (!user) {
            return res.status(400).send('Username not found')
        }

        const authenticated = bcrypt.compareSync(password, user.hash)

        if (!authenticated) {
            return res.status(400).send('Incorrect password')
        }

        delete user.hash
        req.session.user = user
        res.status(201).send(req.session.user)
    },
    logout: async (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}