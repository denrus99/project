import React, {Component} from 'react';
import {Chat} from './Chat'
import {Input} from "reactstrap";

export class GameComponent extends Component {
    render() {
        return (
            <div className='rowContainer'>
                <PaintArea/>
                {/*<Tools/>*/}
                <Chat/>
            </div>
        );
    }
}

class PaintArea extends Component {
    isDrawing;
    context;
    prevPos;

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.mouseDown = this.mouseDown.bind(this);
        this.moveMouse = this.moveMouse.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
    }

    componentDidMount() {
        this.isDrawing = false;
        let canvas = this.canvasRef.current;
        this.context = canvas.getContext("2d");
        let sizes = {width: canvas.clientWidth, height: canvas.clientHeight};
        canvas.width = sizes.width;
        canvas.height = sizes.height;
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
            this.paint(positionData);
            //отправлять точки, можно заносить их в json например и потом после окончания рисования отправить всем весь пакет изменений
        }
    }

    paint(positionData) {
        this.context.beginPath();
        this.context.moveTo(positionData.start.offsetX,positionData.start.offsetY);
        this.context.lineTo(positionData.stop.offsetX,positionData.stop.offsetY);
        this.context.stroke();
        this.prevPos = positionData.stop;
    }

    mouseOut() {
        this.isDrawing = false;
    }

    render() {

        return (
            <div>
                <canvas ref={this.canvasRef} className="mainCanvas" onMouseOut={this.mouseOut} onMouseDown={this.mouseDown}
                        onMouseUp={this.mouseOut} onMouseMove={this.moveMouse}
                        style={{height: '80em', width: '147em'}}/>  
            </div>
        );
    }

}