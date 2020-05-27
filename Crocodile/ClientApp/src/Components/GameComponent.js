import React, {Component} from 'react';
import {Chat} from './Chat'
import { slide as Menu } from 'react-burger-menu';
import { CirclePicker } from 'react-color';
import photo from "../images/game/account.svg";

const signalR = require('@aspnet/signalr');

export class GameComponent extends Component {
    render() {
        return (
            <div id='gameContainer' className='rowContainer'>
                <PaintArea/>
                <Chat/>
            </div>
        )
    }
    // componentDidMount(){        
    //     let gameContainer = document.getElementById('gameContainer');
    //     let x = 
    //     gameContainer.style.transform = `scale(${x})`;
    // }
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

    componentDidMount() {
        const hubConnection = new signalR.HubConnectionBuilder().withUrl("/canvasHub")
            .build();
        this.isDrawing = false;
        this.setState({hubConnection: hubConnection}, () => {            
            let canvas = this.canvasRef.current;
            this.context = canvas.getContext("2d");
            let sizes = {width: canvas.clientWidth, height: canvas.clientHeight};
            canvas.width = sizes.width;
            canvas.height = sizes.height;
            this.state.hubConnection.start().then(() => console.log("Connection started!"));
            this.state.hubConnection.on('ReceiveMessage', (arr, settings) => {
                for (let i = 0; i < arr.length; i++){
                    gameSetting = settings;
                    this.paint(arr.shift())
                }
            })
            this.state.hubConnection.on('ReceiveClear', () => {
                debugger;
                this.context.clearRect(0,0,10000,10000);
            })
        });        
        console.log(this.context);
    }

    mouseDown({nativeEvent}) {

        const {offsetX, offsetY} = nativeEvent;
        this.isDrawing = true;
        this.prevPos = {offsetX,offsetY};
        //TODO Отправить точку начала
    }

    moveMouse({nativeEvent}) {
        if (this.isDrawing === true) {
            const {offsetX, offsetY} = nativeEvent;
            const positionData = {
                start: {...this.prevPos},
                stop: {offsetX,offsetY}
            }
            this.array.push(positionData);
            this.state.hubConnection
                .invoke('SendLines', "GAMEID", this.array, gameSetting)
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
        circle.arc(positionData.start.offsetX, positionData.start.offsetY, gameSetting.penSize/2, 0, Math.PI * 2);
        this.context.fill(circle);
        this.context.lineWidth = gameSetting.penSize;
        this.context.moveTo(positionData.start.offsetX,positionData.start.offsetY);
        this.context.lineTo(positionData.stop.offsetX,positionData.stop.offsetY);
        this.context.stroke();
        this.prevPos = positionData.stop;
    }
    clear(){
        debugger;
        this.state.hubConnection
            .invoke('Clear', "GAMEID")
            .catch(err => console.error(err));
        this.context.clearRect(0,0,10000,10000);
    }

    mouseOut() {
        this.isDrawing = false;
    }

    render() {
        
        return (
            <div className='gameContainer'>
                <Menu disableAutoFocus>
                    <div className='sizeSelector'>
                        <h1 style={{textAlign:'left', marginLeft:'10px',fontSize:'20px'}}>Размер кисти</h1>
                        <input onInput={()=>{gameSetting.penSize = document.getElementById('penSize').value;
                        document.getElementById('sizeValue').innerHTML = gameSetting.penSize}} 
                               type='range' min='1' max='100' defaultValue='1' className='slider' id='penSize'/>
                        <h2 id='sizeValue'>1</h2>
                    </div>
                    <h1 style={{textAlign:'left', marginLeft:'10px',fontSize:'20px'}}>Цвет кисти</h1>
                    <CirclePicker colors={["#000","#fff", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
                        "#00bcd4", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"]}
                                  onChange={(color,event)=>gameSetting.penColor = color.hex}/>
                        <button style={{margin:'40px 0 0 0 ', fontSize:'18px'}} onClick={this.clear}>Очистить</button>
                </Menu>
                <canvas ref={this.canvasRef} className="mainCanvas" onMouseOut={this.mouseOut} onMouseDown={this.mouseDown}
                        onMouseUp={this.mouseOut} onMouseMove={this.moveMouse}
                        style={{height: '640px', width: '1176px'}}/>  
            </div>
        );
    }

}