import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Auth from './components/auth/Auth'
import Dashboard from './components/dashboard/Dashboard'
import Game from './components/game/Game'

export default (
    <Switch>
        <Route exact path='/' component={Auth}/>
        <Route path='/dashboard' component={Dashboard}/>
        <Route path='/game/:gameId' component={Game}/>
    </Switch>
)