import React from 'react';
import Routes from './routes'
import {withRouter} from 'react-router-dom'
import Nav from './components/nav/Nav'
import './sass/App.scss'



function App(props) {

  return (
    <div className="App">
      {props.location.pathname !== '/' && <Nav />}
      {Routes}
    </div>
  );
}


export default (withRouter(App));
