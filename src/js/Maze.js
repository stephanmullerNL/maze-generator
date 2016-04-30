class Maze {

    constructor(width, height) {
        this._DIRECTIONS = {
            left: -1,
            right: 1,
            up: -width,
            down: width
        };

        this.width = width;
        this.height = height;

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
        })
    }

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

            return nextTile && !nextTile.visited;
        };

        var allowed = Object.keys(this._DIRECTIONS)
            .filter(onlyAdjacentTiles)
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