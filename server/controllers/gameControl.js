module.exports = {
    newGame: async (req, res) => {
        const db = req.app.get('db')
        const {playlist, userId} = req.body

        const {game_id} = await db.game.insert({playlist})

        await db.game_auth_link.insert({user_id: userId, game_id})

        res.status(200).send({game_id})
    },
    updateGame: async (req, res) => {
        //STILL BROKEN
        const db = req.app.get('db')
        const {gameId, score, songList} = req.body

        await db.game.save({game_id: gameId, score: score, song_list: songList})

        res.sendStatus(200)
    },
    getUserHighScores: async (req, res) => {

    },
    deleteGame: async (req, res) => {

    },
}