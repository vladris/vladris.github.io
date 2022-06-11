// Makes matrix of desired width x height plus an initial configuration of "on" cells and wrap-around flag
function makeMatrix(width, height, initialConfig, wrap) {
    var m = new Array(height);
    // If not wrap-around, add some padding
    if (!wrap) {
        height += 4;
        width += 4;
    }
    for (var i = 0; i < height; i++) {
        m[i] = new Array(width);
        for (var j = 0; j < width; j++) {
            m[i][j] = false;
        }
    }
    for (var coord in initialConfig) {
        m[initialConfig[coord][0]][initialConfig[coord][1]] = true;
    }
    return { m: m, wrap: wrap };
}
// Counts "on" neighbors without wrap-around
function neighborsNoWrap(matrix, i, j) {
    var m = matrix.m;
    var result = 0;
    if (i > 0) {
        if (j > 0) {
            result += +m[i - 1][j - 1];
        }
        result += +m[i - 1][j];
        if (j < m[0].length - 1) {
            result += +m[i - 1][j + 1];
        }
    }
    if (j > 0) {
        result += +m[i][j - 1];
    }
    if (j < m[0].length - 1) {
        result += +m[i][j + 1];
    }
    if (i < m.length - 1) {
        if (j > 0) {
            result += +m[i + 1][j - 1];
        }
        result += +m[i + 1][j];
        if (j < m[0].length - 1) {
            result += +m[i + 1][j + 1];
        }
    }
    return result;
}
// Counts "on" neighbors with wrap-around
function neighborsWrap(matrix, i, j) {
    var m = matrix.m;
    // Wraparound
    var fst_i = i != 0 ? i - 1 : m.length - 1;
    var fst_j = j != 0 ? j - 1 : m[0].length - 1;
    var lst_i = i + 1 != m.length ? i + 1 : 0;
    var lst_j = j + 1 != m[0].length ? j + 1 : 0;
    return +m[fst_i][fst_j] + +m[fst_i][j] + +m[fst_i][lst_j] +
        +m[i][fst_j] + +m[i][lst_j] +
        +m[lst_i][fst_j] + +m[lst_i][j] + +m[lst_i][lst_j];
}
// Count "on" neighbors
function neighbors(matrix, i, j) {
    return matrix.wrap ? neighborsWrap(matrix, i, j) : neighborsNoWrap(matrix, i, j);
}
// Computes next state and update matrix
function step(matrix) {
    var m2 = new Array(matrix.m.length);
    for (var i = 0; i < matrix.m.length; i++) {
        m2[i] = new Array(matrix.m[0].length);
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
// Draws the cell grid
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
// Draws matrix state
function drawState(params, matrix) {
    for (var i = 0; i < params.height; i++) {
        for (var j = 0; j < params.width; j++) {
            if (matrix.m[i][j]) {
                params.ctx.fillRect(j * params.cellSize, i * params.cellSize, params.cellSize, params.cellSize);
            }
        }
    }
}
// Draws grid and state
function draw(params, matrix) {
    drawGrid(params);
    drawState(params, matrix);
}
// Keeps track of current running interval & play/stop button
var running = { intervalId: 0, button: undefined };
// Starts animation
function start(params, matrix) {
    return setInterval(function () {
        draw(params, matrix);
        step(matrix);
    }, 200);
}
// Stops currently running animation
function stopRunning() {
    if (running.intervalId === 0) {
        return;
    }
    // Stop interval and update button to say "Play"
    clearInterval(running.intervalId);
    running.button.textContent = "Play";
    // Nothing running anymore
    running = { intervalId: 0, button: undefined };
}
// Animates cellular automata in target div
function animate(width, height, initialConfig, targetDiv, wrap) {
    if (wrap === void 0) { wrap = true; }
    var m = makeMatrix(width, height, initialConfig, wrap);
    var cellSize = 10;
    var div = document.getElementById(targetDiv);
    // Create play button
    var button = document.createElement("button");
    button.style.display = "block";
    button.textContent = "Play";
    button.onclick = function () {
        // If stopped (button reads "Play") stop currently running animation and start this one
        if (button.textContent === "Play") {
            stopRunning();
            running = { intervalId: start({ ctx: ctx, width: width, height: height, cellSize: cellSize }, m), button: button };
            button.textContent = "Stop";
        }
        // Else this is the running animation, so just stop it
        else {
            stopRunning();
        }
    };
    // Create canvas to render in
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = width * cellSize;
    canvas.height = height * cellSize;
    // Append new elements to div
    div.appendChild(button);
    div.appendChild(canvas);
    // Draw initial state
    draw({ ctx: ctx, width: width, height: height, cellSize: cellSize }, m);
}
