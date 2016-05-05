const q = require('q');

module.exports = class {

    constructor(maze) {
        this._maze = maze;
    }

    drawMaze() {
        this._maze.canvas.clearRect(0, 0, this._maze.element.width, this._maze.element.height);

        this._maze.tiles.forEach((type, tile) => {
            // TODO: color map as private const
            let color = ['white', 'black'][type];
            this.drawTile(tile, color);
        });
    }

    drawPath(path, color) {
        let deferred = q.defer();

        path = [].concat(path);

        const draw = () => {
            let tile = path.shift();

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
        const col = this._maze.getColumn(tile),
            row = this._maze.getRow(tile),
            x = (Math.ceil(col / 2) * this._maze.wallSize) + (Math.ceil(col / 2) - col % 2) * this._maze.roomSize,
            y = (Math.ceil(row / 2) * this._maze.wallSize) + (Math.ceil(row / 2) - row % 2) * this._maze.roomSize,
            width  = (col % 2) ? this._maze.roomSize : this._maze.wallSize,
            height = (row % 2) ? this._maze.roomSize : this._maze.wallSize;

        this._maze.canvas.fillStyle = color;
        this._maze.canvas.fillRect(x, y, width, height);
    }
};