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

        req.session.user = newUser
        delete req.session.user.hash
        res.status(201).send(req.session.user)
    },
    login: async (req, res) => {
        
    },
    logout: async (req, res) => {
        
    }
}