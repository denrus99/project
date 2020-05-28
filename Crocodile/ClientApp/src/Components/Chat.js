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
                debugger;
                let block = document.getElementById("chatBlock");
                debugger;
                let msg = {
                    idMes: id,
                    user: {name: name, photo: photo},
                    text: text,
                    date: date
                };
                debugger;
                messages.push(msg);
                debugger;
                this.setState({messages: messages});
                let timer = setTimeout(() => {
                    block.scrollTop = block.scrollHeight;
                }, 10)
            })
        });
    };

    sendMessage(text) {        
        let date = new Date(Date.now());
        debugger
        this.state.hubConnection
            .invoke('SendMessage', this.props.gameId, Cookies.get("login"), text, `${date.getHours()}:${date.getMinutes()}`)
            .catch(err => console.error(err));
        this.setState({message: ''});
    }

    render() {
        return (
            <div style={{width: '20%'}}>
                <div id='chatBlock' className='chat_Container'>
                    {messages.map(x => <Message id={x.idMes} user={x.user} text={x.text} date={x.date} />)}
                </div>
                <Input sendMsg={this.sendMessage}/>
            </div>
        );
    }
}

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {color:"#dae8ec"}
        this.ChooseGrade = this.ChooseGrade.bind(this)
    }
    ChooseGrade(x){        
        switch (x) {
            case 0:
                this.setState({color:"#dae8ec"});
                break;
            case 1:
                this.setState({color:"#BBED89"});
                break;
            case 2:
                this.setState({color:"#FFC073"});
                break;
            case 3:
                this.setState({color:"#6B40FF"});
                break;
        }
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

                <div className='MessageContainer' style={{background: this.state.color}}>
                    <h2>{this.props.text}</h2>
                    <Grades chooseMsg={this.ChooseGrade}/>
                    <h3>{this.props.date}</h3>
                </div>
            </div>
        );
    }
}

class Grades extends Component {
    constructor(props) {
        super(props);
        this.editChoice=this.editChoice.bind(this);
        this.state = {current: 0}
    }

    chosenStyle = {
        opacity: 1
    };
    
    notChosenStyle = {
        opacity: 0.4
    };

    editChoice(x) {
        if (this.state.current === x) {
            this.setState({current: 0})
            this.props.chooseMsg(0);
        } else {
            this.setState({current: x})
            this.props.chooseMsg(x);
        }
        
    }

    render() {
        return (
            <div className='iconContainer'>
                {/*0 - не выбран не один элемент, 1 - выбрана корона, 2 - выбран огонь, 3 - выбран холод*/}
                <img id='1' style={this.state.current === 1 ? this.chosenStyle : this.notChosenStyle}
                     onClick={() => this.editChoice(1)} src={crown}/>
                <img id='2' style={this.state.current === 2 ? this.chosenStyle : this.notChosenStyle}
                     onClick={() => this.editChoice(2)} src={fire}/>
                <img id='3' style={this.state.current === 3 ? this.chosenStyle : this.notChosenStyle}
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
