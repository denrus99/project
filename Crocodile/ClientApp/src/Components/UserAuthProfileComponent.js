import React, {Component} from 'react';
import Popup from "reactjs-popup";
import { Link } from "react-router-dom";
import * as Cookies from 'js-cookie';



export class UserAuthProfileComponent extends Component {
    h1 = {padding: '10px 0', cursor: "pointer", margin: '1em', background: '#6C8CD5'};
    render() {
        return (
            <Popup closeOnDocumentClick position='bottom right' trigger={
                <div className="playerContainer" style={this.linkStyle}>
                    <h1 style={this.h1Style}>{Cookies.get("login")}</h1>
                    <img src={Cookies.get('photo')} style={{width: '5em', height: '5em', margin: '0 1em'}}/>
                </div>
            }>
                <Link to={`/user/profile/${Cookies.get("login")}`}>
                    <a><h1 style={this.h1}>Профиль</h1></a>
                </Link>
                <Link to="/">
                    <h1 style={this.h1} onClick={() => this.props.userLogOut()}>Выйти</h1>
                </Link>
            </Popup>
        );
    }
}