import React, {Component} from 'react';
import './mainpagestyle.css';
import backArrow from '../images/Main/arrowsBack.svg';
import nextArrow from '../images/Main/arrowNext.svg';
import {Link} from "react-router-dom"


export class MainComponent extends Component {
    render() {
        return (
            <div className='rowContainer'>
                <OpenGames/>
                <ServerInfo/>
            </div>
        );
    }
}

class ServerInfo extends Component {
    render() {
        return (
            <div className='serverInfo'>
                <h1>Статус сервера</h1>
                <table>
                    <tr>
                        <td><h1>Количество пользователей онлайн</h1></td>
                        <td><h2>1</h2></td>
                    </tr>
                    <tr>
                        <td><h1>Количество игр</h1></td>
                        <td><h2>0</h2></td>
                    </tr>
                </table>
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
        let games = [];
        Fetchs.getLobbys(this.state.pageNum).then(res => games.push(...res));
        debugger;
        let openGames = [];
        for (let i = 0; i < games.length; i++) {
            openGames.push({ name: `Лобби ${i + 1}`, info: games[i], id: i + 1 });
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
    render() {
        return (
            <div className='lobbyItem'>
                <h2>{this.props.name}</h2>
                <h3>{this.props.info}</h3>
                <Link to="/Game/">
                    <button>Войти</button>
                </Link>                
            </div>
        );
    }
}
