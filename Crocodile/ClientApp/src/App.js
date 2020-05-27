import React, { useState } from 'react';
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
let lastPage=[0];
function App() {
    const [pageNum,setPageNum] = useState(0);
    let setterPageNum = (a)=>{
        lastPage.unshift(a);
        lastPage.length=10;
        setPageNum(a);
    }
    let pages = [<Main setterPageNum={setterPageNum}/>, <Profile lastPage={lastPage} setterPageNum={setterPageNum}/>, <Game setterPageNum={setterPageNum}/>, <GameMaster/>];
    return (
        <div className="App">
            <HeaderComponent pageNum={pageNum} setterPageNum={setterPageNum}/>
            <div className='container' style={{width: '100%', marginTop: '8em'}}>
                {pages[pageNum]}
            </div>
        </div>
    );
}

export default App;
