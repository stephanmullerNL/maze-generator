// TODO: split into modules
// TODO: MazeGenerator class?
// TODO: implement options object as argument
// TODO: implement maze solver
(function () {

    var Maze = require('./Maze.js'),

    // TODO: put in one SETTINGS object
        MAZE_ELEMENT = document.getElementById('maze'),
        START_BUTTON = document.getElementById('start'),
        WIDTH = 20,
        HEIGHT = 20,

    // TODO: make start tile customizable
        START = 1,
    // TODO: let user pick end point after generating
        END = (WIDTH * 2 + 1) * (HEIGHT * 2 + 1) - 2;

    function init() {
        START_BUTTON.addEventListener('click', start);
    }

    function start() {
        let maze = new Maze(WIDTH, HEIGHT);

        maze.generatePath(START, END);

        maze.draw(MAZE_ELEMENT);
    }

    init();
}());