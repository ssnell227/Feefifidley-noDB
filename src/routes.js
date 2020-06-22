import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Auth from './components/auth/Auth'
import Dashboard from './components/dashboard/Dashboard'
import Lobby from './components/lobby/Lobby'

export default (
    <Switch>
        <Route exact path='/' component={Auth}/>
        <Route path='/dashboard' component={Dashboard}/>
        <Route path='/game/:gameId' component={Lobby}/>
    </Switch>
)