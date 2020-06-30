module.exports = {
    getPlaylists: async (req, res) => {
        const db = req.app.get('db')

        const games = await db.loaded_playlists.where('current = true')

        res.status(200).send(games)
    },
    getPlaylistById: async (req, res) => {
        const db = req.app.get('db')
        const {playlistId} = req.params
        const playlist = await db.find({id: playlistId})
        res.status(200).send(playlist)
    },
    addPlaylist: async (req, res) => {
        const db = req.app.get('db')
        const {playlistName, spotifyId, imgURL} = req.body

        const [exists] = await db.loaded_playlists.where(`spotify_Id = '${spotifyId}'`)

        if (exists) {
            db.loaded_playlists.save({id: exists.id, current: true})
            return res.sendStatus(200)
        }

        await db.loaded_playlists.insert({playlist_name: playlistName, spotify_id: spotifyId, img_url: imgURL})

        res.sendStatus(201)
    },
    removePlaylist: async (req, res) => {
        const db = req.app.get('db')
        const {playlistId} = req.params

        await db.loaded_playlists.save({id: +playlistId, current: false})

        res.sendStatus(200)
    }
}