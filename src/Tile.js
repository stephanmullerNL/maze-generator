const colors = {
    0: 'black',
    1: 'white'
};

export default class Tile {

    constructor(canvas, type, x, y, width, height) {
        this.canvas = canvas;

        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this._highlighted = false;
    }

    draw(color) {
        color = color || colors[this.type];

        if(this.width === this.height && color === 'black') {
            color = '#333';
        }

        this.canvas.fillStyle = color;
        this.canvas.fillRect(this.x, this.y, this.width, this.height);
    }
};