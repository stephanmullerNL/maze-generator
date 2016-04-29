class Maze {

    constructor(width, height) {
        const DEFAULT_TILE = {
            visited: false,
            walls: ['left', 'right', 'up', 'down']
        };

        this.width = width;
        this.height = height;
        this.tiles = [];

        this._DIRECTIONS = {
            left: -1,
            right: 1,
            up: -this.width,
            down: this.width
        };

        for (let i = 0; i < width * height; i++) {
            this.tiles[i] = JSON.parse(JSON.stringify(DEFAULT_TILE));
        }
    }

    getAllowedDirections(tile) {
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
        return Math.floor((tile + 1) % this.width);
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
        return Math.ceil((tile + 1) / this.width);
    }


    removeWall(tile, direction) {
        var walls = this.tiles[tile].walls,
            index = walls.indexOf(direction);

        return walls.splice(index, 1);
    }
}

module.exports = Maze;