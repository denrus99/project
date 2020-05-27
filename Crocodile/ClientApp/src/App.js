import React, { useState } from 'react';
import './App.css';
import './style.css';
import {HeaderComponent} from "./Components/HeaderComponent"
import './files/game/style.css';
import './files/registrationForm/style.css';
import {browserHistory} from 'react-router/lib';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {MainComponent as Main} from "./Components/MainComponent";
import {ProfileComponent as Profile} from "./Components/ProfileComponent";
import {GameComponent as Game} from "./Components/GameComponent";
import {GameMasterComponent as GameMaster} from "./Components/GameMasterComponent";
function App() {
    const [pageNum,setPageNum] = useState(0);
    let setterPageNum = (a)=>{
        lastPage.unshift(a);
        lastPage.length=10;
        setPageNum(a);
    }
    let pages = [<Main setterPageNum={setterPageNum}/>, <Profile lastPage={lastPage} setterPageNum={setterPageNum}/>, <Game setterPageNum={setterPageNum}/>, <GameMaster/>];
    return (
        <Router history={browserHistory}>
        <div className="App">           
            <HeaderComponent/>
            <div className='container' style={{width: '100%', marginTop: '8em'}}>
                <Switch>
                    <Route path="/Game">
                        <Game/>
                    </Route>
                    <Route path="/Profile">
                        <Profile/>
                    </Route>
                    <Route path="/GameMaster">
                        <GameMaster/>
                    </Route>
                    <Route exact path='/'>
                        <Main/>
                    </Route>
                </Switch>
            </div>
        </div>
        </Router>
    );
}

export default App;
