import React, {useEffect} from 'react';
import Routes from './routes'
import {withRouter} from 'react-router-dom'
import Nav from './components/nav/Nav'
import {connect} from 'react-redux'
import axios from 'axios'
import {setUser} from './redux/reducers/authReducer'
import './sass/App.scss'



function App(props) {

  useEffect( () => {
    const setSession = async () => {
      const {data} = await axios.get('/api/auth/session')
      if (data.user) {
        const {username, user_id, isadmin} = data.user
        props.setUser({username, userId: user_id, isAdmin: isadmin, isAuthenticated: true})
        props.history.push('/dashboard')
      } else {
        return
      }
    }
    setSession()
    
  }, [])

  return (
    <div className="App">
      {props.location.pathname !== '/' && <Nav />}
      {Routes}
    </div>
  );
}


export default connect(null, {setUser})(withRouter(App));
