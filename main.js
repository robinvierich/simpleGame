g_startTime = 60000.0; // ms
g_gameState = new GameState(); // from models.js
g_gameTimer = null;

function createBoard(gameState) {
    var gameboard = $('#gameboard');

    var rows = 10;
    var columns = 10;

    for (var row = 0; row < rows; row++) {
        gameState.tiles[row] = [];
        for (var col = 0; col < columns; col++) {
            var tile = new Tile(row, col, g_gameState);
            gameState.tiles[row][col] = tile;
            gameboard.append('<div class="tile" id="'+ row + col +'"></div>');
            $(tile.getId()).data('tile', tile);
        }
    }
}

// Fisher-Yates algorithm for shuffling lists
// from : http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
function shuffleList ( myArray ) {
    var i = myArray.length, j, tempi, tempj;
    if ( i == 0 ) return false;
    while ( --i ) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        tempi = myArray[i];
        tempj = myArray[j];
        myArray[i] = tempj;
        myArray[j] = tempi;
    }
}

function fillTiles(gameState){
    var lvl = gameState.level;
    var vOffset = Math.max(0, 2 - Math.floor(lvl/2));
    var hOffset = Math.max(0, 2 - Math.ceil(lvl/2));

    var tilesToFill = (10 - 2*vOffset) * (10 - 2*hOffset);
    var images = [];
    var imageCount = 7;

    // need exactly 2 of each image.
    var imgId = 0;
    for (var i = 0; i < tilesToFill; i+=2) {
        images[i] = 'images/' + imgId % imageCount + '.png';
        images[i+1] = 'images/' + imgId % imageCount + '.png';
        imgId++;
    }

    shuffleList(images);

    for (var row = vOffset ; row < 10 - vOffset; row++) {
        for (var col = hOffset; col < 10 - hOffset; col++) {
            gameState.tiles[row][col].img = images.pop();
            gameState.tiles[row][col].occupied = true;
        }
    }
}

function increaseScore(gameState) {
    gameState.increaseScore();
    updateScores(gameState);
}

function findPath(tile1, tile2)
{
    path = breadthFirst(tile1, tile2);
    if (path) {
        return path;
    }

    return null;
}

function tileClickHandler() {
    var tile = $(this).data('tile');
    var otherTile = g_gameState.selectedTile;

    if (!tile.getOccupied()) {
        return;
    }

    if (otherTile != null){

        if (tile.equals(otherTile)){
            tile.unselect();
            return;
        }

        otherTile.unselect();

        if (tile.matches(otherTile)) {
            path = findPath(tile, otherTile);
            if (path) {
                drawPath(path);
                submitMatch(tile, otherTile);
            }
        }
    } else {
        tile.select();
    }
}

function drawPath(path){
    for (i = 0; i < path.length; i++){
        path[i].blinkPath();
    }
}

function initHandlers(gameState) {
    $('.tile').mousedown( tileClickHandler );
    $('#addTimeBtn').mousedown( function () {
        gameState.useAddTimeItem();
        updateItems(g_gameState)
    });
    $('#startEndBtn').mousedown( function () {
        if (gameState.started) {
            endGame();
        } else {
            startGame();
        }
    });
}

g_timerInterval = 25; // not using real Date objects here (for simplicity)
function updateTimer(){

    g_gameState.time -= g_timerInterval;

    var pct = g_gameState.time / g_startTime;
    $('#timerProgressBar').css('width', pct * 100 +'%');

    if (g_gameState.time <= 0) {
        stopTimer();
        alert("Time's Up!");
        endGame();
    }
}

function startTimer() {
    g_gameTimer = setInterval(updateTimer, g_timerInterval);
}

function stopTimer(){
    if (g_gameTimer) {
        clearInterval(g_gameTimer);
    }
}

function submitMatch(tile1, tile2) {
    increaseScore(g_gameState);
    tile1.clear();
    tile2.clear();
    updateUI(g_gameState);
    if (g_gameState.checkForWin()) {
        g_gameState.level += 1;
        startLevel(g_gameState);
    }
}

function updateScores(gameState) {
    var currentScore = gameState.getCurrentScore();
    $('#level').html(gameState.level);
    $('#currentScore').html(currentScore);
    $('#totalScore').html(gameState.getTotalScore());
}

function updateTileImages(gameState){
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            var tile = gameState.tiles[row][col];
            $(tile.getId()).html('<img src="' + tile.img + '" >');
        }
    }
}

function updateItems(gameState) {
    $('#addTimeItems').html(gameState.addTimeItems);
}

function updateStartEndBtn(gameState) {
    if (gameState.started) {
        $('#startEndBtn').html('End');
    } else {
        $('#startEndBtn').html('Start!');
    }
}

function updateUI(gameState){
    updateTileImages(gameState);
    updateScores(gameState);
    updateItems(gameState);
    updateStartEndBtn(gameState);
    updateTimer();
}

function startLevel(gameState){
    gameState.resetTime();
    stopTimer();
    fillTiles(gameState);
    updateUI(gameState);
    startTimer();
}

function endGame() {
    g_gameState.reset();
    g_gameState.started = false;
    updateUI(g_gameState);
    stopTimer();
}

function startGame() {
    g_gameState.reset();
    g_gameState.started = true;
    startLevel(g_gameState);
}

$(document).ready(function () {
    createBoard(g_gameState);
    initHandlers(g_gameState);
});
