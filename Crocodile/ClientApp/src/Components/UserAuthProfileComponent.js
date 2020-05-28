import React, {Component} from 'react';
import Popup from "reactjs-popup";
import {Link} from "react-router-dom";
import * as Cookies from 'js-cookie';


export class UserAuthProfileComponent extends Component {
    h1 = {
    flexDirection: "row",
    alignItems: "center",
    background: "linear-gradient(180deg, #37b202 0%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 60%, #37b202 100%)",
    borderRadius: "1em",
    boxShadow: "0 10px 10px #000000",
    borderBottom: "#4A7F7C",
    padding:"1em",
    transition: ".5s",
    textAlign: "center"};

    render() {
        return (
            <Popup arrowStyle={{display:"none"}} contentStyle={{background: "linear-gradient(#2ab07b 0%, #ace0c2 20%, #ace0c2 80%, #2ab07b 100%)", borderRadius: "1em"}} closeOnDocumentClick position='bottom right' trigger={
                <div className="playerContainer" style={this.linkStyle}>
                    <h1 style={this.h1Style}>{Cookies.get("login")}</h1>
                    <img src={Cookies.get('photo')} style={{width: '5em', height: '5em', margin: '0 1em'}}/>
                </div>
            }>
                <Link style={{textAlign:"center", color:"#000844"}} to={`/user/profile/${Cookies.get("login")}`}>
                    <a><h1 style={this.h1}>Профиль</h1></a>
                </Link>
                <Link style={{textAlign:"center", color:"#000844"}}  to="/">
                    <h1 style={this.h1} onClick={() => this.props.userLogOut()}>Выйти</h1>
                </Link>
            </Popup>
        );
    }
}