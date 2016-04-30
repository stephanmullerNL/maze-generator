(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Maze = function () {
    function Maze(width, height) {
        _classCallCheck(this, Maze);

        this.width = width;
        this.height = height;

        this._DIRECTIONS = {
            left: -1,
            right: 1,
            up: -this.columns,
            down: this.columns
        };

        this.tiles = new Array((width * 2 + 1) * (height * 2 + 1)).fill(1);
    }

    _createClass(Maze, [{
        key: 'draw',
        value: function draw(element) {
            var _this = this;

            if (element.tagName !== 'CANVAS') {
                throw new Error('Please supply a canvas element to draw on');
            }

            var canvas = element.getContext('2d'),
                wallSize = 1,
                // TODO: calculate or make customisable
            tileSize = (element.width - (this.width + 1) * wallSize) / this.width;

            canvas.clearRect(0, 0, element.width, element.height);

            this.tiles.forEach(function (value, tile) {
                var col = _this.getColumn(tile),
                    // TODO: figure out new algorithms for 0-indexed
                row = _this.getRow(tile),
                    x = Math.ceil(col / 2) * wallSize + (Math.ceil(col / 2) - col % 2) * tileSize,
                    y = Math.ceil(row / 2) * wallSize + (Math.ceil(row / 2) - row % 2) * tileSize,
                    width = col % 2 ? tileSize : wallSize,
                    height = row % 2 ? tileSize : wallSize;

                canvas.fillStyle = ['white', 'black'][value];
                canvas.fillRect(x, y, width, height);
            });
        }
    }, {
        key: 'generatePath',
        value: function generatePath(start, end) {
            // TODO: move to separate file?
            // TODO: implement variations (depth first, breadth first, stacked, recursive)
            var direction = this.getAllowedDirections(start)[0];

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

            // Mark as visited
            this.setTile(wall, 0);
            this.setTile(room, 0);

            this._log();

            /*jshint boss:true */
            while (allowedDirections = this.getAllowedDirections(room)) {
                // TODO: Add option for horizontal/vertical bias
                var rnd = Math.floor(Math.random() * allowedDirections.length),
                    nextDirection = allowedDirections[rnd];

                lastStep = this.walk(room, nextDirection);
            }

            return lastStep || room;
        }
    }, {
        key: 'getAllowedDirections',
        value: function getAllowedDirections(tile) {
            var _this2 = this;

            var allowed = Object.keys(this._DIRECTIONS).filter(function (direction) {

                var nextWall = _this2.isWall(tile) ? tile : _this2.getNextTile(tile, direction),
                    nextRoom = _this2.getNextTile(nextWall, direction);

                return !_this2.isWall(nextRoom) && !!_this2.getTile(nextRoom);
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
        key: 'getTile',
        value: function getTile(tile) {
            return this.tiles[tile];
        }
    }, {
        key: 'isAdjacent',
        value: function isAdjacent(tile, next) {
            return this.getRow(tile) === this.getRow(next) || this.getColumn(tile) === this.getColumn(next);
        }
    }, {
        key: 'isEdge',
        value: function isEdge(tile) {
            return this.getColumn(tile) === 0 || this.getRow(tile) === 0 || this.getColumn(tile) === this.columns - 1 || this.getRow(tile) === this.rows - 1;
        }
    }, {
        key: 'isWall',
        value: function isWall(tile) {
            return this.getRow(tile) % 2 === 0 || this.getColumn(tile) % 2 === 0;
        }
    }, {
        key: 'setTile',
        value: function setTile(tile, value) {
            this.tiles[tile] = value;
        }
    }, {
        key: '_log',
        value: function _log() {
            var _this3 = this;

            var output = '';

            this.tiles.forEach(function (tile, i) {
                output += tile;

                if ((i + 1) % _this3.columns === 0) {
                    output += '\n';
                }
            });

            console.log(output);
        }
    }, {
        key: 'columns',
        get: function get() {
            return this.width * 2 + 1;
        }
    }, {
        key: 'rows',
        get: function get() {
            return this.height * 2 + 1;
        }
    }]);

    return Maze;
}();

module.exports = Maze;

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
        WIDTH = 2,
        HEIGHT = 2,


    // TODO: make start tile customizable
    START = 1,

    // TODO: let user pick end point after generating
    END = (WIDTH * 2 + 1) * (HEIGHT * 2 + 1) - 2;

    function init() {
        START_BUTTON.addEventListener('click', start);
    }

    function start() {
        var maze = new Maze(WIDTH, HEIGHT);

        maze.generatePath(START, END);

        maze.draw(MAZE_ELEMENT);
    }

    init();
})();

},{"./Maze.js":1}]},{},[2])


//# sourceMappingURL=maze.js.map
