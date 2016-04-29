(function () {

    var Maze = require('./Maze.js'),

        MAZE_ELEMENT = document.getElementById('maze'),
        START_BUTTON = document.getElementById('start'),
        WIDTH = 50,
        HEIGHT = 50,

        START_TILE = 0,
        START_DIRECTION = 'right',

        maze;

    function init() {
        START_BUTTON.addEventListener('click', start);

        MAZE_ELEMENT.style.width = WIDTH + 'em';
        MAZE_ELEMENT.style.height = HEIGHT + 'em';
    }

    function start() {
        maze = new Maze(WIDTH, HEIGHT);

        var end = walk(START_TILE - 1, START_DIRECTION);
        console.log(end);

        drawMaze();
    }


    function drawMaze() {
        MAZE_ELEMENT.innerHTML = '';

        maze.tiles.forEach((tile) => {
            var tileElement = document.createElement('div');

            tile.walls.forEach(function (wall) {
                tileElement.className += ` ${wall}`;
            });

            tileElement.addEventListener('click', () => {
                tile.exit = true;
            });

            MAZE_ELEMENT.appendChild(tileElement);
        });
    }

    function walk(from, direction) {
        var allowedDirections,
            lastStep,
            tile = maze.getNextTile(from, direction);

        maze.removeWall(tile, maze.getOppositeDirection(direction));
        maze.tiles[tile].visited = true;

        /*jshint boss:true */
        while(allowedDirections = maze.getAllowedDirections(tile)) {
            var rnd = Math.floor(Math.random() * allowedDirections.length),
                nextDirection = allowedDirections[rnd];

            maze.removeWall(tile, nextDirection);

            lastStep = walk(tile, nextDirection);
        }

        return lastStep || tile;
    }

    init();
}());