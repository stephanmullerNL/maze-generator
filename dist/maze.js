(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: implement weakmaps
var PATH = 0,
    WALL = 1,
    VISITED = 2;

module.exports = function () {
    function _class(element, width, height) {
        _classCallCheck(this, _class);

        var tiles = (width * 2 + 1) * (height * 2 + 1);

        // TODO: move to private vars but with getters/setters
        this.width = width;
        this.height = height;
        this.columns = width * 2 + 1;
        this.rows = height * 2 + 1;

        this.wallSize = Math.ceil(40 / width);
        this.roomSize = Math.floor((element.width - (width + 1) * this.wallSize) / width);

        this._DIRECTIONS = {
            left: -1,
            right: 1,
            up: -this.columns,
            down: this.columns
        };

        this._element = element;
        this._canvas = element.getContext('2d');

        this.tiles = new Array(tiles).fill(WALL);
    }

    _createClass(_class, [{
        key: 'drawMaze',
        value: function drawMaze() {
            var _this = this;

            this._canvas.clearRect(0, 0, this._element.width, this._element.height);

            this.tiles.forEach(function (type, tile) {
                // TODO: color map as private const
                var color = ['white', 'black'][type];
                _this.drawTile(tile, color);
            });
        }
    }, {
        key: 'drawSolution',
        value: function drawSolution(steps, end) {
            var _this2 = this;

            var path = [],
                tile = end;

            var drawTileLoop = function drawTileLoop(tile) {
                if (tile) {
                    _this2.drawTile(tile, 'red');
                    tile = path.pop();
                    _this2.drawTile(tile, 'red');
                    tile = path.pop();

                    setTimeout(function () {
                        drawTileLoop(tile);
                    }, 5);
                }
            };

            /*jshint boss:true */
            do {
                path.push(tile);
            } while (tile = steps[tile]);

            drawTileLoop(path.pop());
        }
    }, {
        key: 'drawTile',
        value: function drawTile(tile, color) {
            var col = this.getColumn(tile),
                row = this.getRow(tile),
                x = Math.ceil(col / 2) * this.wallSize + (Math.ceil(col / 2) - col % 2) * this.roomSize,
                y = Math.ceil(row / 2) * this.wallSize + (Math.ceil(row / 2) - row % 2) * this.roomSize,
                width = col % 2 ? this.roomSize : this.wallSize,
                height = row % 2 ? this.roomSize : this.wallSize;

            this._canvas.fillStyle = color;
            this._canvas.fillRect(x, y, width, height);
        }
    }, {
        key: 'generatePath',
        value: function generatePath(start, end) {
            // TODO: move to separate file?
            // TODO: implement variations (depth first, breadth first, stacked, recursive)
            var direction = this.getAllowedDirections(start, WALL)[0];

            try {
                this.walk(start, direction);
            } catch (e) {
                alert(e + "\n\nTry generating a smaller maze or use the stacked approach (coming soon)");
            }

            this.setTile(end, 0);
        }
    }, {
        key: 'walk',
        value: function walk(from, direction) {
            var allowedDirections = void 0,
                lastStep = void 0,
                wall = this.isWall(from) ? from : this.getNextTile(from, direction),
                room = this.getNextTile(wall, direction);

            this.setTile(wall, PATH);
            this.setTile(room, PATH);

            /*jshint boss:true */
            while (allowedDirections = this.getAllowedDirections(room, WALL, 2)) {
                // TODO: Add option for horizontal/vertical bias
                var rnd = Math.floor(Math.random() * allowedDirections.length),
                    nextDirection = allowedDirections[rnd];

                lastStep = this.walk(room, nextDirection);
            }

            return lastStep || room;
        }
    }, {
        key: 'getAllowedDirections',
        value: function getAllowedDirections(tile, allowedType) {
            var _this3 = this;

            var step = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

            var allowed = Object.keys(this._DIRECTIONS).filter(function (direction) {

                var nextRoom = tile;

                for (var i = 0; i < step; i++) {
                    nextRoom = _this3.getNextTile(nextRoom, direction);

                    var type = _this3.getTileType(nextRoom),
                        isAllowed = type === allowedType,
                        isIntersection = _this3.isIntersection(nextRoom);

                    if (!isAllowed || isIntersection) {
                        return false;
                    }
                }

                return true;
            });

            // Return null instead of empty array so we can use the method in a while condition
            return allowed.length > 0 ? allowed : null;
        }
    }, {
        key: 'getColumn',
        value: function getColumn(tile) {
            return Math.floor(tile % this.columns);
        }
    }, {
        key: 'getNextTile',
        value: function getNextTile(tile, direction) {
            var next = tile + this._DIRECTIONS[direction];

            return this.isAdjacent(tile, next) ? next : null;
        }
    }, {
        key: 'getRow',
        value: function getRow(tile) {
            return Math.floor(tile / this.columns);
        }
    }, {
        key: 'getTileType',
        value: function getTileType(tile) {
            return this.tiles[tile];
        }
    }, {
        key: 'isAdjacent',
        value: function isAdjacent(tile, next) {
            return this.getRow(tile) === this.getRow(next) || this.getColumn(tile) === this.getColumn(next);
        }
    }, {
        key: 'isIntersection',
        value: function isIntersection(tile) {
            return this.getRow(tile) % 2 === 0 && this.getColumn(tile) % 2 === 0;
        }
    }, {
        key: 'isWall',
        value: function isWall(tile) {
            return this.getRow(tile) % 2 === 0 || this.getColumn(tile) % 2 === 0;
        }
    }, {
        key: 'setTile',
        value: function setTile(tile, type) {
            this.tiles[tile] = type;
        }
    }, {
        key: 'solve',
        value: function solve(start, end) {
            var _this4 = this;

            var steps = {},
                queue = [start];

            this._resetSolution();

            // TODO: find a better fix for private/inner functions
            var markVisited = function markVisited(tile, previous) {
                steps[tile] = previous;

                _this4.setTile(tile, VISITED);
                _this4.drawTile(tile, '#FF9999');
            },
                solveNextTile = function solveNextTile(current, direction) {
                var tile = _this4.getNextTile(current, direction);

                markVisited(tile, current);

                if (tile === end) {
                    queue = [];
                } else {
                    queue.push(tile);
                }
            },
                solveLoop = function solveLoop(tile) {
                if (tile) {
                    var directions = _this4.getAllowedDirections(tile, PATH) || [];

                    directions.forEach(function (direction) {
                        solveNextTile(tile, direction);
                    });

                    setTimeout(function () {
                        solveLoop(queue.shift());
                    }, 10);
                } else {
                    _this4.drawSolution(steps, end);
                }
            };

            markVisited(start);

            solveLoop(queue.shift());
        }
    }, {
        key: '_logMaze',
        value: function _logMaze() {
            var _this5 = this;

            var output = '';

            this.tiles.forEach(function (tile, i) {
                output += tile;

                if ((i + 1) % _this5.columns === 0) {
                    output += '\n';
                }
            });

            console.log(output);
        }
    }, {
        key: '_resetSolution',
        value: function _resetSolution() {
            this.tiles = this.tiles.map(function (tile) {
                return tile !== WALL ? PATH : WALL;
            });

            this.drawMaze();
        }
    }]);

    return _class;
}();

},{}],2:[function(require,module,exports){
'use strict';

// TODO: split into modules
// TODO: MazeGenerator class?
// TODO: implement options object as argument
// TODO: implement maze solver
(function () {

    var Maze = require('./Maze.js'),


    // TODO: put in one SETTINGS object
    MAZE_ELEMENT = document.getElementById('maze'),
        START_BUTTON = document.getElementById('start'),
        SOLVE__BUTTON = document.getElementById('solve'),
        WIDTH = 50,
        HEIGHT = 50,


    // TODO: make start tile customizable
    START = 1,

    // TODO: let user pick end point after generating
    END = (WIDTH * 2 + 1) * (HEIGHT * 2 + 1) - 2,
        maze;

    function init() {
        START_BUTTON.addEventListener('click', start);
        SOLVE__BUTTON.addEventListener('click', solve);
    }

    function start() {
        maze = new Maze(MAZE_ELEMENT, WIDTH, HEIGHT);

        maze.generatePath(START, END);
        maze.drawMaze();

        SOLVE__BUTTON.removeAttribute('disabled');
    }

    function solve() {
        maze.solve(START, END);
    }

    init();
})();

},{"./Maze.js":1}]},{},[2])


//# sourceMappingURL=maze.js.map
