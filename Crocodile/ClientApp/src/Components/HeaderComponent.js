import React, {Component} from 'react';
import Popup from "reactjs-popup";
import {Input} from "../Input";
import {UserAuthProfileComponent} from "./UserAuthProfileComponent";
import * as Fetchs from "../fetchs"


export class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {userIsAuth: false};
        this.signIn = this.signIn.bind(this);
        this.logOut = this.logOut.bind(this);
        this._closePopup = undefined;
    }

    signIn = async function () {
        let userLogin = document.getElementById("userLogin");
        let userPassword = document.getElementById("userPassword");

        let response = await Fetchs.loginUser(userLogin.value, userPassword.value);

        if (response) {
            this.setState({ userIsAuth: true });
            this._closePopup();
        } else {
            userLogin.style.borderBottom = "5px red solid";
            userPassword.style.borderBottom = "5px red solid";
        }
    }

    logOut = function(){
        this.setState({userIsAuth:false});
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
                        <Input signIn={this.signIn}/>
                    </div>
                </div>
            )}
        </Popup>;

    render() {
        let fLink = <Popup modal trigger={<h1 className='fontStyle'>Создать игру</h1>}>
            {close => (
                <>
                    <a className="close" onClick={close}>
                        &times;
                    </a>
                    <h1 style={{fontSize: '18px'}}>Создать новую игру</h1>
                    <table>
                        <tr>
                            <td><h2>Раунды</h2></td>
                            <td><input defaultValue='5'/></td>
                        </tr>
                        <tr>
                            <td><h2>Время</h2></td>
                            <td><input defaultValue='5'/></td>
                        </tr>
                        <tr>
                            <td><h2>Открытая игра</h2></td>
                            <td><input defaultValue='true' type='checkbox'/></td>
                        </tr>
                        <tr>
                            <td>
                                <button>Создать</button>
                            </td>
                            <td>
                                <button onClick={close}>Назад</button>
                            </td>
                        </tr>
                    </table>

                </>
            )}
        </Popup>;
        let sLink = <Popup modal trigger={<h1 className='fontStyle'>Присоединиться</h1>}>
            {close => (
                <>
                    <a className="close" onClick={close}>
                        &times;
                    </a>
                    <h1 style={{fontSize: '18px'}}>Присоединиться к игре</h1>
                    <table>
                        <tr>
                            <td><h2>ID</h2></td>
                            <td><input placeholder='id'/></td>
                        </tr>
                        <tr>
                            <td>
                                <button>Join</button>
                            </td>
                            <td>
                                <button onClick={close}>Назад</button>
                            </td>
                        </tr>
                    </table>
                </>
            )}
        </Popup>;
        return (
            <header className="headerContainer" style={{zIndex: 10}}>
                <div className="container">
                    <div className='links'>
                        {this.props.pageNum===0?<>{fLink}{sLink}</>:null}
                    </div>
                    {this.state.userIsAuth ? <UserAuthProfileComponent setterPageNum={this.props.setterPageNum} userLogOut = {this.logOut} /> : this.userNotAuth}
                </div>
            </header>
        );
    }
}
