import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { setCurrentPlaylist } from '../../redux/reducers/gameReducer'
import Countdown from 'react-countdown'

const Game = (props) => {
    const [playlistItems, setPlaylistItems] = useState([])
    const [gameState, setGamestate] = useState('pre')
    const [playing, setPlaying] = useState(false)
    const [currentSong, setCurrentSong] = useState('')
    const [songsPlayed, setSongsPlayed] = useState([])
    const [input, setInput] = useState('')
    const [timerStart, setTimerStart] = useState('')
    const [score, setScore] = useState(0)

    const getPlaylistItems = async () => await axios.post('/api/spotify/getPlaylistItems', { playlistId: props.game.currentPlaylist.playlistId })

    const gameEnd = async () => {
        setGamestate('post')
        const songsPlayedString = songsPlayed.map(item => `${item.name} | ${item.artist}`).join(',')
        await axios.put('/api/game/updateGame', {
            gameId: props.match.params.gameId,
            score,
            songList: songsPlayedString
        })
        .catch(err => console.log(err))
    }

    const playingTimerCallback = () => {
        songsPlayed.length < 5 ? setPlaying(!playing) : gameEnd()
    }


    const restart = () => {
        setPlaying(false)
        setGamestate('game')
        setSongsPlayed([])
        setInput('')
        setScore(0)
    }

    const checkInput = (e) => {
        setInput(e.target.value)
        const simplifyTrackName = () => {
            return currentSong.name.includes(' - ') ? currentSong.name.slice(0, currentSong.name.indexOf(' - ')).toLowerCase() : currentSong.name.toLowerCase()
        }
        const simpleTrackName = simplifyTrackName()

        if (input === simpleTrackName.slice(0, simpleTrackName.length - 1)) {
            songsPlayed.length < 5 ? setPlaying(!playing) : setGamestate('post')
            setScore(score + 1)
        }
    }

    const getSong = () => {
        const withPreview = playlistItems.filter(item => item.track.preview_url)
        const randomIndex = Math.floor(Math.random() * (withPreview.length - 1))
        const currentSong = {
            name: withPreview[randomIndex].track.name,
            artist: withPreview[randomIndex].track.artists[0].name,
            url: withPreview[randomIndex].track.preview_url
        }

        setCurrentSong(currentSong)
        setSongsPlayed([...songsPlayed, currentSong])
        setTimerStart(Date.now())
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
                        
                            <p>{currentSong.name}</p>
                            <p>{currentSong.artist}</p>
                        
                    </div>}
                {gameState === 'game' && playing === true &&
                    <div>
                        <Countdown onMount={() => getSong()} onComplete={playingTimerCallback} date={timerStart + 10000} />
                        <audio autoPlay src={currentSong.url} />
                        <input autoFocus onChange={(e) => checkInput(e)} />
                    </div>}
                {gameState === 'post' &&
                    <div>
                        <p>{songsPlayed[songsPlayed.length -1].name}</p>
                        <p>{songsPlayed[songsPlayed.length -1].artist}</p>
                        <p>{score} / 5</p>
                        <button onClick={() => restart()}>Play again?</button>
                    </div>
                }

            </div>
        </div>
    )
}

const mapStateToProps = (reduxState) => reduxState

export default connect(mapStateToProps, { setCurrentPlaylist })(Game)