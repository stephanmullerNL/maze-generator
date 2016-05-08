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
        startDrawingButton: document.getElementById('startDrawing'),
        stopDrawingButton: document.getElementById('stopDrawing'),

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
        elements.startDrawingButton.addEventListener('click', startDrawing);
        elements.stopDrawingButton.addEventListener('click', stopDrawing);

        elements.generateButton.addEventListener('click', generate);
        elements.clearPathButton.addEventListener('click', clearPath);
        elements.solveButton.addEventListener('click', solve);
    }

    function start() {
        maze = new Maze(elements.maze, settings.width, settings.height);
        enable(elements.startDrawingButton);
    }

    function generate() {
        enable(elements.solveButton);
        enable(elements.clearPathButton);

        maze.generatePath('depthFirstSearch', settings.start, settings.finish);
    }

    function clearPath() {
        disable(elements.clearPathButton);

        maze.resetGeneratedPath();
    }

    function startDrawing() {
        enable(elements.stopDrawingButton);
        disable(elements.startDrawingButton);
        disable(elements.createButton);
        disable(elements.generateButton);
        disable(elements.solveButton);

        maze.resetGeneratedPath();
        maze.startDrawing();
    }

    function stopDrawing() {
        disable(elements.stopDrawingButton);
        enable(elements.startDrawingButton);
        enable(elements.createButton);
        enable(elements.generateButton);
        enable(elements.solveButton);

        maze.resetGeneratedPath();
        maze.stopDrawing();
    }

    function solve() {
        disable(elements.solveButton);

        maze.solve(settings.start, settings.finish).then(() => {
            enable(elements.solveButton);
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