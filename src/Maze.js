// TODO: implement weakmaps
const PATH = 0;
const WALL = 1;

const Algorithms = require('./Algorithms.js');
const Draw = require('./Draw.js');

let algorithms;
let mazeDrawer;

module.exports = class {

    constructor(element, width, height) {
        const tiles = (width * 2 + 1) * (height * 2 + 1);
        const maxDimension = Math.max(width, height);

        this.wallSize = Math.ceil(40 / maxDimension);
        this.roomSize = Math.floor((element.width - ((maxDimension + 1) * this.wallSize)) / maxDimension);

        this.columns = width * 2 + 1;
        this.rows = height * 2 + 1;
        
        this._DIRECTIONS = {
            left: -1,
            right: 1,
            up: -this.columns,
            down: this.columns
        };
        
        this.element = element;
        this.canvas = element.getContext('2d');

        this.tiles = new Array(tiles).fill(WALL);
        this.path = [];

        algorithms = new Algorithms(this);
        mazeDrawer = new Draw(this);
    }

    applyPath(path) {
        path.forEach((tile) => {
            this.tiles[tile] = PATH;
        });
    }

    generatePath(algorithm, start, end) {
        // Prefill path with start and finish
        let direction = this.getAllowedDirections(start)[0];
        let firstRoom = this.getNextTile(start, direction);
        let initialPath = [start, firstRoom, end];

        let path = algorithms[algorithm](firstRoom, initialPath);

        mazeDrawer.drawMaze();
        mazeDrawer.drawPath(path, 'white');

        this.applyPath(path);
        this.path = path;
    }

    getAllowedDirections(tile, step = 1) {
        return Object.keys(this._DIRECTIONS).filter((direction) => {

            let nextRoom = tile;

            for(let i = 0; i < step; i++) {
                nextRoom = this.getNextTile(nextRoom, direction);

                if(this.isIntersection(nextRoom) || nextRoom > this.tiles.length) {
                    return false;
                }
            }

            return true;
        });
    }

    getColumn(tile) {
        return Math.floor(tile % this.columns);
    }

    getNextTile(tile, direction) {
        let next = tile + this._DIRECTIONS[direction];

        return this.isAdjacent(tile, next) ? next : null;
    }

    getNextTiles(tile, direction, amount) {
        let tiles = [];

        while((tile = this.getNextTile(tile, direction)) && amount--) {
            tiles.push(tile);
        }

        return tiles;
    }

    getRow(tile) {
        return Math.floor((tile) / this.columns);
    }

    isAdjacent(tile, next) {
        return this.getRow(tile) === this.getRow(next) || this.getColumn(tile) === this.getColumn(next);
    }

    isIntersection(tile) {
        return this.getRow(tile) % 2 === 0 && this.getColumn(tile) % 2 === 0;
    }

    isEdge(tile) {
        return  this.getRow(tile) < 1 ||
                this.getColumn(tile) < 1 ||
                this.getRow(tile) > this.rows - 1 ||
                this.getColumn(tile) > this.columns - 1;
    }

    solve(start, end) {
        const [visited, steps] = algorithms.solve(start, end);

        let solution = [];
        let tile = end;

        /*jshint boss:true */
        do {
            solution.push(tile);
        } while (tile = steps[tile]);

        return mazeDrawer.drawPath(visited, '#f99').then(
            () => mazeDrawer.drawPath(solution, 'red')
        );
    }

    _logMaze(path) {
        let output = '',
            maze = this.tiles;

        if(path) {
            path.forEach((tile) => {
                maze[tile] = PATH;
            });
        }

        maze.forEach((tile, i) => {
            output += tile;

            if((i + 1) % this.columns === 0) {
                output += '\n';
            }
        });

        console.log(output);
    }
};