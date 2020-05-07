import React, {Component} from 'react';
import './mainpagestyle.css';
import Popup from "reactjs-popup";
import {Input} from "../Input";

export class MainComponent extends Component {
    render() {
        return (
            <div className='rowContainer'>
                <Sidebar/>
                <OpenGames/>
                <ServerInfo/>
            </div>
        );
    }
}

class ServerInfo extends Component{
    render() {
        return(
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

class Sidebar extends Component {
    render() {
        return (
            <div className='sidebarContainer'>
                <Popup modal trigger={<h1 className='fontStyle'>Создать игру</h1>}>
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
                </Popup>
                <Popup modal trigger={<h1 className='fontStyle'>Присоединиться</h1>}> 
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
                </Popup>
            </div>
        );
    }
}

class OpenGames extends Component {
    render() {
        //fetch("Запрос открытых игр");
        let openGames = [];
        for (let i = 1; i < 51; i++) {
            openGames.push({name: `Лобби ${i}`, info: 'Какая-то информация', id: i});
        }
        return (
            <div className='OpenGamesContainer'>
                <h1>Открытые игры</h1>
                {openGames.map(x => <LobbyItem name={x.name} info={x.info}/>)}
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
                <button>Войти</button>
            </div>
        );
    }
}
