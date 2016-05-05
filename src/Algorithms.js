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

    // TODO: Add option for horizontal/vertical bias
    getRandom(array) {
        let rnd = Math.floor(Math.random() * array.length);
        return array[rnd];
    }
}

module.exports = new Algorithms();