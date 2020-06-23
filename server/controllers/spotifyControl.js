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

        if (items) {
            const tracks = items.data.items

            res.status(200).send(tracks)
        }
    },
    playlistSearch: async (req, res) => {
        const db = req.app.get('db')
        const { formattedQuery } = req.body
        const accessToken = await authenticate()
            .catch(err => console.log(err))

        const searchObjects = await axios.get(`https://api.spotify.com/v1/search?q=${formattedQuery}&type=playlist&limit=10`, {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        })
            .catch(err=> console.log("error", err))
        if (searchObjects) {
            const playlists = searchObjects.data.playlists.items.map(item => {
               return {
                   spotify_id: item.id,
                   name: item.name,
                    img_url: item.images[0].url
                }
            })
            
           res.status(200).send(playlists)
        }
    }
}