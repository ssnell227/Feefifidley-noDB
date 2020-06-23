import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Auth from './components/auth/Auth'
import Dashboard from './components/dashboard/Dashboard'
import Lobby from './components/lobby/Lobby'
import Admin from './components/admin/Admin'

import ProtectedRoute from './utils/ProtectedRoute'

export default (
    <Switch>
        <Route exact path='/' component={Auth}/>
        <ProtectedRoute path='/dashboard' component={Dashboard}/>
        <ProtectedRoute path='/game/:gameId' component={Lobby}/>
        <ProtectedRoute path='/admin' component={Admin} admin/>
    </Switch>
)