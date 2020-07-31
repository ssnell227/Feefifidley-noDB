import React, { useState, useEffect, useRef } from 'react'

import blankArtistImage from '../../images/blank-artist-photo.png'


const SocketGame = (props) => {
    const [gameState, setGameState] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [timerSeconds, setTimerSeconds] = useState(null)
    const [round, setRound] = useState(0)
    const [songSet, setSongSet] = useState([])
    const [guessed, setGuessed] = useState(false)

    const audioRef = useRef(null)

    useEffect(() => {
        if (gameState && !gameOver) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [gameState, gameOver])

    useEffect(() => {
        props.socket.on('timerDecrement', ({ seconds }) => {
            setTimerSeconds(seconds, props.socket)
        })

        props.socket.on('gameOver', () => {
            setGameOver(true)
        })

        
    }, [props.socket])

    useEffect(() => {

        props.socket.on('switchMode', () => {
            setGameState(gameState === true ? false : true)
        })

    }, [gameState, props.socket])

    useEffect(() => {
        props.socket.on('nextRound', () => {
            setRound(round + 1)
            setGuessed(false)
            
            console.log(round)
            if (round < props.currentSongObj.length) {
                generateRandomOrdered()
            }
        })
    }, [round, props.socket, props.currentSongObj])

    const clickAnswer = (e) => {
        const correctSong = props.currentSongObj[round - 1].song.name

        setGuessed(true)

        if (e.target.dataset.name === correctSong && !guessed) {
            props.socket.emit('changeScore', { gameId: props.gameInfo.gameId, socketId: props.gameInfo.socketId, correctSong, date: Date.now() })
        }
    }

    const generateRandomOrdered = () => {
        const choiceArray = [props.currentSongObj[round].song, ...props.currentSongObj[round].dummyArray]
        const availableIndices = choiceArray.map((i, index) => index)
        const shuffledArray = new Array(4)

        choiceArray.forEach(item => {
            const randomIndex = Math.floor(Math.random() * availableIndices.length - 1)

            shuffledArray.splice(availableIndices.splice(randomIndex, 1), 1, item)
        })

        setSongSet(shuffledArray)
    }

    const songsMap = songSet.map((item, index) => {
        return (
            <div className={`game-card game-card-playing ${guessed && item.correct && 'correct'}`} key={`${item.name}-${index}`}>
                <img onClick={(e) => clickAnswer(e)} data-name={item.name} className='game-card-image' src={item.album.images[0].url} alt='album-art' />
                <div className='game-card-info'>
                    <p className='song-name'>{item.name}</p>
                    <p>- - -</p>
                    <p>{item.artists[0].name}</p>
                </div>
            </div>
        )
    })

    const blankMap = songSet.map((item, index) => {
        return (
            <div className='game-card' key={index}>
                <img alt='blank artist' className='game-card-image' src={blankArtistImage} />
                <div className='game-card-info'>
                    <p className='song-name'>Track name</p>
                    <p>- - -</p>
                    <p>Artist</p>
                </div>
            </div>
        )
    })

    


    return (
        <div className='game-outer-container'>
            <div className='game-inner-container'>
                {!gameState && !gameOver &&
                    <div className='game-info-container'>
                        <h2>Get Ready!</h2>
                        <p className='timer'>{timerSeconds}</p>
                        <div className='game-songs-container'>
                            {blankMap}
                        </div>
                    </div>
                }
                
                    <div className={`game-info-container ${gameState && !gameOver && 'display'}`}>
                        <p className='timer'> {timerSeconds}</p>
                        <div>
                            <audio ref={audioRef} preload='auto' src={round-1 >= 0 && props.currentSongObj[round-1].song.preview_url} />
                        </div>
                        <div className='game-songs-container'>
                            {songsMap}
                        </div>
                    </div>
                

            </div>
        </div>
    )
}

export default SocketGame