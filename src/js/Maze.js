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

        this.tiles.forEach((value, tile) => {
            const col = this.getColumn(tile),
                row = this.getRow(tile),
                x = (Math.floor(col / 2) * wallSize) + (Math.floor(col / 2) + col % 2 - 1) * tileSize,
                y = (Math.floor(row / 2) * wallSize) + (Math.floor(row / 2) + row % 2 - 1) * tileSize,
                width = (col % 2) ? wallSize : tileSize,
                height = (row % 2) ? wallSize : tileSize;

            canvas.fillStyle = ['white', 'black'][value];
            canvas.fillRect(x, y, width, height);
        });
    }

    generatePath(start, direction) {
        // TODO: move to separate file?
        // TODO: implement variations (depth first, breadth first, stacked, recursive)

        return this.walk(start);
    }

    walk(from, direction) {
        var allowedDirections,
            lastStep,
            tile = direction ? this.getNextTile(from, direction) : from;

        // Mark visited
        this.tiles[tile] = 0;

        /*jshint boss:true */
        while(allowedDirections = this.getAllowedDirections(tile)) {
            var rnd = Math.floor(Math.random() * allowedDirections.length),
                nextDirection = allowedDirections[rnd];

            //maze.removeWall(tile, nextDirection);

            lastStep = this.walk(tile, nextDirection);

            if(this.isWall(lastStep)) {
                lastStep = this.walk(tile, nextDirection);
            }
        }

        return lastStep || tile;
    }

    // TODO: check next wall and tile at once, only move if both are allowed!
    getAllowedDirections(tile) {
        // TODO: move check to getNextTile
        var onlyAdjacentTiles = (direction) => {
            var tileNumber = this.getNextTile(tile, direction),
                sameRow = this.getRow(tileNumber) === this.getRow(tile),
                sameCol = this.getColumn(tileNumber) === this.getColumn(tile);

            return sameRow || sameCol;
        };

        var notVisited = (direction) => {
            var tileNumber = this.getNextTile(tile, direction),
                nextTile = this.tiles[tileNumber];

            return !!nextTile;
        };

        var notEdge = (direction) => !this.isEdge(this.getNextTile(tile, direction));

        var allowed = Object.keys(this._DIRECTIONS)
            .filter(onlyAdjacentTiles)
            .filter(notEdge)
            .filter(notVisited);

        // Return null instead of empty array so we can use the method in a while condition
        return (allowed.length > 0) ? allowed : null;
    }

    getColumn(tile) {
        return Math.floor(tile % this.columns) + 1;
    }

    getNextTile(tile, direction) {
        return tile + this._DIRECTIONS[direction];
    }

    // Takes any direction and returns the opposite by performing magic on the array
    // index. 0 <-> 1, 2 <-> 3, etc.
    getOppositeDirection(direction) {
        var directions = Object.keys(this._DIRECTIONS),
            index = directions.indexOf(direction),
            opposite = (index % 2) ? -1 : 1;

        return directions[index + opposite];
    }

    getRow(tile) {
        return Math.ceil((tile + 1) / this.columns);
    }

    isEdge(tile) {
        return this.getColumn(tile) === 1
            || this.getRow(tile) === 1
            || this.getColumn(tile) === this.width * 2 + 1
            || this.getRow(tile) === this.height * 2 + 1
    }

    isWall(tile) {
        return this.getRow(tile) % 2 === 0 || this.getColumn(tile) % 2 === 0;
    }

    removeWall(tile, direction) {
        var walls = this.tiles[tile].walls,
            index = walls.indexOf(direction);

        return walls.splice(index, 1);
    }

    get columns() {
        return this.width * 2 + 1;
    }
}

module.exports = Maze;