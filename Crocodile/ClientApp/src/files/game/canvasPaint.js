let isDrawing = false;
let canvas = document.getElementById("myCanvas"),
    context = canvas.getContext("2d");
let sizes = {width: canvas.clientWidth, height: canvas.clientHeight};
canvas.width = sizes.width;
canvas.height = sizes.height;

function mouseDown(e) {
    isDrawing = true;
    context.beginPath();
    context.moveTo(e.offsetX, e.offsetY);
    //Отправить точку начала
}

function moveMouse(e) {
    if (isDrawing === true) {
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
        //отправлять точки, можно заносить их в json например и потом после окончания рисования отправить всем весь пакет изменений
    }
}

function mouseOut(e) {
    isDrawing = false;
}

let data = [0.196, 0.189, 0.187, 0.124, 0.123, 0.088, 0.051, 0.042]
let a;
function f(arr) {
    for (let p of arr) {
        a+= p*Math.log2(p);
    }
}


