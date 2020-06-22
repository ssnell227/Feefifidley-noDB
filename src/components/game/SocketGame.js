import React, { useState } from 'react'

const SocketGame = (props) => {
    const [gameState, setGameState] = useState('getReady')
    return (
        <div className='game-outer-container'>
            <div className='game-inner-container'>
                playlist name
                {gameState === 'getReady' &&
                    <div>
                        Get Ready!
                        <div>
                            Timer
                        </div>
                    </div>
                }
                {gameState === 'playing' &&
                    <div>
                        <div>
                            Timer
                        </div>
                        Choice map
                    </div>
                }
                {gameState === 'finished' &&
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