import React, {Component} from 'react';
import photo from '../images/game/account.svg';
import fire from '../images/game/fire.svg';
import crown from '../images/game/crown.svg';
import ice from '../images/game/ice.svg';
import * as Cookies from 'js-cookie';
import Popup from "reactjs-popup";
import { Link } from "react-router-dom";

const signalR = require('@aspnet/signalr');

var messages = [];

export class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: this.messages,
            hubConnection: null
        };
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount = () => {
        const hubConnection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
        hubConnection.serverTimeoutInMilliseconds = 300000;
        this.setState({hubConnection: hubConnection}, () => {
            this.state.hubConnection.start().then(() => 
            {
                console.log("Connection started!")
                this.state.hubConnection
                    .invoke('EnterChat', this.props.gameId)
                    .catch(err => console.error(err));
            }
            );
            this.state.hubConnection.on('ReceiveMessage', (id, name, text, date) => {
                let block = document.getElementById("chatBlock");
                let msg = {
                    idMes: id,
                    user: {name: name, photo: photo},
                    text: text,
                    date: date
                };
                messages.push({id <Message id={msg.idMes} user={msg.user} text={msg.text} date={msg.date} hub={this.state.hubConnection}/>});
                
                this.setState({messages: messages});

                
                let timer = setTimeout(() => {
                    block.scrollTop = block.scrollHeight;
                }, 10)
            })
            this.state.hubConnection.on('SendReaction', (color, id) => {
                messages
            });
        });
    };

    sendMessage(text) {        
        let date = new Date(Date.now());
        this.state.hubConnection
            .invoke('SendMessage', this.props.gameId, Cookies.get("login"), text, `${date.getHours()}:${date.getMinutes()}`)
            .catch(err => console.error(err));
        this.setState({message: ''});
    }

    render() {
        return (
            <div style={{width: '20%'}}>
                <div id='chatBlock' className='chat_Container'>
                    {messages}
                </div>
                <Input sendMsg={this.sendMessage}/>
            </div>
        );
    }
}

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {current: 0}
        this.color = "#dae8ec";
        this.ChooseGrade = this.ChooseGrade.bind(this)
    }

    ChooseGrade(grade) {
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
        this.props.hub
            .invoke('SendReaction', this.props.gameId, this.color, this.props.id)
            .catch(err => console.error(err));
        this.setState({current: grade})
    }

    render() {
        return (
            <div className='Message'>
                <Popup
                    trigger={<a href='/Profile' style={{maxHeight: '40px'}}><img
                        style={{minWidth: '40px', minHeight: '40px', maxHeight: '40px', maxWidth: '40px'}}
                        src={this.props.user.photo}/></a>}
                    position='top center' contentStyle={{zIndex: 11, width: 'inherit'}} on='hover'>
                    <h1 style={{padding: '0 20px'}}>{this.props.user.name}</h1>
                </Popup>

                <div className='MessageContainer' style={{background: this.color}}>
                    <h2>{this.props.text}</h2>
                    <Grades chooseMsg={x => this.ChooseGrade(x)} currentGrade={this.state.current}/>
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
                     onClick={() => this.editChoice(1)} src={crown}/>
                <img id='2' style={this.props.currentGrade === 2 ? this.chosenStyle : this.notChosenStyle}
                     onClick={() => this.editChoice(2)} src={fire}/>
                <img id='3' style={this.props.currentGrade === 3 ? this.chosenStyle : this.notChosenStyle}
                     onClick={() => this.editChoice(3)} src={ice}/>
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
            this.props.sendMsg(input.value, { name: Cookies.get("login"), photo: photo });
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
