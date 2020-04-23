import React, {Component} from 'react';
import Popup from "reactjs-popup";
import {Input} from "../Input";
import {UserAuthProfileComponent} from "./UserAuthProfileComponent";


export class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {userIsAuth: false};
        this.signIn = this.signIn.bind(this);
        this.logOut = this.logOut.bind(this);
        this._closePopup = undefined;
    }

    signIn = function () {
        this.setState({userIsAuth: true});
        this._closePopup();
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
        return (
            <header className="headerContainer" style={{zIndex: 10}}>
                <div className="container">
                    {this.state.userIsAuth ? <UserAuthProfileComponent userLogOut = {this.logOut} /> : this.userNotAuth}
                </div>
            </header>
        );
    }
}
