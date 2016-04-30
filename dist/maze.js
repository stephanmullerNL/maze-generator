(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Maze = function () {
    function Maze(width, height) {
        _classCallCheck(this, Maze);

        this._DIRECTIONS = {
            left: -1,
            right: 1,
            up: -width,
            down: width
        };

        this.width = width;
        this.height = height;

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
                wallSize = 5,
                tileSize = (element.width - (this.width + 1) * wallSize) / this.width;

            this.tiles.forEach(function (value, tile) {
                var col = _this.getColumn(tile),
                    row = _this.getRow(tile),
                    x = Math.floor(col / 2) * wallSize + (Math.floor(col / 2) + col % 2 - 1) * tileSize,
                    y = Math.floor(row / 2) * wallSize + (Math.floor(row / 2) + row % 2 - 1) * tileSize,
                    width = col % 2 ? wallSize : tileSize,
                    height = row % 2 ? wallSize : tileSize;

                canvas.fillStyle = ['white', 'black'][value];
                canvas.fillRect(x, y, width, height);
            });
        }
    }, {
        key: 'getAllowedDirections',
        value: function getAllowedDirections(tile) {
            var _this2 = this;

            // TODO: move check to getNextTile
            var onlyAdjacentTiles = function onlyAdjacentTiles(direction) {
                var tileNumber = _this2.getNextTile(tile, direction),
                    sameRow = _this2.getRow(tileNumber) === _this2.getRow(tile),
                    sameCol = _this2.getColumn(tileNumber) === _this2.getColumn(tile);

                return sameRow || sameCol;
            };

            var notVisited = function notVisited(direction) {
                var tileNumber = _this2.getNextTile(tile, direction),
                    nextTile = _this2.tiles[tileNumber];

                return nextTile && !nextTile.visited;
            };

            var allowed = Object.keys(this._DIRECTIONS).filter(onlyAdjacentTiles).filter(notVisited);

            // Return null instead of empty array so we can use the method in a while condition
            return allowed.length > 0 ? allowed : null;
        }
    }, {
        key: 'getColumn',
        value: function getColumn(tile) {
            return Math.floor(tile % this.columns) + 1;
        }
    }, {
        key: 'getNextTile',
        value: function getNextTile(tile, direction) {
            return tile + this._DIRECTIONS[direction];
        }

        // Takes any direction and returns the opposite by performing magic on the array
        // index. 0 <-> 1, 2 <-> 3, etc.

    }, {
        key: 'getOppositeDirection',
        value: function getOppositeDirection(direction) {
            var directions = Object.keys(this._DIRECTIONS),
                index = directions.indexOf(direction),
                opposite = index % 2 ? -1 : 1;

            return directions[index + opposite];
        }
    }, {
        key: 'getRow',
        value: function getRow(tile) {
            return Math.ceil((tile + 1) / this.columns);
        }
    }, {
        key: 'isWall',
        value: function isWall(tile) {
            return this.getRow(tile) % 2 === 0 || this.getColumn(tile) % 2 === 0;
        }
    }, {
        key: 'removeWall',
        value: function removeWall(tile, direction) {
            var walls = this.tiles[tile].walls,
                index = walls.indexOf(direction);

            return walls.splice(index, 1);
        }
    }, {
        key: 'columns',
        get: function get() {
            return this.width * 2 + 1;
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
        WIDTH = 3,
        HEIGHT = 3,
        START_TILE = 0,
        START_DIRECTION = 'right',
        maze;

    function init() {
        START_BUTTON.addEventListener('click', start);
    }

    function start() {
        maze = new Maze(WIDTH, HEIGHT);

        //var end = walk(START_TILE - 1, START_DIRECTION);
        //console.log(end);

        maze.draw(MAZE_ELEMENT);
    }

    function drawMaze() {
        //.innerHTML = '';

        maze.tiles.forEach(function (tile) {
            var tileElement = document.createElement('div');

            tile.walls.forEach(function (wall) {
                tileElement.className += ' ' + wall;
            });

            tileElement.addEventListener('click', function () {
                tile.exit = true;
            });

            MAZE_ELEMENT.appendChild(tileElement);
        });
    }

    // TODO: move to separate file, implement variations (depth first, breadth first, stacked, recursive)
    function walk(from, direction) {
        var allowedDirections,
            lastStep,
            tile = maze.getNextTile(from, direction);

        maze.removeWall(tile, maze.getOppositeDirection(direction));
        maze.tiles[tile].visited = true;

        /*jshint boss:true */
        while (allowedDirections = maze.getAllowedDirections(tile)) {
            var rnd = Math.floor(Math.random() * allowedDirections.length),
                nextDirection = allowedDirections[rnd];

            maze.removeWall(tile, nextDirection);

            lastStep = walk(tile, nextDirection);
        }

        return lastStep || tile;
    }

    init();
})();

},{"./Maze.js":1}]},{},[2])


//# sourceMappingURL=maze.js.map