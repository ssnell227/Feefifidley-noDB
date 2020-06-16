//spotify authorization

require('dotenv').config()

const axios = require('axios')

const { CLIENT_ID, CLIENT_SECRET } = process.env

var authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: 'grant_type=client_credentials',
    headers: {
        'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    json: true
};


module.exports = {
    authenticate: async () => {
        const access = await axios.default(authOptions)
        return access.data.access_token
    }
}