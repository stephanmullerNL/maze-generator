(function () {

    var MAZE = document.getElementById('maze'),
        START_BUTTON = document.getElementById('start'),
        WIDTH = 3,
        HEIGHT = 3;

    // Temp
    var count;

    function init() {
        START_BUTTON && START_BUTTON.addEventListener('click', start);
    }

    function start() {
        count = 0;
        createMaze();

        console.log('Finished!', walk(null, 1));
    }

    function createMaze() {
        MAZE.innerHTML = '';

        for (var i = 0, tile; i < WIDTH * HEIGHT; i++) {
            tile = document.createElement('div');
            MAZE.appendChild(tile);
        }

        MAZE.style.width = '' + WIDTH + 'em';
    }

    function walk(previous, current) {
        var allowedSteps = getUnvisitedSiblings(current);

        markVisited(current);
        removeWall(previous, current);

        if (allowedSteps.length > 0 && count++ < WIDTH * HEIGHT) {
            var next = takeRandomStep(current, allowedSteps);

            //if()

            return next;
        } else {
            return current;
        }
    }

    function takeRandomStep(current, steps) {
        var rnd = Math.floor(Math.random() * steps.length),
            next = steps[rnd];

        return walk(current, next);
    }

    function getUnvisitedSiblings(current) {
        var siblingSteps = [-1, 1, -WIDTH, WIDTH];

        return siblingSteps
            .map(getTileNumber)
            .filter(onlyAdjacentTiles)
            .filter(notVisited);

        function getTileNumber(step) {
            return current + step;
        }

        function onlyAdjacentTiles(tile) {
            return (getRow(tile) === getRow(current) || getColumn(tile) === getColumn(current));
        }

        function notVisited(tile) {
            var adjacentTile = getTileElement(tile);
            return adjacentTile && !adjacentTile.dataset.visited;
        }
    }

    function getTileElement(tile) {
        return MAZE.querySelector(`div:nth-child(${tile})`);
    }

    function getRow(tile) {
        return Math.ceil((tile)/ WIDTH)
    }

    function getColumn(tile) {
        return Math.floor(tile % WIDTH);
    }

    function markVisited(tile) {
        getTileElement(tile).dataset.visited = 'true'
    }

    function removeWall(previous, current) {

    }

    init();
}());