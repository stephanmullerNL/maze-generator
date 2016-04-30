class Maze {

    constructor(width, height) {
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

    draw(element) {
        if(element.tagName !== 'CANVAS') {
            throw new Error('Please supply a canvas element to draw on');
        }

        const canvas = element.getContext('2d'),
            wallSize = 5,
            tileSize = (element.width - ((this.width + 1) * wallSize)) / this.width;

        canvas.clearRect(0, 0, element.width, element.height);

        this.tiles.forEach((value, tile) => {
            const col = this.getColumn(tile),
                row = this.getRow(tile),
                x = (Math.floor(col / 2) * wallSize) + (Math.floor(col / 2) + col % 2 - 1) * tileSize,
                y = (Math.floor(row / 2) * wallSize) + (Math.floor(row / 2) + row % 2 - 1) * tileSize,
                width  = (col % 2) ? wallSize : tileSize,
                height = (row % 2) ? wallSize : tileSize;

            canvas.fillStyle = ['white', 'black'][value];
            canvas.fillRect(x, y, width, height);
        });
    }

    generatePath(start, end) {
        // TODO: move to separate file?
        // TODO: implement variations (depth first, breadth first, stacked, recursive)
        let direction = this.getAllowedDirections(start)[0];

        this.walk(start, direction);

        this.setTile(end, 0);
    }

    walk(from, direction) {
        let allowedDirections,
            lastStep,
            wall = this.isWall(from) ? from : this.getNextTile(from, direction),
            room = this.getNextTile(wall, direction);

        // Mark as visited
        this.setTile(wall, 0);
        this.setTile(room, 0);

        /*jshint boss:true */
        while(allowedDirections = this.getAllowedDirections(room)) {
            let rnd = Math.floor(Math.random() * allowedDirections.length),
                nextDirection = allowedDirections[rnd];

            lastStep = this.walk(room, nextDirection);
        }

        return lastStep || room;
    }

    getAllowedDirections(tile) {
        let allowed = Object.keys(this._DIRECTIONS).filter((direction) => {

            let nextWall = this.isWall(tile) ? tile : this.getNextTile(tile, direction),
                nextRoom = this.getNextTile(nextWall, direction);

            return !this.isWall(nextRoom)  &&!!this.getTile(nextRoom);
        });

        // Return null instead of empty array so we can use the method in a while condition
        return (allowed.length > 0) ? allowed : null;
    }

    // NOTE: Columns and rows are 1-indexed. Might have to change this?
    getColumn(tile) {
        return Math.floor(tile % this.columns) + 1;
    }

    getNextTile(tile, direction) {
        let next = tile + this._DIRECTIONS[direction];

        return this.isAdjacent(tile, next) ? next : null;
    }

    // NOTE: Columns and rows are 1-indexed. Might have to change this?
    getRow(tile) {
        return Math.ceil((tile + 1) / this.columns);
    }

    getTile(tile) {
        return this.tiles[tile];
    }

    isAdjacent(tile, next) {
        return this.getRow(tile) === this.getRow(next) || this.getColumn(tile) === this.getColumn(next);
    }

    isEdge(tile) {
        return this.getColumn(tile) === 1 ||
               this.getRow(tile) === 1 ||
               this.getColumn(tile) === this.columns ||
               this.getRow(tile) === this.rows;
    }

    isWall(tile) {
        return this.getRow(tile) % 2 === 1 || this.getColumn(tile) % 2 === 1;
    }

    setTile(tile, value) {
        this.tiles[tile] = value;
    }

    get columns() {
        return this.width * 2 + 1;
    }

    get rows() {
        return this.height * 2 + 1;
    }


    _log() {
        let output = '';

        this.tiles.forEach((tile, i) => {
            output += tile;

            if((i + 1) % this.columns === 0) {
                output += '\n';
            }
        });

        console.log(output);
    }
}

module.exports = Maze;