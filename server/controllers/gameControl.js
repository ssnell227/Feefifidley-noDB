module.exports = {
    newGame: async (req, res) => {
        const db = req.app.get('db')
        const { playlist, userId, playlist_id } = req.body

        const { game_id } = await db.game.insert({ playlist, playlist_id })

        await db.game_auth_link.insert({ user_id: userId, game_id })

        res.status(201).send({ game_id })
    },
    updateGame: async (req, res) => {
        const db = req.app.get('db')
        const { gameId, userList, songList, winner } = req.body
        await db.game.save({ game_id: gameId, user_list: userList, song_list: songList, winner})

        res.sendStatus(200)
    },
    getUserHighScores: async (req, res) => {
        const db = req.app.get('db')
        const { userId } = req.params

        const highScores = await db.get_high_scores(+userId)

        res.status(200).send(highScores)
    },
    deleteGame: async (req, res) => {
        const db = req.app.get('db')
        const { gameId } = req.body

        await db.game.destroy({ game_id: gameId })

        res.sendStatus(200)
    },
    getGameById: async (req, res) => {
        const db = req.app.get('db')

        const { gameId } = req.params

        const [game] = await db.game.find({ game_id: gameId })
        .catch(err => res.status(404).send(err))
        if (game) {
            res.status(200).send(game)
        }
    }
}