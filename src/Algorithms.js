class Algorithms {

    depthFirstSearch(maze, from, path = []) {
        const getDirections = function(from) {
            let directions = maze.getAllowedDirections(from, 2).filter((direction) => {
                let [wall, room] = maze.getNextTiles(from, direction, 2);

                return path.indexOf(room) === -1 && !maze.isEdge(wall);
            });

            return directions.length ? directions : null;
        };

        const walk = (from) => {
            let allowedDirections;

            /*jshint boss:true */
            while(allowedDirections = getDirections(from)) {
                let nextDirection = this.getRandom(allowedDirections);
                let [wall, room] = maze.getNextTiles(from, nextDirection, 2);

                path.push(wall);
                path.push(room);

                walk(room);
            }
        };

        try {
            walk(from);
        } catch (e) {
            alert(e + "\n\nTry generating a smaller maze or use the stacked approach (coming soon)");
        }

        return path;
    }

    solve(maze, start, end) {
        let queue = [start];
        let steps = {};
        let visited = [start];
        let tile;

        const getTile = (direction) => maze.getNextTile(tile, direction);
        const unvisitedTiles = (tile) => visited.indexOf(tile) === -1 && maze._path.indexOf(tile) > -1;

        const visitNext = (nextTile) => {
            steps[nextTile] = tile;
            visited.push(tile);

            if(nextTile === end) {
                queue = [];
            } else {
                queue.push(nextTile);
            }
        };

        // Mark starting point
        steps[start] = null;

        while(tile = queue.shift()) {
            maze.getAllowedDirections(tile)
                .map(getTile)
                .filter(unvisitedTiles)
                .forEach(visitNext);
        }

        return steps;
    }

    // TODO: Add option for horizontal/vertical bias
    getRandom(array) {
        let rnd = Math.floor(Math.random() * array.length);
        return array[rnd];
    }
}

module.exports = new Algorithms();