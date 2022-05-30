function makeMatrix(width, height, initialConfig) {
    var m = [];
    for (var i = 0; i < height; i++) {
        m[i] = [];
        for (var j = 0; j < width; j++) {
            m[i][j] = 0;
        }
    }
    for (var coord in initialConfig) {
        m[initialConfig[coord][0]][initialConfig[coord][1]] = 1;
    }
    return m;
}
function neighbors(m, i, j) {
    var fst_i = i != 0 ? i - 1 : m.length - 1;
    var fst_j = j != 0 ? j - 1 : m[0].length - 1;
    var lst_i = i + 1 != m.length ? i + 1 : 0;
    var lst_j = j + 1 != m[0].length ? j + 1 : 0;
    return m[fst_i][fst_j] + m[fst_i][j] + m[fst_i][lst_j] +
        m[i][fst_j] + m[i][lst_j] +
        m[lst_i][fst_j] + m[lst_i][j] + m[lst_i][lst_j];
}
function step(m1) {
    var m2 = [];
    for (var i = 0; i < m1.length; i++) {
        m2[i] = [];
        for (var j = 0; j < m1[0].length; j++) {
            var n = neighbors(m1, i, j);
            if (n == 3) {
                m2[i][j] = 1;
            }
            else if (n == 2 && m1[i][j] == 1) {
                m2[i][j] = 1;
            }
            else {
                m2[i][j] = 0;
            }
        }
    }
    return m2;
}
function animate(width, height, initialConfig, targetCanvas) {
    var m = makeMatrix(width, height, initialConfig);
    var cellSize = 10;
    var c = document.getElementById(targetCanvas);
    var ctx = c.getContext("2d");
    var w = width * cellSize;
    var h = height * cellSize;
    c.width = w;
    c.height = h;
    setInterval(function () {
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = "lightGray";
        ctx.fillStyle = "black";
        ctx.rect(0, 0, w, h);
        ctx.stroke();
        for (var i = 0; i < height; i++) {
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(w, i * cellSize);
            ctx.stroke();
        }
        for (var j = 0; j < width; j++) {
            ctx.moveTo(j * cellSize, 0);
            ctx.lineTo(j * cellSize, h);
            ctx.stroke();
        }
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                if (m[i][j] == 1) {
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                }
            }
        }
        m = step(m);
    }, 200);
}
