module.exports = {
    getPlaylists: async (req, res) => {
        const db = req.app.get('db')

        const games = await db.get_all_playlists()

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

        await db.loaded_playlists.insert({playlist_name: playlistName, spotify_id: spotifyId, img_url: imgURL})

        res.sendStatus(201)
    },
    removePlaylist: async (req, res) => {
        const db = req.app.get('db')
        const {playlistId} = req.params

        await db.loaded_playlists.destroy({id: +playlistId})

        res.sendStatus(200)
    }
}