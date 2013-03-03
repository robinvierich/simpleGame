// from tile1 -> tile2
function getDirection(tile1, tile2){
    if (tile1 == null || tile2 == null || tile1 == tile2) {
        return null;
    }

    if (tile2.row === tile1.row) {
        if (tile2.col > tile1.col){
            return 'right';
        } else {
            return 'left';
        }
    }
    if (tile2.col === tile1.col) {
        if (tile2.row > tile1.row){
            return 'down';
        } else {
            return 'up';
        }
    }
}

function getDirectionChangeCount(path) {
    var directionChangeCount = 0;

    if (path.length < 3) {
        return 0;
    }

    for (var i = 2; i < path.length; i++){
        var prevDir = getDirection(path[i-2], path[i-1]);
        var curDir = getDirection(path[i-1], path[i]);

        if (prevDir !== curDir){
            directionChangeCount++;
        }
    }

    return directionChangeCount;
}

function buildPath(startTile, endTile, parents)
{
    var curTile = endTile;
    var path = [curTile];
    while (curTile !== startTile) {
        curTile = parents[curTile];
        path.push(curTile);
    }

    return path
}

function breadthFirst(tile1, tile2)
{
    var curTile = null;

    var tileQueue = [tile1];
    var usedTiles = {};
    var parents = {};

    while (tileQueue.length > 0) {
        curTile = tileQueue.shift();

        if (curTile === tile2) {
            var path = buildPath(tile1, tile2, parents);
            var directionChangeCount = getDirectionChangeCount(path);

            if (directionChangeCount < 3){
                return path;
            }
        }

        neighbours = curTile.getNeighbours();

        for(var i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];

            // already visted or occupied
            if (usedTiles.hasOwnProperty(neighbour) ||
                (neighbour.getOccupied() && neighbour != tile2)) {
                    continue;
            }

            parents[neighbour] = curTile;
            tileQueue.push(neighbour);
            usedTiles[neighbour] = null;
        }

        usedTiles[curTile] = null;
    }
}

