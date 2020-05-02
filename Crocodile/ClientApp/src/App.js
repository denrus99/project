import React from 'react';
import './App.css';
import './style.css';
import {HeaderComponent} from "./Components/HeaderComponent"
import './files/game/style.css';
import './files/registrationForm/style.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {MainComponent as Main} from "./Components/MainComponent";
import {ProfileComponent as Profile} from "./Components/ProfileComponent";
import {GameComponent as Game} from "./Components/GameComponent";
import {GameMasterComponent as GameMaster} from "./Components/GameMasterComponent";

function App() {
  return (
    <div className="App">
      <HeaderComponent/>
      <div className='container' style={{width: '98%', marginTop: '8em' }}>
          <Router>
              <Switch>
                  <Route exact path='/' component = {Main}/>
                  <Route exact path='/Profile' component = {Profile}/>
                  <Route exact path='/Game1' component = {Game}/>
                  <Route exact path='/GameMaster' component = {GameMaster}/>
              </Switch>
          </Router>
      </div>

    </div>
  );
}

export default App;
