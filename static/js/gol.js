function makeMatrix(width, height, initialConfig) {
    var m = [];
    for (var i = 0; i < height; i++) {
        m[i] = [];
        for (var j = 0; j < width; j++) {
            m[i][j] = false;
        }
    }
    for (var coord in initialConfig) {
        m[initialConfig[coord][0]][initialConfig[coord][1]] = 1;
    }
    return { m: m };
}
function neighbors(matrix, i, j) {
    var m = matrix.m;
    var fst_i = i != 0 ? i - 1 : m.length - 1;
    var fst_j = j != 0 ? j - 1 : m[0].length - 1;
    var lst_i = i + 1 != m.length ? i + 1 : 0;
    var lst_j = j + 1 != m[0].length ? j + 1 : 0;
    return +m[fst_i][fst_j] + +m[fst_i][j] + +m[fst_i][lst_j] +
        +m[i][fst_j] + +m[i][lst_j] +
        +m[lst_i][fst_j] + +m[lst_i][j] + +m[lst_i][lst_j];
}
function step(matrix) {
    var m2 = [];
    for (var i = 0; i < matrix.m.length; i++) {
        m2[i] = [];
        for (var j = 0; j < matrix.m[0].length; j++) {
            var n = neighbors(matrix, i, j);
            if (n == 3) {
                m2[i][j] = true;
            }
            else if (n == 2 && matrix.m[i][j]) {
                m2[i][j] = true;
            }
            else {
                m2[i][j] = false;
            }
        }
    }
    matrix.m = m2;
}
function drawGrid(params) {
    params.ctx.clearRect(0, 0, params.width * params.cellSize, params.height * params.cellSize);
    params.ctx.strokeStyle = "lightGray";
    params.ctx.fillStyle = "black";
    params.ctx.rect(0, 0, params.width * params.cellSize, params.height * params.cellSize);
    params.ctx.stroke();
    for (var i = 0; i < params.height; i++) {
        params.ctx.moveTo(0, i * params.cellSize);
        params.ctx.lineTo(params.width * params.cellSize, i * params.cellSize);
        params.ctx.stroke();
    }
    for (var j = 0; j < params.width; j++) {
        params.ctx.moveTo(j * params.cellSize, 0);
        params.ctx.lineTo(j * params.cellSize, params.height * params.cellSize);
        params.ctx.stroke();
    }
}
function drawState(params, matrix) {
    for (var i = 0; i < params.height; i++) {
        for (var j = 0; j < params.width; j++) {
            if (matrix.m[i][j]) {
                params.ctx.fillRect(j * params.cellSize, i * params.cellSize, params.cellSize, params.cellSize);
            }
        }
    }
}
function draw(params, matrix) {
    drawGrid(params);
    drawState(params, matrix);
}
function start(params, matrix) {
    return setInterval(function () {
        draw(params, matrix);
        step(matrix);
    }, 500);
}
var running = { intervalId: 0, button: undefined };
function stopRunning() {
    if (running.intervalId != 0) {
        clearInterval(running.intervalId);
        running.button.textContent = "Play";
        running = { intervalId: 0, button: undefined };
    }
}
function animate(width, height, initialConfig, targetDiv) {
    var m = makeMatrix(width, height, initialConfig);
    var intervalId = 0;
    var cellSize = 10;
    var div = document.getElementById(targetDiv);
    var button = document.createElement("button");
    button.style.display = "block";
    button.textContent = "Play";
    button.onclick = function () {
        if (button.textContent === "Play") {
            stopRunning();
            running = { intervalId: start({ ctx: ctx, width: width, height: height, cellSize: cellSize }, m), button: button };
            button.textContent = "Stop";
        }
        else {
            stopRunning();
        }
    };
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = width * cellSize;
    canvas.height = height * cellSize;
    div.appendChild(button);
    div.appendChild(canvas);
    draw({ ctx: ctx, width: width, height: height, cellSize: cellSize }, m);
}
