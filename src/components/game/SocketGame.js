import React, { useState, useEffect } from 'react'


const SocketGame = (props) => {
    const [gameState, setGameState] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [timerSeconds, setTimerSeconds] = useState(null)
    const [currentSongObj, setCurrentSongObj] = useState({})
    const [round, setRound] = useState(0)
    

    useEffect(() => {
        props.socket.on('timerDecrement', ({ seconds }) => {
            console.log(seconds)
            setTimerSeconds(seconds)
        })

        props.socket.on('gameOver', () => {
            setGameOver(true)
        })
    }, [])

    useEffect(() => {

        props.socket.on('switchMode', () => {
            setGameState(gameState === true ? false : true)
        })

    }, [gameState])

    useEffect(() => {
        props.socket.on('nextRound', () => {
            setRound(round + 1)
        })
    }, [round])

    useEffect(() => {
        props.socket.on('sendSongs', (sentSongs) => {
            console.log(sentSongs.currentSongObj)
            setCurrentSongObj(sentSongs.currentSongObj)
        })

    }, [currentSongObj])


    return (
        <div className='game-outer-container'>
            <div className='game-inner-container'>
                {!gameState &&
                    <div>
                        Get Ready!
                        <div>
                            <p>{timerSeconds}</p>
                        </div>
                        <div>

                        </div>
                    </div>
                }
                {gameState &&
                    <div>
                        <div>
                            <p>{timerSeconds}</p>
                        </div>
                        <div>
                            <audio autoPlay src={currentSongObj[round -1].song.preview_url}/>
                        </div>
                        Choice map
                    </div>
                }
                {gameOver &&
                    <div>
                        <div>
                            ranking map
                        </div>
                        <button>Play again?</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default SocketGame