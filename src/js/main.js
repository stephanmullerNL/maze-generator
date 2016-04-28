(function () {

    var MAZE_ELEMENT = document.getElementById('maze'),
        START_BUTTON = document.getElementById('start'),
        WIDTH = 50,
        HEIGHT = 50,

        DIRECTIONS = {
            left: -1,
            right: 1,
            up: -WIDTH,
            down: WIDTH
        },
        DEFAULT_TILE = {
            visited: false,
            walls: ['left', 'right', 'up', 'down']
        },

        START_TILE = 0,
        START_DIRECTION = 'right',

        maze = [];

    function init() {
        START_BUTTON.addEventListener('click', start);

        MAZE_ELEMENT.style.width = WIDTH + 'em';
        MAZE_ELEMENT.style.height = HEIGHT + 'em';
    }

    function start() {
        createMaze();

        var end = walk(START_TILE - 1, START_DIRECTION);
        console.log(end);

        drawMaze();
    }

    function createMaze() {
        for(var i = 0; i < WIDTH * HEIGHT; i++) {
            maze[i] = JSON.parse(JSON.stringify(DEFAULT_TILE));
        }
    }

    function drawMaze() {
        MAZE_ELEMENT.innerHTML = '';

        maze.forEach(function(tile, index) {
            var tileElement = document.createElement('div');

            tile.walls.forEach(function (wall) {
                tileElement.className += ` ${wall}`;
            });

            tileElement.addEventListener('click', function() {
                tile.exit = true;
            });

            MAZE_ELEMENT.appendChild(tileElement);
        });
    }

    function walk(from, direction) {
        var allowedDirections,
            lastStep,
            tileNumber = getTileNumber(from, direction);

        removeWall(tileNumber, getOppositeDirection(direction));
        maze[tileNumber].visited = true;

        /*jshint boss:true */
        while(allowedDirections = getAllowedDirections(tileNumber)) {
            var rnd = Math.floor(Math.random() * allowedDirections.length),
                nextDirection = allowedDirections[rnd];

            removeWall(tileNumber, nextDirection);

            lastStep = walk(tileNumber, nextDirection);
        }

        return lastStep || tileNumber;
    }

    function getAllowedDirections(currentTile) {
        var allowed = Object.keys(DIRECTIONS)
                        .filter(onlyAdjacentTiles)
                        .filter(notVisited);

        return (allowed.length > 0) ? allowed : null;

        function onlyAdjacentTiles(direction) {
            var tileNumber = getTileNumber(currentTile, direction);

            return (getRow(tileNumber) === getRow(currentTile) || getColumn(tileNumber) === getColumn(currentTile));
        }

        function notVisited(direction) {
            var tileNumber = getTileNumber(currentTile, direction),
                tile = maze[tileNumber];

            return tile && !tile.visited;
        }
    }

    function getTileNumber(currentTile, direction) {
        return currentTile + DIRECTIONS[direction];
    }

    function getRow(tile) {
        return Math.ceil((tile + 1) / WIDTH);
    }

    function getColumn(tile) {
        return Math.floor((tile + 1) % WIDTH);
    }

    // Takes any direction and returns the opposite by performing magic on the array
    // index. 0 <-> 1, 2 <-> 3, etc.
    function getOppositeDirection(direction) {
        var directions = Object.keys(DIRECTIONS),
            index = directions.indexOf(direction),
            rest = index % 2,
            inverse = index + 1 - (2 * rest);

        return directions[inverse];
    }

    function removeWall(tile, direction) {
        var walls = maze[tile].walls,
            index = walls.indexOf(direction);

        return walls.splice(index, 1);
    }

    init();
}());