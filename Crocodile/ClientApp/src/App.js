import React, { useState } from 'react';
import './App.css';
import './style.css';
import { HeaderComponent } from "./Components/HeaderComponent"
import './files/game/style.css';
import './files/registrationForm/style.css';
import { browserHistory } from 'react-router/lib';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { MainComponent as Main } from "./Components/MainComponent";
import { ProfileComponent as Profile } from "./Components/ProfileComponent";
import { GameComponent as Game } from "./Components/GameComponent";
import { GameMasterComponent as GameMaster } from "./Components/GameMasterComponent";
function App() {
    return (
        <Router history={browserHistory}>
            <div className="App">
                <HeaderComponent history={browserHistory} />
                <div className='container' style={{ width: '100%', marginTop: '8em' }}>
                    <Switch>
                        <Redirect exact from="/Game/user/profile/:id" to="/user/profile/:id" />
                        <Redirect exact from="/Game/" to="/" />
                        <Route exact path="/Game/:id" component={Game} />
                        <Route exact path="/user/profile/:id" component={Profile} />
                        <Route path="/GameMaster">
                            <GameMaster />
                        </Route>
                        <Route exact path='/'>
                            <Main />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
