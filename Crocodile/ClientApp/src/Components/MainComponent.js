import React, {Component} from 'react';
import './mainpagestyle.css';
import backArrow from '../images/Main/arrowsBack.svg';
import nextArrow from '../images/Main/arrowNext.svg';
import {Link} from "react-router-dom"
import {Roller} from "react-spinners-css";


export class MainComponent extends Component {
    constructor(props) {
        super(props);
        this.state={isLoad:false}        
    }
    render() {        
        return (
            <div className='rowContainer'>
                {this.props.isLoad?<OpenGames openGames={new []}/>:<div className="middleContainer"><Roller color="black"/></div>}
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

        return (
            <div className='OpenGamesContainer'>
                <h1>Открытые игры</h1>
                {this.props.openGames.slice(this.state.pageNum * 10, (this.state.pageNum + 1) * 10 - 1).map(x => <LobbyItem
                    name={x.name} info={x.info}/>)}
                <div style={{margin: '0 auto', justifyContent:'space-around', alignItems:'center'}} className='rowContainer'>
                    {
                        this.state.pageNum > 0 ?
                            <img className='arrowImg' src={backArrow} onClick={() => this.changePage(-1)}/>
                            :  <div className='arrowImg'/>
                    }
                    <h1>{this.state.pageNum}</h1>
                    {
                        this.state.pageNum < (this.props.openGames.length / 10) - 1 ?
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
