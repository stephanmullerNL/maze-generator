const q = require('q');
const Tile = require('./Tile.js');

// TODO: implement weakmaps?
const PATH = 0;
const WALL = 1;

let directions;

module.exports = class {

    constructor(element, width, height) {
        this.element = element;
        this.canvas = element.getContext('2d');

        this.columns = width * 2 + 1;
        this.rows = height * 2 + 1;

        this.tiles = this.createTiles(width, height);
        this.path = [];

        directions = {
            left: -1,
            right: 1,
            up: -this.columns,
            down: this.columns
        };

        this.renderMaze();
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

            const tile = new Tile(
                this.canvas,
                WALL,
                (Math.ceil(col / 2) * wallSize) + (Math.ceil(col / 2) - col % 2) * roomSize,
                (Math.ceil(row / 2) * wallSize) + (Math.ceil(row / 2) - row % 2) * roomSize,
                (col % 2) ? roomSize : wallSize,
                (row % 2) ? roomSize : wallSize
            );

            tiles.push(tile);
        }

        return tiles;
    }

    /*** Generate maze path ***/
    generatePath(algorithm, start, end) {
        const deferred = q.defer();
        const direction = this.getAllowedDirections(start)[0];
        const firstRoom = this.getNextTile(start, direction);
        const initialPath = [start, firstRoom, end];

        this.path = this[algorithm](firstRoom, initialPath);

        this.renderMaze();
        this.renderPath(this.path, 'white', 5).then(() => deferred.resolve());

        return deferred.promise;
    }

    depthFirstSearch(from, path = []) {
        const getDirections = (from) => {
            let directions = this.getAllowedDirections(from, 2).filter((direction) => {
                let [wall, room] = this.getNextTiles(from, direction, 2);

                return path.indexOf(room) === -1 && !this.isEdge(wall);
            });

            return directions.length ? directions : null;
        };

        const walk = (from) => {
            let allowedDirections;

            /*jshint boss:true */
            while(allowedDirections = getDirections(from)) {
                let nextDirection = this.getRandom(allowedDirections);
                let [wall, room] = this.getNextTiles(from, nextDirection, 2);

                path.push(wall);
                path.push(room);

                walk(room);
            }
        };

        try {
            walk(from);
        } catch (e) {
            alert(e + "\n\nTry generating a smaller maze or use the stacked approach (coming soon)");
        }

        return path;
    }

    getAllowedDirections(tile, step = 1) {
        return Object.keys(directions).filter((direction) => {

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

    getNextTile(tile, direction) {
        let next = tile + directions[direction];

        return this.isAdjacent(tile, next) ? next : null;
    }

    getNextTiles(tile, direction, amount) {
        let tiles = [];

        while((tile = this.getNextTile(tile, direction)) && amount--) {
            tiles.push(tile);
        }

        return tiles;
    }

    // TODO: Add option for horizontal/vertical bias
    getRandom(array) {
        let rnd = Math.floor(Math.random() * array.length);
        return array[rnd];
    }

    /*** Render maze ***/
    renderMaze(path) {
        const tiles = path ? this.applyPath(path) : this.tiles;

        this.canvas.clearRect(0, 0, this.element.width, this.element.height);
        tiles.forEach((tile) => tile.draw());
    }

    renderPath(path, color, timeout) {
        let deferred = q.defer();

        path = [].concat(path);

        const draw = () => {
            const tileIndex = path.shift();
            const tile = this.tiles[tileIndex];

            if(tile === undefined) {
                deferred.resolve();
            } else {
                tile.draw(color);
                setTimeout(draw, timeout);
            }
        };

        draw();

        return deferred.promise;
    }

    /*** Solve maze ***/
    solve(start, end) {
        this.renderMaze(this.path);

        const [visited, steps] = this.breadthFirstSearch(start, end);

        let solution = [];
        let tile = end;

        /*jshint boss:true */
        do {
            solution.push(tile);
        } while (tile = steps[tile]);

        return this.renderPath(visited, '#f99', 5).then(() =>{
            return this.renderPath(solution, 'red', 10);
        });
    }

    breadthFirstSearch(start, end) {
        let queue = [start];
        let steps = {};
        let visited = [start];
        let tile;

        const getTile = (direction) => this.getNextTile(tile, direction);
        const unvisitedTiles = (tile) => visited.indexOf(tile) === -1 && this.path.indexOf(tile) > -1;

        const visitNext = (nextTile) => {
            steps[nextTile] = tile;
            visited.push(nextTile);

            if(nextTile === end) {
                queue = [];
            } else {
                queue.push(nextTile);
            }
        };

        // Mark starting point
        steps[start] = null;

        /*jshint boss:true */
        while(tile = queue.shift()) {
            this.getAllowedDirections(tile)
                .map(getTile)
                .filter(unvisitedTiles)
                .forEach(visitNext);
        }

        return [visited, steps];
    }

    /*** Helpers ***/
    applyPath(path) {
        let tiles = this.tiles;

        path.forEach((tile) => {
            tiles[tile].type = PATH;
        });

        return tiles;
    }

    getColumn(tile) {
        return Math.floor(tile % this.columns);
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

    /*** Debug ***/
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