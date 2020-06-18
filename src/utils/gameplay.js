import React from 'react'

export default {
    countdown: ({seconds, completed}) => {
        if (completed) {
            return <p>Completed</p>
        } else {
            return <p>{seconds}</p>
        }
    }
}