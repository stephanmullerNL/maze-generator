// TODO: implement weakmaps
const PATH = 0,
      WALL = 1,
      VISITED = 2;

module.exports = class {

    constructor(element, width, height) {
        const tiles = (width * 2 + 1) * (height * 2 + 1);

        // TODO: move to private vars but with getters/setters
        this.width = width;
        this.height = height;
        this.columns = width * 2 + 1;
        this.rows = height * 2 + 1;

        this.wallSize = Math.ceil(40 / width);
        this.roomSize = Math.floor((element.width - ((width + 1) * this.wallSize)) / width);

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

    drawMaze() {
        this._canvas.clearRect(0, 0, this._element.width, this._element.height);

        this.tiles.forEach((type, tile) => {
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
                tile = path.pop();
                this.drawTile(tile, 'red');
                tile = path.pop();

                setTimeout(() => {
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

    generatePath(start, end) {
        // TODO: move to separate file?
        // TODO: implement variations (depth first, breadth first, stacked, recursive)
        let direction = this.getAllowedDirections(start, WALL)[0];

        try {
            this.walk(start, direction);
        } catch (e) {
            alert(e + "\n\nTry generating a smaller maze or use the stacked approach (coming soon)");
        }

        this.setTile(end, 0);
    }

    walk(from, direction) {
        let allowedDirections,
            lastStep,
            wall = this.isWall(from) ? from : this.getNextTile(from, direction),
            room = this.getNextTile(wall, direction);

        this.setTile(wall, PATH);
        this.setTile(room, PATH);

        /*jshint boss:true */
        while(allowedDirections = this.getAllowedDirections(room, WALL, 2)) {
            // TODO: Add option for horizontal/vertical bias
            let rnd = Math.floor(Math.random() * allowedDirections.length),
                nextDirection = allowedDirections[rnd];

            lastStep = this.walk(room, nextDirection);
        }

        return lastStep || room;
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
        return Math.floor(tile % this.columns);
    }

    getNextTile(tile, direction) {
        let next = tile + this._DIRECTIONS[direction];

        return this.isAdjacent(tile, next) ? next : null;
    }

    getRow(tile) {
        return Math.floor((tile) / this.columns);
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
            queue = [start];

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
                if (tile) {
                    let directions = this.getAllowedDirections(tile, PATH) || [];

                    directions.forEach((direction) => {
                        solveNextTile(tile, direction);
                    });

                    setTimeout(() => {
                        solveLoop(queue.shift());
                    }, 10);
                } else {
                    this.drawSolution(steps, end);
                }
            };

        markVisited(start);

        solveLoop(queue.shift());
    }


    _logMaze() {
        let output = '';

        this.tiles.forEach((tile, i) => {
            output += tile;

            if((i + 1) % this.columns === 0) {
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