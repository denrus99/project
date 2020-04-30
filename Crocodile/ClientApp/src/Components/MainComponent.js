import React, {Component} from 'react';
import './mainpagestyle.css';

export class MainComponent extends Component {
    render() {
        return (
            <div className='rowContainer'>
                <Sidebar/>
                <OpenGames/>
            </div>
        );
    }
}
class Sidebar extends Component{
    render() {
        return(
            <div className='sidebarContainer'>
                <button>Создать игру</button>
                <button>Присоединиться</button>
                <button>Список друзей</button>
            </div>
        );
    }
}
class OpenGames extends Component{
    render(){
        //fetch("Запрос открытых игр");
        let openGames = [];
        for (let i = 1; i <51; i++) {
            openGames.push({name:`Лобби ${i}`,info:'Какая-то информация',id:i});
        }
        return(
            <div className='OpenGamesContainer'>
                <h1>Открытые игры</h1>
                {openGames.map(x=><LobbyItem name={x.name} info={x.info}/>)}
            </div>
        );
    }
}
class LobbyItem extends Component{
    render(){
        return(
            <div className='lobbyItem'>
                <h2>{this.props.name}</h2>
                <h3>{this.props.info}</h3>
                <button>Войти</button>
            </div>
        );
    }
}
