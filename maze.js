(function () {

    var MAZE = document.getElementById('maze'),
        START_BUTTON = document.getElementById('start'),
        WIDTH = 3,
        HEIGHT = 3,

        DIRECTIONS = ['left', 'right', 'up', 'down'],
        STEPS = {
            left: -1,
            right: 1,
            up: -WIDTH,
            down: WIDTH
        },

        // TODO: make customizable?
        START_TILE = 0,
        START_DIRECTION = 'right';

    // Temp
    var count;

    function init() {
        START_BUTTON && START_BUTTON.addEventListener('click', start);
    }

    function start() {
        count = 0;
        createMaze();

        console.log('Finished!', walk());
    }

    function createMaze() {
        MAZE.innerHTML = '';

        for (var i = 0, tile; i < WIDTH * HEIGHT; i++) {
            tile = document.createElement('div');
            MAZE.appendChild(tile);
        }

        MAZE.style.width = '' + WIDTH + 'em';
    }

    function walk() {
        var tile = START_TILE;

        function takeStep(direction) {
            var allowedDirections;

            tile = getTileNumber(tile, direction);
            allowedDirections = getAllowedDirections(tile);

            markTile('in', tile, direction);

            if (allowedDirections.length > 0 && count++ < WIDTH * HEIGHT) {
                var rnd = Math.floor(Math.random() * allowedDirections.length),
                    next = allowedDirections[rnd];

                markTile('out', tile, next);

                return takeStep(next);
            } else {
                // End of the line, trickle back down
                return tile;
            }
        }

        return takeStep(START_DIRECTION);
    }

    function getAllowedDirections(currentTile) {
        return DIRECTIONS
            .filter(onlyAdjacentTiles)
            .filter(notVisited);

        function onlyAdjacentTiles(direction, all) {
            var tile = getTileNumber(currentTile, direction);

            return (getRow(tile) === getRow(currentTile) || getColumn(tile) === getColumn(currentTile));
        }

        function notVisited(direction, all) {
            var tile = getTileNumber(currentTile, direction),
                tileElement = getTileElement(tile);

            return tileElement && !tileElement.dataset.in;
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

    function markTile(movement, tile, direction) {
        // When coming in by moving "right", we have to mark the left side of the
        // tile as the entrance. For exit we don't need to reverse
        var side = (movement === 'in') ? getOppositeDirection(direction) : direction;

        getTileElement(tile).dataset[movement] = side;
    }

    init();
}());