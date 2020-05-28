import React, {Component} from 'react';
import {Chat} from './Chat'
import {slide as Menu} from 'react-burger-menu';
import {CirclePicker} from 'react-color';
import * as Cookies from 'js-cookie';
import * as Fetchs from "../fetchs";

const signalR = require('@aspnet/signalr');

export class GameComponent extends Component {
    constructor(props) {
        super(props);
        this.gameId = this.props.match.params.id;
        this.state = {currentWord: null};
    }
    componentDidUpdate() {
        Fetchs.updateUsers(this.gameId);
    }

    componentWillUnmount = () => {
        Cookies.remove("gameId");
    };

    render() {
        return (
            <div id='gameContainer' className='rowContainer'>
                <PaintArea gameId={this.gameId}/>
                <Chat editCurrentWord={(x) => this.setState({currentWord: x})} currentWord={this.state.currentWord}
                      gameId={this.gameId}/>
            </div>
        )
    }
}

var gameSetting = {
    penColor: '#000000',
    penSize: 1
}

class PaintArea extends Component {
    isDrawing;
    context;
    prevPos;
    array = [];

    constructor(props) {
        super(props);
        this.state = {
            hubConnection: null
        };
        this.canvasRef = React.createRef();
        this.mouseDown = this.mouseDown.bind(this);
        this.moveMouse = this.moveMouse.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.clear = this.clear.bind(this);
    }

    componentDidUpdate() {
        this.isDrawing = false;
        let canvas = this.canvasRef.current;
        this.context = canvas.getContext("2d");
        let sizes = {width: canvas.clientWidth, height: canvas.clientHeight};
        canvas.width = sizes.width;
        canvas.height = sizes.height;
    }

    componentDidMount() {
        const hubConnection = new signalR.HubConnectionBuilder().withUrl("/canvasHub")
            .build();
        hubConnection.serverTimeoutInMilliseconds = 300000;
        this.isDrawing = false;
        debugger
        this.setState({hubConnection: hubConnection}, () => {
            let canvas = this.canvasRef.current;
            this.context = canvas.getContext("2d");
            let sizes = {width: canvas.clientWidth, height: canvas.clientHeight};
            canvas.width = sizes.width;
            canvas.height = sizes.height;
            this.state.hubConnection.start().then(() => {
                    console.log("Connection started!(Canvas)");
                    this.state.hubConnection
                        .invoke('EnterGame', this.props.gameId)
                        .catch(err => console.error(err));
                }
            );
            this.state.hubConnection.on('ReceiveMessage', (arr, settings) => {
                for (let i = 0; i < arr.length; i++) {
                    gameSetting = settings;
                    this.paint(arr.shift())
                }
            });
            this.state.hubConnection.on('ReceiveClear', () => {
                debugger;
                this.context.clearRect(0, 0, 10000, 10000);
            });
            this.stopHub = () => {
                this.state.hubConnection.stop().then(() => console.log("Connection terminated!(Canvas)"))
            };
        });
        console.log(this.context);
    }

    componentWillUnmount = () => {
        this.stopHub();
        Fetchs.updateUsers(this.props.gameId).then();
    };

    mouseDown({nativeEvent}) {
        const {offsetX, offsetY} = nativeEvent;
        this.isDrawing = Cookies.get("master") === Cookies.get("login");
        this.prevPos = {offsetX, offsetY};
        //TODO Отправить точку начала
    }

    moveMouse({nativeEvent}) {
        if (this.isDrawing === true) {
            const {offsetX, offsetY} = nativeEvent;
            const positionData = {
                start: {...this.prevPos},
                stop: {offsetX, offsetY}
            }
            this.array.push(positionData);
            this.state.hubConnection
                .invoke('SendLines', this.props.gameId, this.array, gameSetting)
                .catch(err => console.error(err));
            this.array = [];
            //отправлять точки, можно заносить их в json например и потом после окончания рисования отправить всем весь пакет изменений
        }
    }

    paint(positionData) {
        this.context.beginPath();
        this.context.strokeStyle = gameSetting.penColor;
        this.context.fillStyle = gameSetting.penColor;
        let circle = new Path2D();
        circle.arc(positionData.start.offsetX, positionData.start.offsetY, gameSetting.penSize / 2, 0, Math.PI * 2);
        this.context.fill(circle);
        this.context.lineWidth = gameSetting.penSize;
        this.context.moveTo(positionData.start.offsetX, positionData.start.offsetY);
        this.context.lineTo(positionData.stop.offsetX, positionData.stop.offsetY);
        this.context.stroke();
        this.prevPos = positionData.stop;
    }

    clear() {
        debugger;
        this.state.hubConnection
            .invoke('Clear', this.props.gameId)
            .catch(err => console.error(err));
        this.context.clearRect(0, 0, 10000, 10000);
    }

    mouseOut() {
        this.isDrawing = false;
    }

    render() {
        return (
            <div className='gameContainer'>
                {Cookies.get("master") === Cookies.get("login") ? <Menu disableAutoFocus>
                    <div className='sizeSelector'>
                        <h1 style={{textAlign: 'left', marginLeft: '10px', fontSize: '20px'}}>Размер кисти</h1>
                        <input onInput={() => {
                            gameSetting.penSize = document.getElementById('penSize').value;
                            document.getElementById('sizeValue').innerHTML = gameSetting.penSize
                        }}
                               type='range' min='1' max='100' defaultValue='1' className='slider' id='penSize'/>
                        <h2 id='sizeValue'>1</h2>
                    </div>
                    <h1 style={{textAlign: 'left', marginLeft: '10px', fontSize: '20px'}}>Цвет кисти</h1>
                    <CirclePicker
                        colors={["#000", "#fff", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
                            "#00bcd4", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"]}
                        onChange={(color, event) => gameSetting.penColor = color.hex}/>
                    <button style={{margin: '40px 0 0 0 ', fontSize: '18px'}} onClick={this.clear}>Очистить</button>
                </Menu> : null}
                <canvas ref={this.canvasRef} className="mainCanvas" onMouseOut={this.mouseOut}
                        onMouseDown={this.mouseDown}
                        onMouseUp={this.mouseOut} onMouseMove={this.moveMouse}
                        style={{height: 'calc(100% - 1em)', width: '1176px'}}/>
            </div>
        );
    }

}