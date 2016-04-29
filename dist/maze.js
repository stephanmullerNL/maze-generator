(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Maze = function () {
    function Maze(width, height) {
        _classCallCheck(this, Maze);

        // TODO: don't use objects but simply 1 for wall and 0 for path
        var DEFAULT_TILE = {
            visited: false,
            walls: ['left', 'right', 'up', 'down']
        };

        this._DIRECTIONS = {
            left: -1,
            right: 1,
            up: -width,
            down: width
        };

        this.width = width;
        this.height = height;
        this.tiles = [];

        for (var i = 0; i < width * height; i++) {
            this.tiles[i] = JSON.parse(JSON.stringify(DEFAULT_TILE));
        }
    }

    _createClass(Maze, [{
        key: 'getAllowedDirections',
        value: function getAllowedDirections(tile) {
            var _this = this;

            // TODO: move check to getNextTile
            var onlyAdjacentTiles = function onlyAdjacentTiles(direction) {
                var tileNumber = _this.getNextTile(tile, direction),
                    sameRow = _this.getRow(tileNumber) === _this.getRow(tile),
                    sameCol = _this.getColumn(tileNumber) === _this.getColumn(tile);

                return sameRow || sameCol;
            };

            var notVisited = function notVisited(direction) {
                var tileNumber = _this.getNextTile(tile, direction),
                    nextTile = _this.tiles[tileNumber];

                return nextTile && !nextTile.visited;
            };

            var allowed = Object.keys(this._DIRECTIONS).filter(onlyAdjacentTiles).filter(notVisited);

            // Return null instead of empty array so we can use the method in a while condition
            return allowed.length > 0 ? allowed : null;
        }
    }, {
        key: 'getColumn',
        value: function getColumn(tile) {
            return Math.floor((tile + 1) % this.width);
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
            return Math.ceil((tile + 1) / this.width);
        }
    }, {
        key: 'removeWall',
        value: function removeWall(tile, direction) {
            var walls = this.tiles[tile].walls,
                index = walls.indexOf(direction);

            return walls.splice(index, 1);
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
        WIDTH = 50,
        HEIGHT = 50,
        START_TILE = 0,
        START_DIRECTION = 'right',
        maze;

    function init() {
        START_BUTTON.addEventListener('click', start);

        MAZE_ELEMENT.style.width = WIDTH + 'em';
        MAZE_ELEMENT.style.height = HEIGHT + 'em';
    }

    function start() {
        maze = new Maze(WIDTH, HEIGHT);

        var end = walk(START_TILE - 1, START_DIRECTION);
        console.log(end);

        drawMaze();
    }

    // TODO: canvas?
    function drawMaze() {
        MAZE_ELEMENT.innerHTML = '';

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
