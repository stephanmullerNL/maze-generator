// TODO: split into modules
// TODO: MazeGenerator class?
// TODO: implement options object as argument
// TODO: implement maze solver
(function () {

    var Maze = require('./Maze.js'),

    // TODO: put in one SETTINGS object
        MAZE_ELEMENT = document.getElementById('maze'),
        START_BUTTON = document.getElementById('start'),
        SOLVE__BUTTON = document.getElementById('solve'),
        WIDTH = 50,
        HEIGHT = 50,

    // TODO: make start tile customizable
        START = 1,
    // TODO: let user pick end point after generating
        END = (WIDTH * 2 + 1) * (HEIGHT * 2 + 1) - 2,

        maze;

    function init() {
        START_BUTTON.addEventListener('click', start);
        SOLVE__BUTTON.addEventListener('click', solve);
    }

    function start() {
        maze = new Maze(MAZE_ELEMENT, WIDTH, HEIGHT);

        maze.generatePath(START, END);
        maze.drawMaze();

        SOLVE__BUTTON.removeAttribute('disabled');
    }

    function solve() {
        maze.solve(START, END);
    }

    init();
}());