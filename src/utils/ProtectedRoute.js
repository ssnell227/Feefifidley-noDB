import React from 'react'
import {Redirect, Route, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'

const ProtectedRoute = ({exact = false, path, component, admin}) => {
    const location = useLocation()
    
    const {isAuthenticated, isAdmin} = useSelector((reduxState) => reduxState.auth)

    const checkAdmin = (adminProp) => {
        if (adminProp) {
            return isAdmin
        }
        return true
    }

    return (
        <>
    {isAuthenticated && checkAdmin(admin) ? (
            <Route exact={exact} path={path} component={component}/>
        ) : (
            <Redirect to={{
                pathname: '/',
                state: {from: location.pathname}
            }}/>
        )}
        </>
    )
}

export default ProtectedRoute