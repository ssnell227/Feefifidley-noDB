import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { setCurrentPlaylist } from '../../redux/reducers/gameReducer'
import gameplay from '../../utils/gameplay'
import Countdown from 'react-countdown'

const Game = (props) => {
    const [playlistItems, setPlaylistItems] = useState([])
    const [gameState, setGamestate] = useState('pre')
    const [playing, setPlaying] = useState(false)
    const [currentSong, setCurrentSong] = useState('')
    const [songsPlayed, setSongsPlayed] = useState([])

    const getPlaylistItems = async () => await axios.post('/api/spotify/getPlaylistItems', { playlistId: props.game.currentPlaylist.playlistId })

    const playingTimerCallback = () => {
        songsPlayed.length < 5 ? setPlaying(!playing) : setGamestate('post')
    }

    const restart = () => {
        setPlaying(false)
        setGamestate('game')
        setSongsPlayed([])
    }

    const getSong = () => {
        //currently broken
        const withPreview = playlistItems.filter(item => item.track.preview_url)
        const randomIndex = Math.floor(Math.random()) * withPreview.length -1
        const audioUrl = withPreview[randomIndex].track.preview_url
        setCurrentSong(withPreview[randomIndex].track.name)
        return (
            <audio autoPlay src={audioUrl}/>
        )
    }

    useEffect(() => {
        getPlaylistItems().then(res => setPlaylistItems(res.data))

        return () => {
            props.setCurrentPlaylist({})
        }
    }, [])
    return (
        <div className='game-outer-container'>
            <div className='game-inner-container'>
                <p>{props.game.currentPlaylist.playlistName}</p>
                {gameState === 'pre' &&
                    <div>
                        <p>Ready?</p>
                        <button onClick={() => setGamestate('game')}>Start</button>
                    </div>}
                {gameState === 'game' && playing === false &&
                    <div>
                        <Countdown onComplete={() => setPlaying(!playing)} date={Date.now() + 5000} />
                    </div>}
                {gameState === 'game' && playing === true &&
                    <div>
                        <Countdown onMount={() => setSongsPlayed(...songsPlayed, currentSong)} onComplete={playingTimerCallback} date={Date.now() + 10000} />
                        {getSong()}
                    </div>}
                {gameState === 'post' &&
                    <div>
                        <p>Finished</p>
                        <button onClick={()=> restart()}>Play again?</button>
                    </div>
                }
                
            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps, { setCurrentPlaylist })(Game)