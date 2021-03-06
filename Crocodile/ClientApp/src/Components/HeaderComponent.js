import React, {Component} from 'react';
import Popup from "reactjs-popup";
import {Input} from "../Input";
import {UserAuthProfileComponent} from "./UserAuthProfileComponent";
import * as Fetchs from "../fetchs";
import * as Cookies from 'js-cookie';


export class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { userIsAuth: Cookies.get("login") ? true : false };
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.createGame = this.createGame.bind(this);
        this.joinToGame = this.joinToGame.bind(this);
        this.logOut = this.logOut.bind(this);
        this._closePopup = undefined;
        this.signInWithGoogle = this.signInWithGoogle.bind(this);
    }

    signIn = async function () {
        let userLogin = document.getElementById("userLogin");
        let userPassword = document.getElementById("userPassword");
        let response = await Fetchs.loginUser(userLogin.value, userPassword.value);
        if (response.status) {
            Cookies.set("login", response.login.login);
            Cookies.set('photo','https://image.flaticon.com/icons/svg/2919/2919573.svg');
            this.setState({ userIsAuth: true });
            this._closePopup();
        } else {
            userLogin.style.borderBottom = "3px red solid";
            userPassword.style.borderBottom = "3px red solid";
        }
    }
    
    signInWithGoogle = async function (login, pass,photo) {
        let response = await Fetchs.loginUserGoogle(login,pass,photo);    
        if (response.status) {
            Cookies.set("login", response.login.login);
            Cookies.set('photo',response.login.photo);
            this.setState({ userIsAuth: true });
            this._closePopup();
        } 
    }

    signUp = async function () {
        let userLogin = document.getElementById("registLogin");
        let userPassword = document.getElementById("registPassword");
        let confirmPassword = document.getElementById("confirmPassword");

        if (userPassword !== confirmPassword) {
            userPassword.style.borderBottom = "3px red solid";
            confirmPassword.style.borderBottom = "3px red solid";
        }

        let response = await Fetchs.register(userLogin.value, userPassword.value);

        if (response.status) {
            Cookies.set("login", response.login);
            Cookies.set('photo','https://image.flaticon.com/icons/svg/2919/2919573.svg');
            this.setState({ userIsAuth: true });
            this._closePopup();
        } else {
            userLogin.style.borderBottom = "3px red solid";
        }
    }

    logOut = async function () {
        await Fetchs.logoutUser();
        Cookies.remove("login");
        this.setState({ userIsAuth: false });
    }

    h1Style = {
        fontSize: '3em'
    };

    linkStyle = {
        margin: '0 3em',
        textDecoration: 'none',
        color: 'black'
    };

    userNotAuth =
        <Popup trigger={
            <div className="playerContainer" style={this.linkStyle}>
                <h1 style={this.h1Style}>{'Войти'}</h1>
            </div> } modal contentStyle={{width: "inherit", background: "none", border: "none"}}>
            {close => (
                <div className="modal">
                    {this._closePopup = close}
                    <a className="close" onClick={close}>
                        &times;
                    </a>
                    <div>
                        <Input signIn={this.signIn} signInWithGoogle={this.signInWithGoogle} signUp={this.signUp}/>
                    </div>
                </div>
            )}
        </Popup>;

    createGame = async function () {
        let roundsCount = document.getElementById("roundsCount");
        let roundMinutsCount = document.getElementById("roundMinutsCount");
        let isOpenGame = document.getElementById("isOpenGame");

        let response = await Fetchs.createGame(isOpenGame.checked, roundsCount.value, roundMinutsCount.value);
        debugger
        if (typeof response.gameId === "string") {
            Cookies.set("gameId", response.gameId);
            Cookies.set("master", response.players[response.indexPresenter]);
            this._closePopup();
            this.props.history.push(`/Game/${response.gameId}`);
            this.props.history.go(`/Game/${response.gameId}`);
        } else {
            return false;
        }
    }

    joinToGame = async function() {
        let gameId = document.getElementById("gameIdForJoin");

        let response = await Fetchs.joinToGame(gameId.value);

        
        if (response) {
            Cookies.set("gameId", gameId.value);
            Cookies.set("master", response.players[response.indexPresenter]);
            this._closePopup();
            this.props.history.push(`/Game/${gameId.value}`);
            this.props.history.go(`/Game/${gameId.value}`);
        } else {
            return false;
        }
    }

    render() {
        let fLink = <Popup contentStyle={{width: "inherit", background: "none", border: "none"}} modal trigger={<h1 className='fontStyle'>Создать игру</h1>}>
            {close => (
                <>
                    <div className="modal-to-games">
                        {this._closePopup = close}
                        <a className="close" onClick={close}>
                            &times;
                        </a>
                        <h1>Создать новую игру</h1>
                        <table>
                            <tr>
                                <td><h2>Раунды</h2></td>
                                <td><input id="roundsCount" defaultValue='5'/></td>
                            </tr>
                            <tr>
                                <td><h2>Время</h2></td>
                                <td><input id="roundMinutsCount" defaultValue='5'/></td>
                            </tr>
                            <tr>
                                <td><h2>Открытая игра</h2></td>
                                <td><input id="isOpenGame" type='checkbox'/></td>
                            </tr>
                            <tr>
                                <td>
                                    <button onClick={this.createGame}>Создать</button>
                                </td>
                                <td>
                                    <button onClick={close}>Назад</button>
                                </td>
                            </tr>
                        </table>

                    </div>
                </>
            )}
        </Popup>;
        let sLink = <Popup contentStyle={{width: "inherit", background: "none", border: "none"}} modal trigger={<h1 className='fontStyle'>Присоединиться</h1>}>
            {close => (
                <>
                    <div className="modal-to-games">
                        {this._closePopup = close}
                        <a className="close" onClick={close}>
                            &times;
                        </a>
                        <h1>Присоединиться к игре</h1>
                        <table>
                            <tr>
                                <td><h2>ID</h2></td>
                                <td><input id="gameIdForJoin" placeholder='id'/></td>
                            </tr>
                            <tr>
                                <td>
                                    <button onClick={this.joinToGame}>Присоединиться</button>
                                </td>
                                <td>
                                    <button onClick={close}>Назад</button>
                                </td>
                            </tr>
                        </table>
                    </div>                   
                </>
            )}
        </Popup>;
        return (
            <header className="headerContainer" style={{zIndex: 10}}>
                <div className="container">
                    <div className='links'>
                        {<>{fLink}{sLink}</>}
                    </div>
                    {this.state.userIsAuth ? <UserAuthProfileComponent userLogOut = {this.logOut} /> : this.userNotAuth}
                </div>
            </header>
        );
    }
}
