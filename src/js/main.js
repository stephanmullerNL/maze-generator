// TODO: split into modules
// TODO: MazeGenerator class?
// TODO: implement options object as argument
// TODO: implement maze solver
(function () {

    var Maze = require('./Maze.js'),

        // TODO: put in one SETTINGS object
        MAZE_ELEMENT = document.getElementById('maze'),
        START_BUTTON = document.getElementById('start'),
        WIDTH = 3,
        HEIGHT = 3,

        START_TILE = 0,
        START_DIRECTION = 'right',

        maze;

    function init() {
        START_BUTTON.addEventListener('click', start);
    }

    function start() {
        maze = new Maze(WIDTH, HEIGHT);

        //var end = walk(START_TILE - 1, START_DIRECTION);
        //console.log(end);

        maze.draw(MAZE_ELEMENT);
    }

    function drawMaze() {
        //.innerHTML = '';

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

    // TODO: move to separate file, implement variations (depth first, breadth first, stacked, recursive)
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