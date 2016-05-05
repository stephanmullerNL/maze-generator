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

    // TODO: move draw methods to new class
    drawMaze(path) {
        let maze = this.tiles;

        if(path) {
            path.forEach((tile) => {
                maze[tile] = PATH;
            });
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
        // Prefill path with start and finish
        let direction = this.getAllowedDirections(start)[0];
        let firstRoom = this.getNextTile(start, direction);
        let path = [start, firstRoom, end];

        path = Algorithms[algorithm](this, firstRoom, path);

        return path;
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
        return Math.floor(tile % this._columns);
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
        return Math.floor((tile) / this._columns);
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
                this.getRow(tile) > this._rows - 1 ||
                this.getColumn(tile) > this._columns - 1;
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
        };
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