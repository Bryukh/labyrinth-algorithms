var CELL = 30;
var STEP_TIME = 200;

function drawMaze(mazeBase, svg) {
    var height = mazeBase.length,
        width = mazeBase[0].length;
    var mazeElements = [];
    svg.attr({"width": CELL * width, "height": CELL * height});
    for (var h = 0; h < height; h++) {
        var row = [];
        for (var w = 0; w < width; w++) {
            var r = svg.rect(w * CELL, h * CELL, CELL, CELL);
            r.addClass("cell");
            r.addClass(mazeBase[h][w] == 1 ? "wall" : "empty");
            row.push(r);
        }
        mazeElements.push(row);
    }
    return mazeElements;
}

function recolorMaze(mazeEl) {
    var height = mazeEl.length,
        width = mazeEl[0].length;
    for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {
            var r = mazeEl[h][w];
            setTimeout((function (el) {
                return function () {
                    el.addClass("recolor");
                }
            }(r)), (h * width + w) * STEP_TIME);
        }
    }
}

function createGraph(mazeBase, svg) {
    var height = mazeBase.length,
        width = mazeBase[0].length;
    svg.attr({"width": CELL * width, "height": CELL * height});
    for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {

            if (mazeBase[h][w] === 0) {
                var t = setTimeout((function (j, k) {
                    return function () {
                        if (mazeBase[j + 1] && mazeBase[j + 1][k] === 0) {
                            var p = svg.path(Snap.format("M{x},{y}L{x},{y}",
                                {
                                    x: (k + 0.5) * CELL,
                                    y: (j + 0.5) * CELL
                                }));
                            p.addClass("graph-edge");
                            p.animate(
                                {
                                    "path": Snap.format("M{x},{y1}L{x},{y2}",
                                        {
                                            x: (k + 0.5) * CELL,
                                            y1: (j + 0.5) * CELL,
                                            y2: (j + 1.5) * CELL
                                        })
                                }, STEP_TIME);
                            var c = svg.circle((k + 0.5) * CELL, (j + 1.5) * CELL, 0).addClass("cell graph-node");
                            c.animate({"r": CELL / 3}, STEP_TIME);
                        }
                        if (mazeBase[j][k + 1] === 0) {
                            p = svg.path(Snap.format("M{x},{y}L{x},{y}",
                                {
                                    x: (k + 0.5) * CELL,
                                    y: (j + 0.5) * CELL
                                }));
                            p.addClass("graph-edge");
                            p.animate(
                                {
                                    "path": Snap.format("M{x1},{y}L{x2},{y}",
                                        {
                                            x1: (k + 0.5) * CELL,
                                            x2: (k + 1.5) * CELL,
                                            y: (j + 0.5) * CELL
                                        })
                                }, STEP_TIME);
                            c = svg.circle((k + 1.5) * CELL, (j + 0.5) * CELL, 0).addClass("cell graph-node");
                            c.animate({"r": CELL / 3}, STEP_TIME);
                        }

                        c = svg.circle((k + 0.5) * CELL, (j + 0.5) * CELL, 0).addClass("cell graph-node");
                        c.animate({"r": CELL / 3}, STEP_TIME);
                    }
                })(h, w), (h * width + w) * STEP_TIME);
                svg.timeouts.push(t);
            }
        }
    }
}