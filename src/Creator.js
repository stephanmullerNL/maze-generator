module.exports = class {

    constructor(maze) {
        this._maze = maze;

        this.stopDrawing();

        maze.element.addEventListener('mousedown', () => this.startDrawing());
        maze.element.addEventListener('mouseup', () => this.stopDrawing());
        maze.element.addEventListener('mousemove', (event) => {
            if(this._isDrawing) {
                this.drawTile(event);
            }
        });
    }

    drawTile(event) {
        const x = event.pageX - this._maze.element.offsetLeft;
        const y = event.pageY - this._maze.element.offsetTop;

        console.log(this._maze.getTileFromCoordinates(x, y));
    }

    startDrawing() {
        this._isDrawing = true;
    }

    stopDrawing() {
        this._isDrawing = false;
    }

};