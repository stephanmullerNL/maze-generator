(function () {

    const Maze = require('./Maze.js');
    const elements = {
        maze: document.getElementById('maze'),

        // Generate
        height: document.getElementById('height'),
        width: document.getElementById('width'),
        start: document.getElementById('start'),
        finish: document.getElementById('finish'),

        generateButton:  document.getElementById('generate'),

        // Solve
        solveButton: document.getElementById('solve')
    };

    let settings = {
            get height() {
               return parseInt(elements.height.value) || 50;
            },
            get width() {
                return parseInt(elements.width.value) || 50;
            },

            get start() {
                return parseInt(elements.start.value) || 1;
            },
            get finish() {
                // TODO: let user pick end point after generating
                return parseInt(elements.finish.value) || 10199;
            }
        },
        maze,
        stopSolving = function() {};

    function init() {
        elements.height.addEventListener('input', updateFinish);
        elements.width.addEventListener('input', updateFinish);

        elements.generateButton.addEventListener('click', start);
        elements.solveButton.addEventListener('click', solve);
    }

    function start() {
        stopSolving();
        maze = new Maze(elements.maze, settings.width, settings.height);

        maze.generatePath('depthFirstSearch', settings.start, settings.finish);

        elements.solveButton.removeAttribute('disabled');
    }

    function solve() {
        elements.solveButton.setAttribute('disabled', 'disabled');

        maze.solve(settings.start, settings.finish).then(() => {
            elements.solveButton.removeAttribute('disabled');
        });
    }

    function updateFinish() {
        elements.finish.value = (settings.width * 2 + 1) * (settings.height * 2 + 1) - 2;
    }

    init();
}());