const q = require('q');

module.exports = class {

    constructor(maze) {
        this._maze = maze;
    }

    drawMaze() {
        this._maze.canvas.clearRect(0, 0, this._maze.element.width, this._maze.element.height);

        this._maze.tiles.forEach((tile) => {
            // TODO: color map as private const
            let color = ['white', 'black'][tile.type];
            this.drawTile(tile, color);
        });
    }

    drawPath(path, color) {
        let deferred = q.defer();

        path = [].concat(path);

        const draw = () => {
            const tileIndex = path.shift();
            const tile = this._maze.tiles[tileIndex];

            if(tile === undefined) {
                deferred.resolve();
            } else {
                this.drawTile(tile, color);
                setTimeout(draw, 10);
            }
        };

        draw();

        return deferred.promise;
    }

    drawTile(tile, color) {
        this._maze.canvas.fillStyle = color;
        this._maze.canvas.fillRect(tile.x, tile.y, tile.width, tile.height);
    }
};