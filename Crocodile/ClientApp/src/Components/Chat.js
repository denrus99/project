import React, {Component} from 'react';
import fire from '../images/game/fire.svg';
import crown from '../images/game/crown.svg';
import ice from '../images/game/ice.svg';
import * as Cookies from 'js-cookie';
import Popup from "reactjs-popup";
import {Link} from "react-router-dom";
import podium from '../images/game/podium.svg';
import * as Fetchs from "../fetchs";
import {Roller} from "react-spinners-css";

const signalR = require('@aspnet/signalr');

var messages = [];

export class Chat extends Component {
    constructor(props) {        
        super(props);
        this.raitingTable = [];
        this.words = [];
        this.state = {
            messages: this.messages,
            hubConnection: null,
            isLoad: false
        };
        this.getRaitingTable = this.getRaitingTable.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getWords = this.getWords.bind(this);
        this.renderWords = this.renderWords.bind(this);
    }

    componentDidMount = () => {
        const hubConnection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
        hubConnection.serverTimeoutInMilliseconds = 300000;
        this.setState({ hubConnection: hubConnection }, () => {
            this.state.hubConnection.start().then(() => {
                console.log("Connection started!(Chat)")
                this.state.hubConnection
                    .invoke('EnterChat', this.props.gameId)
                    .catch(err => console.error(err));
            }
            );
            this.state.hubConnection.on('ReceiveMessage', (id, name, text, date,photo) => {
                debugger
                let block = document.getElementById("chatBlock");
                let msg = {
                    idMes: id,
                    user: { name: name, photo: photo },
                    text: text,
                    date: date
                };
                messages.push(msg);

                this.setState({ messages: messages });
                let timer = setTimeout(() => {
                    block.scrollTop = block.scrollHeight;
                }, 10)
            });
            this.state.hubConnection.on('ReceiveReaction', (grade, id, master) => {
                if (this.refs["msg" + id] !== undefined) {
                    this.refs["msg" + id].ChooseGrade(grade);
                }
                if(master){
                    messages = []
                    Cookies.set("master", master.slice(1, master.length - 1));
                    this.props.editCurrentWord( null);
                }
            });
            this.stopHub = () => {
                this.state.hubConnection.stop().then(() => console.log("Connection terminated!(Chat)"))
            };
        });
    };

    componentWillUnmount = () => {
        this.stopHub();
    };

    sendMessage(text) {
        debugger
        let date = new Date(Date.now());
        this.state.hubConnection
            .invoke('SendMessage', this.props.gameId, Cookies.get("login"), text, `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`,Cookies.get("photo"))
            .catch(err => console.error(err));
        this.setState({ message: '' });
    }

    getRaitingTable() {
        Fetchs.getLeaderBoard(this.props.gameId).then(res => {
            this.raitingTable = res.map((obj, i) => {
                return {
                    pos: i + 1,
                    name: obj.login,
                    score: obj.record
                };
            });
            debugger
            this.setState({ isLoad: true });
        });
    }

    getWords() {
        Fetchs.getWords().then(res => {
            this.words = res;
            this.setState({ isLoad: true });
        });
        Fetchs.startGame(this.props.gameId).then(()=>{console.log("Game started")})
    }

    selectWord(word){
        this._closePopup();
        this.props.editCurrentWord( word);
    }
    
    renderWords(){
        if(Cookies.get("master") === Cookies.get("login")) {
            return  <Popup onOpen={this.getWords} modal closeOnDocumentClick={false} closeOnEscape={false}
                          trigger={<button className='startGame'>Start Game</button>}>
                {
                    close =>( <div className="gameWords"><h1>Выберите слово</h1>
                        {this._closePopup = close}
                        <button onClick={() => {
                            this.selectWord(this.words[0])
                        }}>{this.words[0]}</button>
                        <button onClick={() => {
                            this.selectWord(this.words[1])
                        }}>{this.words[1]}</button>
                        <button onClick={() => {
                            this.selectWord(this.words[2])
                        }}>{this.words[2]}</button>
                    </div>)
                }
            </Popup>
        }
        else return <Input sendMsg={this.sendMessage}/>;
    }
    
    
    render() {
        return (
            <div style={{width: '20%'}}>
                <div style={{display:'flex',flexDirection:"row"}}>
                    <div style={{margin:" 0 20px",textAlign: 'left'}}>
                        <h1>GameMaster : {Cookies.get("master")} </h1>
                        <h2>Выбраное слово : {this.props.currentWord}</h2>
                    </div>
                    <Popup modal onOpen={this.getRaitingTable}
                        trigger={<img src={podium} style={{ margin: "5px auto", width: '60px', height: '60px' }} />}>
                        <h1>Рейтинг</h1>
                        {this.state.isLoad
                            ? <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                                <table style={{ fontSize: '24px', width: "80%", margin: "0 auto" }}>
                                    <tr>
                                        <th>Позиция</th>
                                        <th>Имя</th>
                                        <th>Количество очков</th>
                                    </tr>
                                    {this.raitingTable.map(x => <tr>
                                        <td>{x.pos}</td>
                                        <td>{x.name}</td>
                                        <td>{x.score}</td>
                                    </tr>)}
                                </table>
                            </div>
                            : <div className="middleContainer"><Roller color="black" /></div>}
                    </Popup>
                </div>
                {/*TODO добавить пользователя и слово только для GM*/}
                <div id='chatBlock' className='chat_Container'>
                    {messages.map(x => <Message ref={"msg" + x.idMes} chooseGrade={this.ChooseGrade} id={x.idMes}
                        gameId={this.props.gameId} user={x.user} text={x.text} date={x.date}
                        hub={this.state.hubConnection} />)}
                </div>
                {this.renderWords()}
            </div>
        );
    }
}

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = { current: 0 }
        this.color = "#dae8ec";
        this.ChooseGrade = this.ChooseGrade.bind(this)
    }

    ChooseGrade(grade) {
        if (grade === this.state.current) {
            return
        }
        switch (grade) {
            case 1:
                this.color = "#BBED89";
                break;
            case 2:
                this.color = "#FFC073";
                break;
            case 3:
                this.color = "#6B40FF";
                break;
            default:
                this.color = "#dae8ec"
                break;
        }
        if(grade === 2) {
            Fetchs.addScoresAlmostGuessed(this.props.gameId, this.props.user.name)
                .then(() => {
                    this.props.hub
                        .invoke('SendReaction', this.props.gameId, grade, this.props.id)
                        .catch(err => console.error(err))
                });
        }
        if(grade === 1) {
            Fetchs.andRound(this.props.gameId, Cookies.get("master"), this.props.user.name)
                .then((res) => {
                    this.props.hub
                        .invoke('SendReaction', this.props.gameId, grade, this.props.id, res)
                        .catch(err => console.error(err))
                });
        }
        this.setState({ current: grade })
    }

    render() {
        return (
            <div className='Message'>
                <Popup
                    trigger={<Link to={`/user/profile/${this.props.user.name}`}><img
                        style={{minWidth: '40px', minHeight: '40px', maxHeight: '40px', maxWidth: '40px'}}
                        src={this.props.user.photo}/></Link>}
                    position='top center' contentStyle={{zIndex: 11, width: 'inherit'}} on='hover'>
                    <h1 style={{padding: '0 20px'}}>{this.props.user.name}</h1>
                </Popup>
                <div className='MessageContainer' style={{ background: this.color }}>
                    <h2>{this.props.text}</h2>
                    {Cookies.get("master") === Cookies.get("login")?
                        <Grades chooseMsg={x => this.ChooseGrade(x)} currentGrade={this.state.current}/>:null}
                    <h3>{this.props.date}</h3>
                </div>
            </div>
        );
    }
}

class Grades extends Component {
    constructor(props) {
        super(props);
        this.editChoice = this.editChoice.bind(this);
    }

    chosenStyle = {
        opacity: 1
    };

    notChosenStyle = {
        opacity: 0.4
    };

    editChoice(x) {
        this.props.chooseMsg(this.props.currentGrade === x ? 0 : x);
    }

    render() {
        return (
            <div className='iconContainer'>
                {/*0 - не выбран не один элемент, 1 - выбрана корона, 2 - выбран огонь, 3 - выбран холод*/}
                <img id='1' style={this.props.currentGrade === 1 ? this.chosenStyle : this.notChosenStyle}
                    onClick={() => this.editChoice(1)} src={crown} />
                <img id='2' style={this.props.currentGrade === 2 ? this.chosenStyle : this.notChosenStyle}
                    onClick={() => this.editChoice(2)} src={fire} />
                <img id='3' style={this.props.currentGrade === 3 ? this.chosenStyle : this.notChosenStyle}
                    onClick={() => this.editChoice(3)} src={ice} />
            </div>
        );
    }
}

class Input extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.Send = this.Send.bind(this);
    }

    Send() {
        let input = this.inputRef.current;
        if (input.value !== '') {
            this.props.sendMsg(input.value);
            input.value = '';
        }
    }

    render() {
        return (
            <div className='Input_Container'>
                <input ref={this.inputRef} placeholder='Введите сообщение' className='Input' />
                <button className='sendButton' onClick={this.Send}>Send</button>
            </div>
        );
    }
}
