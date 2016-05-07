// TODO: implement weakmaps
const PATH = 0;
const WALL = 1;

const Creator = require('./Creator.js');
const Draw = require('./Draw.js');
const Path = require('./Path.js');

let mazeCreator;
let mazeDrawer;
let pathGenerator;

module.exports = class {

    constructor(element, width, height) {
        this.columns = width * 2 + 1;
        this.rows = height * 2 + 1;
        
        this.element = element;
        this.canvas = element.getContext('2d');

        this.tiles = this.createTiles(width, height);
        this.path = [];

        mazeCreator = new Creator(this);
        mazeDrawer = new Draw(this);
        pathGenerator = new Path(this);

        mazeDrawer.drawMaze();
    }

    applyPath(path) {
        let tiles = this.tiles;

        path.forEach((tile) => {
            tiles[tile].type = PATH;
        });

        return tiles;
    }

    createTiles(width, height) {
        let tiles = [];

        const amount = (width * 2 + 1) * (height * 2 + 1);
        const maxDimension = Math.max(width, height);

        const wallSize = Math.ceil(40 / maxDimension);
        const roomSize = Math.floor((this.element.width - ((maxDimension + 1) * wallSize)) / maxDimension);

        for(let i = 0; i < amount; i++) {
            const col = this.getColumn(i);
            const row = this.getRow(i);

            tiles.push({
                type: WALL,
                x: (Math.ceil(col / 2) * wallSize) + (Math.ceil(col / 2) - col % 2) * roomSize,
                y: (Math.ceil(row / 2) * wallSize) + (Math.ceil(row / 2) - row % 2) * roomSize,
                width: (col % 2) ? roomSize : wallSize,
                height: (row % 2) ? roomSize : wallSize
            });
        }

        return tiles;
    }

    generatePath(algorithm, start, end) {
        let path = pathGenerator.generate(algorithm, start, end);

        mazeDrawer.drawMaze();
        mazeDrawer.drawPath(path, 'white');

        this.path = path;
        this.tiles = this.applyPath(path);
    }

    getColumn(tile) {
        return Math.floor(tile % this.columns);
    }

    getTileFromCoordinates(x, y) {
        return this.tiles.find((tile) => {
            return tile.x <= x && tile.y <= y && tile.x + tile.width >= x && tile.y + tile.height >= y;
        });
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
        const [visited, steps] = pathGenerator.solve(start, end);

        let solution = [];
        let tile = end;

        /*jshint boss:true */
        do {
            solution.push(tile);
        } while (tile = steps[tile]);

        return mazeDrawer.drawPath(visited, '#f99').then(() =>{
            return mazeDrawer.drawPath(solution, 'red');
        });
    }

    _logMaze(path = []) {
        let maze = this.applyPath(path);
        let output = '';

        maze.forEach((tile, i) => {
            output += tile.type;

            if((i + 1) % this.columns === 0) {
                output += '\n';
            }
        });

        console.log(output);
    }
};