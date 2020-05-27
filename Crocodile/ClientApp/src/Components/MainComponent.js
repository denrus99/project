import React, {Component} from 'react';
import './mainpagestyle.css';
import backArrow from '../images/Main/arrowsBack.svg';
import nextArrow from '../images/Main/arrowNext.svg';
import { Link } from "react-router-dom";
import { Roller } from "react-spinners-css";
import * as Fetchs from "../fetchs";
import * as Cookies from 'js-cookie';

export class MainComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoad: false }
        this.games = [];
        Fetchs.getLobbys(this.state.pageNum).then(res => {
            this.games.push(...res);
            this.setState({ isLoad: true });
        });
    }

    render() {        
        return (
            <div className='rowContainer'>
                {this.state.isLoad ? <OpenGames games={this.games} /> : <div className="middleContainer"><Roller color="black" /></div>}
            </div>
        );
    }
}


class OpenGames extends Component {
    constructor(props) {
        super(props);
        this.state = {pageNum: 0};
        this.changePage = this.changePage.bind(this);
    }

    changePage(x) {
        this.setState({pageNum: this.state.pageNum + x});
    }

    render() {
        let openGames = [];
        for (let i = 0; i < this.props.games.length; i++) {
            openGames.push({ name: `Лобби ${i + 1}`, info: this.props.games[i], id: i + 1 });
        }

        return (
            <div className='OpenGamesContainer'>
                <h1>Открытые игры</h1>
                {openGames.map(x => <LobbyItem name={x.name} setterPageNum={this.props.setterPageNum} info={x.info}/>)}
                <div style={{margin: '0 auto', justifyContent:'space-around', alignItems:'center'}} className='rowContainer'>
                    {
                        this.state.pageNum > 0 ?
                            <img className='arrowImg' src={backArrow} onClick={() => this.changePage(-1)}/>
                            :  <div className='arrowImg'/>
                    }
                    <h1>{this.state.pageNum}</h1>
                    {
                        openGames.length == 10 ?
                            <img  className='arrowImg' src={nextArrow} onClick={() => this.changePage(1)}/>:
                            <div className='arrowImg'/>
                    }
                </div>
            </div>
        );
    }
}

class LobbyItem extends Component {
    constructor(props) {
        super(props);
        this.join = this.join.bind(this);
    }

    async join() {
        let response = await Fetchs.joinToGame(this.props.info);

        if (response) {
            Cookies.set("gameId", this.props.info);
        } else {
            return false;
        }
    }

    render() {
        return (
            <div className='lobbyItem'>
                <h2>{this.props.name}</h2>
                <h3>{this.props.info}</h3>
                <Link to={`/Game/${Cookies.get("login") ? this.props.info : ""}`}>
                    <button onClick={this.join}>Войти</button>
                </Link>
            </div>
        );
    }
}