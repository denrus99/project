import React, {Component} from 'react';
import userLogo from "../images/game/account.svg";
import Popup from "reactjs-popup";
import {Link} from "react-router-dom";



export class UserAuthProfileComponent extends Component {
    h1 = {padding: '10px 0', cursor: "pointer", margin: '1em', background: '#6C8CD5'};
    render() {
        return (
            <Popup closeOnDocumentClick position='bottom right' trigger={
                <div className="playerContainer" style={this.linkStyle}>
                    <h1 style={this.h1Style}>{'Пользователь'}</h1>
                    <img src={userLogo} style={{width: '5em', height: '5em', margin: '0 1em'}}/>
                </div>
            }>
                <Link to="Profile/user">
                    <a><h1 style={this.h1}>Профиль</h1></a>
                </Link>
                <h1 style={this.h1} onClick={() => this.props.userLogOut()}>Выйти</h1>
            </Popup>
        );
    }
}