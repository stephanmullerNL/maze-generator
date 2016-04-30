// TODO: split into modules
// TODO: MazeGenerator class?
// TODO: implement options object as argument
// TODO: implement maze solver
(function () {

    var Maze = require('./Maze.js'),

        // TODO: put in one SETTINGS object
        MAZE_ELEMENT = document.getElementById('maze'),
        START_BUTTON = document.getElementById('start'),
        WIDTH = 2,
        HEIGHT = 2,

        START_TILE = 1,
        START_DIRECTION = 'right',

        maze;

    function init() {
        START_BUTTON.addEventListener('click', start);
    }

    function start() {
        maze = new Maze(WIDTH, HEIGHT);

        let end = maze.generatePath(START_TILE, START_DIRECTION);
        console.log(end);

        maze.draw(MAZE_ELEMENT);
    }

    init();
}());