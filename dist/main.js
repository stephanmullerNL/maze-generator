(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const PATH = 0;
const WALL = 1;

class Algorithms {

    depthFirstSearch(maze, from, direction) {
        let path = [];
        let x = 0;

        const getDirections = function(from, direction) {
            let directions = maze.getAllowedDirections(from, WALL, 2).filter((direction) => {
                let tile = maze.getNextTile(from, direction);
                return path.indexOf(tile) === -1
            });

            return directions.length ? directions : null;
        };

        const walk = function(from, direction) {
            let allowedDirections,
                lastStep,
                wall = maze.isWall(from) ? from : maze.getNextTile(from, direction),
                room = maze.getNextTile(wall, direction);

            path.push(wall);
            path.push(room);
            //maze.setTile(wall, PATH);
            //maze.setTile(room, PATH);

            /*jshint boss:true */
            while((allowedDirections = getDirections(room, direction)) && x++ < maze.tiles.length) {
                // TODO: Add option for horizontal/vertical bias
                let rnd = Math.floor(Math.random() * allowedDirections.length),
                    nextDirection = allowedDirections[rnd];

                lastStep = walk(room, nextDirection);
            }

            return lastStep || room;
        };

        try {
            walk(from, direction);
        } catch (e) {
            alert(e + "\n\nTry generating a smaller maze or use the stacked approach (coming soon)");
        }

        return path;
    }
}

module.exports = new Algorithms();
},{}],2:[function(require,module,exports){
// TODO: unit tests
// TODO: implement weakmaps
const PATH = 0;
const WALL = 1;
const VISITED = 2;

const Algorithms = require('./Algorithms.js');

module.exports = class {

    constructor(element, width, height) {
        const tiles = (width * 2 + 1) * (height * 2 + 1);
        const maxDimension = Math.max(width, height);

        this.wallSize = Math.ceil(40 / maxDimension);
        this.roomSize = Math.floor((element.width - ((maxDimension + 1) * this.wallSize)) / maxDimension);

        this._columns = width * 2 + 1;
        this._rows = height * 2 + 1;
        
        this._DIRECTIONS = {
            left: -1,
            right: 1,
            up: -this._columns,
            down: this._columns
        };
        
        this._element = element;
        this._canvas = element.getContext('2d');

        this.tiles = new Array(tiles).fill(WALL);
    }

    drawMaze(path) {
        let maze = this.tiles;

        if(path) {
            path.forEach((tile) => {
                maze[tile] = PATH;
            })
        }

        this._canvas.clearRect(0, 0, this._element.width, this._element.height);

        maze.forEach((type, tile) => {
            // TODO: color map as private const
            let color = ['white', 'black'][type];
            this.drawTile(tile, color);
        });
    }

    drawSolution(steps, end) {
        let path = [],
            tile = end;

        const drawTileLoop = (tile) => {
            if(tile) {
                this.drawTile(tile, 'red');
                tile = path.shift();
                this.drawTile(tile, 'red');
                tile = path.shift();

                setTimeout(() => {
                    drawTileLoop(tile);
                }, 3);
            }
        };

        /*jshint boss:true */
        do {
            path.push(tile);
        } while (tile = steps[tile]);

        drawTileLoop(path.shift());
    }

    drawTile(tile, color) {
        const col = this.getColumn(tile),
            row = this.getRow(tile),
            x = (Math.ceil(col / 2) * this.wallSize) + (Math.ceil(col / 2) - col % 2) * this.roomSize,
            y = (Math.ceil(row / 2) * this.wallSize) + (Math.ceil(row / 2) - row % 2) * this.roomSize,
            width  = (col % 2) ? this.roomSize : this.wallSize,
            height = (row % 2) ? this.roomSize : this.wallSize;

        this._canvas.fillStyle = color;
        this._canvas.fillRect(x, y, width, height);
    }

    generatePath(algorithm, start, end) {

        // TODO: move to separate file?
        // TODO: implement variations (depth first, breadth first, stacked, recursive)
        let direction = this.getAllowedDirections(start, WALL)[0];

        let path = Algorithms[algorithm](this, start, direction);

        path.push(end);

        console.log(path);

        return path;
    }

    getAllowedDirections(tile, allowedType, step = 1) {
        let allowed = Object.keys(this._DIRECTIONS).filter((direction) => {

            let nextRoom = tile;

            for(let i = 0; i < step; i++) {
                nextRoom = this.getNextTile(nextRoom, direction);

                let type = this.getTileType(nextRoom),
                    isAllowed = type === allowedType,
                    isIntersection = this.isIntersection(nextRoom);

                if(!isAllowed || isIntersection) {
                    return false;
                }
            }

            return true;
        });

        // Return null instead of empty array so we can use the method in a while condition
        return (allowed.length > 0) ? allowed : null;
    }

    getColumn(tile) {
        return Math.floor(tile % this._columns);
    }

    getNextTile(tile, direction) {
        let next = tile + this._DIRECTIONS[direction];

        return this.isAdjacent(tile, next) ? next : null;
    }

    getRow(tile) {
        return Math.floor((tile) / this._columns);
    }

    getTileType(tile) {
        return this.tiles[tile];
    }

    isAdjacent(tile, next) {
        return this.getRow(tile) === this.getRow(next) || this.getColumn(tile) === this.getColumn(next);
    }

    isIntersection(tile) {
        return this.getRow(tile) % 2 === 0 && this.getColumn(tile) % 2 === 0;
    }

    isWall(tile) {
        return this.getRow(tile) % 2 === 0 || this.getColumn(tile) % 2 === 0;
    }

    setTile(tile, type) {
        this.tiles[tile] = type;
    }

    solve(start, end) {
        let steps = {},
            queue = [start],
            stopped = false;

        this._resetSolution();

        // TODO: find a better fix for private/inner functions
        const markVisited = (tile, previous) => {
                steps[tile] = previous;

                this.setTile(tile, VISITED);
                this.drawTile(tile, '#FF9999');
            },
            solveNextTile = (current, direction) => {
                let tile = this.getNextTile(current, direction);

                markVisited(tile, current);

                if(tile === end) {
                    queue = [];
                } else {
                    queue.push(tile);
                }
            },
            solveLoop = (tile) => {
                if (tile && !stopped) {
                    let directions = this.getAllowedDirections(tile, PATH) || [];

                    directions.forEach((direction) => {
                        solveNextTile(tile, direction);
                    });

                    setTimeout(() => {
                        solveLoop(queue.shift());
                    }, 5);
                } else {
                    this.drawSolution(steps, end);
                }
            };

        markVisited(start);

        solveLoop(queue.shift());

        return function stopSolving() {
            stopped = true;
        }
    }


    _logMaze() {
        let output = '';

        this.tiles.forEach((tile, i) => {
            output += tile;

            if((i + 1) % this._columns === 0) {
                output += '\n';
            }
        });

        console.log(output);
    }

    _resetSolution() {
        this.tiles = this.tiles.map((tile) => {
            return tile !== WALL ? PATH : WALL;
        });

        this.drawMaze();
    }
};
},{"./Algorithms.js":1}],3:[function(require,module,exports){
(function () {

    const Maze = require('./Maze.js');
    const elements = {
        maze: document.getElementById('maze'),

        // Generate
        height: document.getElementById('height'),
        width: document.getElementById('width'),
        start: document.getElementById('start'),
        finish: document.getElementById('finish'),

        generateButton:  document.getElementById('generate'),

        // Solve
        solveButton: document.getElementById('solve')
    };

    let settings = {
            get height() {
               return parseInt(elements.height.value) || 50;
            },
            get width() {
                return parseInt(elements.width.value) || 50;
            },

            get start() {
                return parseInt(elements.start.value) || 1;
            },
            get finish() {
                // TODO: let user pick end point after generating
                return parseInt(elements.finish.value) || 10199;
            }
        },
        maze,
        stopSolving = function() {};

    function init() {
        elements.height.addEventListener('change', updateFinish);
        elements.width.addEventListener('change', updateFinish);

        elements.generateButton.addEventListener('click', start);
        elements.solveButton.addEventListener('click', solve);
    }

    function start() {
        stopSolving();
        maze = new Maze(elements.maze, settings.width, settings.height);

        let path = maze.generatePath('depthFirstSearch', settings.start, settings.finish);
        maze.drawMaze(path);

        elements.solveButton.removeAttribute('disabled');
    }

    function solve() {
        stopSolving = maze.solve(settings.start, settings.finish);
    }

    function updateFinish() {
        elements.finish.value = (settings.width * 2 + 1) * (settings.height * 2 + 1) - 2;
    }

    init();
}());
},{"./Maze.js":2}]},{},[3]);
