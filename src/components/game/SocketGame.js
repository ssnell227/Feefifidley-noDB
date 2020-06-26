import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'


const SocketGame = (props) => {
    const [gameState, setGameState] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [timerSeconds, setTimerSeconds] = useState(null)

    useEffect(() => {
        props.socket.on('timerDecrement', ({seconds}) => {
            console.log(seconds)
            setTimerSeconds(seconds)
        })

        props.socket.on('switchMode', () => {
            setGameState(!gameState)
        })

        props.socket.on('gameOver', () => {
            setGameOver(true)
        })
    }, [])


    return (
        <div className='game-outer-container'>
            <div className='game-inner-container'>
                {gameState === false &&
                    <div>
                        Get Ready!
                        <div>
                            <p>{timerSeconds}</p>
                        </div>
                    </div>
                }
                {gameState === true &&
                    <div>
                        <div>
                            <p>{timerSeconds}</p>
                        </div>
                        Choice map
                    </div>
                }
                {gameOver === true &&
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