const axios = require('axios')
const {authenticate} = require('../utils/spotifyAuth')

module.exports = {
    getPlaylists: async (req, res) => {
        //get specified playlists and return playlist name and album art
        const {playlistId} = req.body
        const accessToken = await authenticate()
        .catch(err =>  console.log(err))
        console.log(accessToken)
        const playlist = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {headers:{Authorization: 'Bearer '+ accessToken}})
        .catch(err => console.log(err))
        console.log(playlist)

        const {id, name, images} = playlist.data

        res.status(200).send({id, name, images})
    },
    getPlaylistItems: async (req, res) => {
        //get items from specified playlists and return song name, artist name, album name, album art, and link to preview
    }
}