module.exports = class {
    
    constructor(maze) {
        this._maze = maze;

        this._DIRECTIONS = {
            left: -1,
            right: 1,
            up: -maze.columns,
            down: maze.columns
        };
    }

    generate(algorithm, start, end) {
        // Prefill path with start and finish
        let direction = this.getAllowedDirections(start)[0];
        let firstRoom = this.getNextTile(start, direction);
        let initialPath = [start, firstRoom, end];

        return this[algorithm](firstRoom, initialPath);
    }

    depthFirstSearch(from, path = []) {
        const getDirections = (from) => {
            let directions = this.getAllowedDirections(from, 2).filter((direction) => {
                let [wall, room] = this.getNextTiles(from, direction, 2);

                return path.indexOf(room) === -1 && !this._maze.isEdge(wall);
            });

            return directions.length ? directions : null;
        };

        const walk = (from) => {
            let allowedDirections;

            /*jshint boss:true */
            while(allowedDirections = getDirections(from)) {
                let nextDirection = this.getRandom(allowedDirections);
                let [wall, room] = this.getNextTiles(from, nextDirection, 2);

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

    getAllowedDirections(tile, step = 1) {
        return Object.keys(this._DIRECTIONS).filter((direction) => {

            let nextRoom = tile;

            for(let i = 0; i < step; i++) {
                nextRoom = this.getNextTile(nextRoom, direction);

                if(this._maze.isIntersection(nextRoom) || nextRoom > this._maze.tiles.length) {
                    return false;
                }
            }

            return true;
        });
    }

    getNextTile(tile, direction) {
        let next = tile + this._DIRECTIONS[direction];

        return this._maze.isAdjacent(tile, next) ? next : null;
    }

    getNextTiles(tile, direction, amount) {
        let tiles = [];

        while((tile = this.getNextTile(tile, direction)) && amount--) {
            tiles.push(tile);
        }

        return tiles;
    }

    solve(start, end) {
        let queue = [start];
        let steps = {};
        let visited = [start];
        let tile;

        const getTile = (direction) => this.getNextTile(tile, direction);
        const unvisitedTiles = (tile) => visited.indexOf(tile) === -1 && this._maze.path.indexOf(tile) > -1;

        const visitNext = (nextTile) => {
            steps[nextTile] = tile;
            visited.push(nextTile);

            if(nextTile === end) {
                queue = [];
            } else {
                queue.push(nextTile);
            }
        };

        // Mark starting point
        steps[start] = null;

        /*jshint boss:true */
        while(tile = queue.shift()) {
            this.getAllowedDirections(tile)
                .map(getTile)
                .filter(unvisitedTiles)
                .forEach(visitNext);
        }

        return [visited, steps];
    }

    // TODO: Add option for horizontal/vertical bias
    getRandom(array) {
        let rnd = Math.floor(Math.random() * array.length);
        return array[rnd];
    }
};