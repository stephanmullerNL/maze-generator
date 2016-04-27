(function () {

    var MAZE = document.getElementById('maze'),
        START_BUTTON = document.getElementById('start'),
        WIDTH = 26,
        HEIGHT = 26,

        DIRECTIONS = ['left', 'right', 'up', 'down'],
        STEPS = {
            left: -1,
            right: 1,
            up: -WIDTH,
            down: WIDTH
        },

        START_TILE = 0,
        START_DIRECTION = 'right';

    function init() {
        START_BUTTON && START_BUTTON.addEventListener('click', start);
    }

    function start() {
        // TODO: generate maze first, then create visual representation
        createMaze();

        var end = walk(START_TILE, START_DIRECTION);

        console.log(end);
    }

    function createMaze() {
        MAZE.innerHTML = '';

        for (var i = 0, tile; i < WIDTH * HEIGHT; i++) {
            tile = document.createElement('div');
            MAZE.appendChild(tile);
        }

        MAZE.style.width = WIDTH + 'em';
    }

    function walk(from, direction) {
        var allowedDirections,
            lastStep,
            tile = getTileNumber(from, direction);

        removeWall(tile, getOppositeDirection(direction));

        while(allowedDirections = getAllowedDirections(tile)) {
            var rnd = Math.floor(Math.random() * allowedDirections.length),
                nextDirection = allowedDirections[rnd];

            removeWall(tile, nextDirection);

            lastStep = walk(tile, nextDirection);
        }

        return lastStep || tile;
    }

    function getAllowedDirections(currentTile) {
        var allowed = DIRECTIONS
            .filter(onlyAdjacentTiles)
            .filter(notVisited);

        return (allowed.length > 0) ? allowed : null;

        function onlyAdjacentTiles(direction) {
            var tile = getTileNumber(currentTile, direction);

            return (getRow(tile) === getRow(currentTile) || getColumn(tile) === getColumn(currentTile));
        }

        function notVisited(direction) {
            var tile = getTileNumber(currentTile, direction),
                tileElement = getTileElement(tile);

            // TODO: Don't use the DOM to store information, silly
            return tileElement && !tileElement.className;
        }
    }

    function getTileNumber(currentTile, direction) {
        return currentTile + STEPS[direction];
    }

    function getTileElement(tile) {
        return MAZE.querySelector(`div:nth-child(${tile})`);
    }

    function getRow(tile) {
        return Math.ceil(tile / WIDTH)
    }

    function getColumn(tile) {
        return Math.floor(tile % WIDTH);
    }

    // Takes any direction and returns the opposite by performing magic on the array
    // index. 0 <-> 1, 2 <-> 3, etc.
    function getOppositeDirection(direction) {
        var directionIndex = DIRECTIONS.indexOf(direction),
            rest = directionIndex % 2,
            inverse = directionIndex + 1 - (2 * rest);

        return DIRECTIONS[inverse];
    }

    function removeWall(tile, direction) {
        getTileElement(tile).className += ` ${direction}`;
    }

    init();
}());