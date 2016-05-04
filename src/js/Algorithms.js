const PATH = 0;
const WALL = 1;

class Algorithms {

    depthFirstSearch(maze, from, direction) {
        let path = [];
        let x = 0;

        const getDirections = function(from, direction) {
            let directions = maze.getAllowedDirections(from, WALL, 2).filter((direction) => {
                let tile = maze.getNextTile(from, direction);
                return path.indexOf(tile) === -1
            });

            return directions.length ? directions : null;
        };

        const walk = function(from, direction) {
            let allowedDirections,
                lastStep,
                wall = maze.isWall(from) ? from : maze.getNextTile(from, direction),
                room = maze.getNextTile(wall, direction);

            path.push(wall);
            path.push(room);
            //maze.setTile(wall, PATH);
            //maze.setTile(room, PATH);

            /*jshint boss:true */
            while((allowedDirections = getDirections(room, direction)) && x++ < maze.tiles.length) {
                // TODO: Add option for horizontal/vertical bias
                let rnd = Math.floor(Math.random() * allowedDirections.length),
                    nextDirection = allowedDirections[rnd];

                lastStep = walk(room, nextDirection);
            }

            return lastStep || room;
        };

        try {
            walk(from, direction);
        } catch (e) {
            alert(e + "\n\nTry generating a smaller maze or use the stacked approach (coming soon)");
        }

        return path;
    }
}

module.exports = new Algorithms();