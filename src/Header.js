import React, {Component} from 'react';
import userLogo from './images/game/account.svg';
import Popup from "reactjs-popup";
import {Input} from "./Input";


export class Header extends Component {
    constructor() {
        super();
        this.state = {textField:'Войти'};
        this.signIn = this.signIn.bind(this);
    }
    signIn =  function () {

        this.setState({textField: "Игрок"});

    }
    render() {
        const h1Style = {
            fontSize: '3em'
        };
        const linkStyle = {
            margin: '0 3em',
            textDecoration: 'none',
            color: 'black'
        };
        return (
            <header className="headerContainer" style={{zIndex: 10}}>
                <div className="container">
                    <a style={linkStyle} href="main.html">
                        <div style={{margin: '2em'}}><h1 style={h1Style}>Главная</h1></div>
                    </a>
                    <a style={linkStyle} href="create.html">
                        <div style={{margin: '2em'}}><h1 style={h1Style}>Создать</h1></div>
                    </a>
                    <a style={linkStyle} href="rating.html">
                        <div style={{margin: '2em'}}><h1 style={h1Style}>Рейтинговая таблица</h1></div>
                    </a>
                    <div style={{flexGrow: 2}}/>
                    <Popup trigger={
                        <div className="playerContainer" style={linkStyle}>
                            <h1 style={h1Style}>{this.state.textField}</h1>
                            {this.state.textField === 'Игрок' ?
                                <img src={userLogo} style={{width: '5em', height: '5em', margin: '0 1em'}}/> : null}
                        </div>
                    } modal contentStyle={{width: "inherit", background: "none", border: "none"}}>
                        {close => (
                            <div className="modal">
                                <a className="close" onClick={close}>
                                    &times;
                                </a>
                                <div>
                                    <Input signIn = {this.signIn}/>
                                </div>
                            </div>
                        )}
                    </Popup>
                </div>
            </header>
        );
    }
}
