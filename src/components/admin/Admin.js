import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

const Admin = (props) => {
    const [searchInput, setSearchInput] = useState('')
    const [playlists, setPlaylists] = useState([])
    const [searchPlaylists, setSearchPlaylists] = useState([])
    const [rerenderSwitch, setRerenderSwitch] = useState(true)



    const getPlaylists = async () => {
        const playlists = await axios.get('/api/playlists')
        setPlaylists(await playlists.data)
    }

    const removePlaylist = async (playlistId) => {
        await axios.delete(`/api/playlists/${playlistId}`)
        setRerenderSwitch(!rerenderSwitch)
    }

    const playlistSearch = async (e) => {
        setSearchInput(e.target.value)

        const formattedQuery = searchInput.replace(' ', '+')

        const searchObjects = await axios.post('/api/spotify/playlistSearch', { formattedQuery })

        searchInput !== '' ? setSearchPlaylists(await searchObjects.data) : setSearchPlaylists([])
    }

    const addPlaylist = async (playlistName, spotifyId, imgURL) => {
        await axios.post('/api/playlists', { playlistName, spotifyId, imgURL })
        setRerenderSwitch(!rerenderSwitch)
    }

    useEffect(() => {
        getPlaylists()
    }, [rerenderSwitch])


    const playlistMap = playlists.map(item => <div className='playlist-card' key={item.id}>
        <img data-name={item.playlist_name} data-id={item.id} src={item.img_url} alt='playlist' />
        <p>{item.playlist_name}</p>
        <button onClick={() => removePlaylist(item.id)}>Delete</button>
    </div>)

    const searchMap = searchPlaylists.map(item => <div className='playlist-card' key={item.spotify_id}>
        <img onClick={() => addPlaylist(item.name, item.spotify_id, item.img_url)} data-name={item.name} data-id={item.spotify_id} src={item.img_url} alt='playlist' />
        <p>{item.name}</p>
    </div>)

    return (
        <div className='admin-outer-container'>
            <div className='admin-inner-container'>
                <div className='saved-playlist-container'>
                    {playlistMap}
                </div>
                <input onChange={(e) => playlistSearch(e)} placeholder='search for a playlist' />
                <div className='search-playlist-container'>
                    {searchMap}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps)(Admin)