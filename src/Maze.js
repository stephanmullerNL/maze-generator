const q = require('q');

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

        this.customPath = [];
        this._drawType = null;

        directions = {
            left: -1,
            right: 1,
            up: -this.columns,
            down: this.columns
        };

        this.renderMaze();

        element.addEventListener('mousedown', (event) => this.startDrawing(event));
        element.addEventListener('mouseup', (event) => this.stopDrawing(event));
        element.addEventListener('mousemove', (event) => this.drawPath(event));
        element.addEventListener('contextmenu', (event) => event.preventDefault());
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


    /*** Draw custom maze ***/
    drawPath(event) {
        if(this._drawType !== null) {
            const x = event.pageX - this.element.offsetLeft;
            const y = event.pageY - this.element.offsetTop;

            let tile = this.getTileFromCoordinates(x, y);
            let tileIndex = this.tiles.indexOf(tile);
            let color = ['white', 'black'][this._drawType];

            console.log(tileIndex, tile);

            if(this.customPath.indexOf(tileIndex) === -1) {
                this.drawTile(tile, color);
                this.customPath.push(tileIndex);
            }
        }
    }

    startDrawing() {
        if(event.which === 3) {
            event.preventDefault();
            this._drawType = WALL;
        } else {
            this._drawType = PATH;
        }
    }

    stopDrawing() {
        this._drawType = null;
    }


    /*** Generate maze path ***/
    generatePath(algorithm, start, end) {
        let direction = this.getAllowedDirections(start)[0];
        let firstRoom = this.getNextTile(start, direction);
        let initialPath = [start, firstRoom, end].concat(this.customPath);

        this.path = this[algorithm](firstRoom, initialPath);

        this.renderMaze();
        this.renderPath(this.path, 'white', 5);

        //this.path = path;
        this.tiles = this.applyPath(this.path);
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
    renderMaze() {
        this.canvas.clearRect(0, 0, this.element.width, this.element.height);

        this.tiles.forEach((tile, index) => {
            // TODO: color map as private const
            let color = ['white', 'black'][tile.type];

            if(tile.type === WALL && !this.isWall(index)) {
                color = '#444';
            }

            this.drawTile(tile, color);
        });
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
                this.drawTile(tile, color);
                setTimeout(draw, timeout);
            }
        };

        draw();

        return deferred.promise;
    }

    drawTile(tile, color) {
        this.canvas.fillStyle = color;
        this.canvas.fillRect(tile.x, tile.y, tile.width, tile.height);
    }

    /*** Solve maze ***/
    solve(start, end) {
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

    getTileFromCoordinates(x, y) {
        return this.tiles.find((tile) => {
            return tile.x <= x &&
                    tile.y <= y &&
                    tile.x + tile.width >= x &&
                    tile.y + tile.height >= y;
        });
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

    isWall(tile) {
        return this.getColumn(tile) % 2 === 0 || this.getRow(tile) % 2 === 0;
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