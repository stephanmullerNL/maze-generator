(function () {

    const Maze = require('./Maze.js');
    const elements = {
        maze: document.getElementById('maze'),

        // Create
        height: document.getElementById('height'),
        width: document.getElementById('width'),
        start: document.getElementById('start'),
        finish: document.getElementById('finish'),

        createButton:  document.getElementById('create'),

        // Generate
        generateButton:  document.getElementById('generate'),
        clearPathButton:  document.getElementById('clearPath'),

        // Solve
        solveButton: document.getElementById('solve')
    };

    const settings = {
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
    };

    let maze;

    function init() {
        elements.height.addEventListener('input', updateFinish);
        elements.width.addEventListener('input', updateFinish);

        elements.createButton.addEventListener('click', start);

        elements.generateButton.addEventListener('click', generate);
        elements.solveButton.addEventListener('click', solve);
    }

    function start() {
        if(maze) {
            maze.stopDrawing();
        }

        maze = new Maze(elements.maze, settings.width, settings.height);

        enable(elements.generateButton);
        disable(elements.solveButton);
    }

    function generate() {
        disable(elements.generateButton);
        disable(elements.solveButton);

        maze.generatePath(settings.start, settings.finish).then(() => {
            enable(elements.generateButton);
            enable(elements.solveButton)
;        });
    }

    function solve() {
        disable(elements.solveButton);
        disable(elements.generateButton);

        maze.solve(settings.start, settings.finish).then(() => {
            enable(elements.solveButton);
            enable(elements.generateButton);
        });
    }

    function updateFinish() {
        elements.finish.value = (settings.width * 2 + 1) * (settings.height * 2 + 1) - 2;
    }

    function disable(element) {
        element.setAttribute('disabled', 'disabled');
    }

    function enable(element) {
        element.removeAttribute('disabled');
    }

    init();
}());