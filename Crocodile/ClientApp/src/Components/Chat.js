import React, {Component} from 'react';
import photo from '../images/game/account.svg';
import Popup from "reactjs-popup";

var messages = [{user: {name: 'Коля', photo: photo}, text: 'Hello', date: '12:34'},
    {user: {name: 'Коля', photo: photo}, text: 'Что-то написала', date: '12:34'},
    {user: {name: 'Оля', photo: photo}, text: 'Приветствует всех', date: '12:34'},
    {
        user: {name: 'Толя', photo: photo},
        text: 'Проверка длинного сообщения: например я хочу сказать что вышесказанное приводится только в целях тестирования',
        date: '12:34'
    },
    {user: {name: 'Вера', photo: photo}, text: 'Пример', date: '12:34'},
    {user: {name: 'Таня', photo: photo}, text: 'Работы', date: '12:34'},
    {user: {name: 'Оля', photo: photo}, text: 'Приветствует всех', date: '12:34'},
    {
        user: {name: 'Толя', photo: photo},
        text: 'Проверка длинного сообщения: например я хочу сказать что вышесказанное приводится только в целях тестирования',
        date: '12:34'
    },
    {user: {name: 'Вера', photo: photo}, text: 'Пример', date: '12:34'},
    {user: {name: 'Таня', photo: photo}, text: 'Работы', date: '12:34'}];

export class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {messages: this.messages};
        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(text, user) {
        let date = new Date(Date.now());
        let block = document.getElementById("chatBlock");
        let msg = {
            user: {name: user.name, photo: photo},
            text: text,
            date: `${date.getHours()}:${date.getMinutes()}`
        }
        messages.push(msg);
        this.setState({messages: messages});
            let timer = setTimeout(() => {
                block.scrollTop = block.scrollHeight;
            }, 10)

    }

    render() {
        return (
            <div style={{width:'20%'}}>
                <div id='chatBlock' className='chat_Container'>
                    {messages.map(x => <Message user={x.user} text={x.text} date={x.date}/>)}
                </div>
                <Input sendMsg={this.sendMessage}/>
            </div>
        );
    }
}

class Message extends Component {
    constructor(props) {
        super(props);
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

                <div className='MessageContainer'>
                    <h2>{this.props.text}</h2>
                    <h3>{this.props.date}</h3>
                </div>
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
            this.props.sendMsg(input.value, {name: 'Вера', photo: photo});
            input.value = '';
        }
    }

    render() {
        return (
            <div className='Input_Container'>
                <input ref={this.inputRef} placeholder='Введите сообщение' className='Input'/>
                <button className='sendButton' onClick={this.Send}>Send</button>
            </div>
        );
    }
}