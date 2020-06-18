const axios = require('axios')
const { authenticate } = require('../utils/spotifyAuth')

module.exports = {
    getPlaylist: async (req, res) => {
        //get specified playlists and return playlist name and album art
        const { playlistId } = req.body
        const accessToken = await authenticate()
            .catch(err => console.log(err))
        const playlist = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}?fields=id,name,images`, { headers: { Authorization: 'Bearer ' + accessToken } })
            .catch(err => console.log(err))

        if (playlist) {
            const { id, name, images } = playlist.data

            res.status(200).send({ id, name, images })
        }
    },
    getPlaylistItems: async (req, res) => {
        const { playlistId } = req.body
        const accessToken = await authenticate()
            .catch(err => console.log(err))
        const items = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(album(name,images),artists,name,preview_url))`, { headers: { Authorization: 'Bearer ' + accessToken } })
            .catch(err => console.log(err))
        console.log(items)

        const tracks = items.data.items

        console.log(items)
        res.status(200).send(tracks)
    }
}