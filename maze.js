(function () {

    var MAZE = document.getElementById('maze'),
        START_BUTTON = document.getElementById('start'),
        WIDTH = 3,
        HEIGHT = 3,

        DIRECTIONS = ['down', 'up', 'left', 'right'],
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

            markVisited(tile);

            if (allowedDirections.length > 0 && count++ < WIDTH * HEIGHT) {
                var rnd = Math.floor(Math.random() * allowedDirections.length),
                    next = allowedDirections[rnd];

                //removeWalls(tile, next, direction);


                return takeStep(next);
            } else {
                // End of the line, trickle back down
                return tile;
            }
        }

        return takeStep(START_DIRECTION);
    }

    function getAllowedDirections(tile) {
        return DIRECTIONS
            .filter(onlyAdjacentTiles)
            .filter(notVisited);

        function onlyAdjacentTiles(direction) {
            var tile = getTileNumber(tile, direction);

            return (getRow(tile) === getRow(tile) || getColumn(tile) === getColumn(tile));
        }

        function notVisited(direction) {
            var tile = getTileNumber(tile, direction),
                tileElement = getTileElement(tile);

            return tileElement && tileElement.dataset.visited !== "true";
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

    function markVisited(tile) {
        getTileElement(tile).dataset.visited = 'true'
    }

    function removeWalls(previous, current) {
        //var
    }

    init();
}());