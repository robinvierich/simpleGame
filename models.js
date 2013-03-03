function GameState(){
    this.scores = [];
    this.tiles = [];
    this.level = 0;
    this.time = g_startTime; // ms
    this.selectedTile = null;
    this.addTimeItems = 3;
    this.pointsPerMatch = 20;
    this.started = false;

    this.checkScoreDefined = function() {
        if ('undefined' !== typeof(this.scores[this.level]) ){
            return;
        }

        this.scores[this.level] = 0;
    }

    this.increaseScore = function(){
        this.checkScoreDefined();
        this.scores[this.level] += this.pointsPerMatch;
        if (this.getTotalScore() % (this.pointsPerMatch*5) === 0){
            this.addTimeItems += 1;
        }
    }

    this.getCurrentScore = function (){
        this.checkScoreDefined();
        return this.scores[this.level];
    }

    this.getTotalScore = function() {
        var total = 0;
        for (i = 0; i < this.scores.length; i++){
            total += this.scores[i];
        }
        return total;
    }

    this.checkForWin = function(){
        for (var i = 0; i < this.tiles.length; i++){
            for(var j = 0; j < this.tiles.length; j++){
                if (this.tiles[i][j].getOccupied()){
                    return false;
                }
            }
        }
        return true;
    }

    this.useAddTimeItem = function() {
        if (this.addTimeItems > 0) {
            this.time += 8000;
            this.time = Math.min(this.time, g_startTime);
            this.addTimeItems -= 1;
        }
    }

    this.resetTime = function () {
        this.time = g_startTime;
    }

    this.reset = function () {
        this.scores = [];
        this.level = 0;
        this.time = g_startTime; // ms
        this.selectedTile = null;
        this.addTimeItems = 3;
        this.started = false;
    }
}

function Tile(row, col, gameState){
    this.row = row;
    this.col = col;
    this.img = "";
    this.selectedTimer = null;
    this.gameState = gameState;

    this.getId = function() {
        return '#' + this.row + this.col;
    }

    this.toString = function() {
        return 'r'+(this.row + 1)+'-c'+(this.col + 1);
    }

    this.getOccupied = function() {
        return this.img !== "";
    }

    this.matches = function(otherTile) {
        return this.img === otherTile.img;
    }

    this.equals = function (otherTile) {
        return this.row == otherTile.row && this.col == otherTile.col;
    }

    this.clear = function () {
        this.img = '';
        $(this.getId()).find('img').hide('explode');
    }

    this.blinkPath = function() {
        var id = this.getId();
        $(id).addClass('path');

        var timer = setInterval( function () {
            $(id).removeClass('path');
            clearInterval(timer);
        }, 300);
    }

    this.getNeighbours = function() {
        var tiles = this.gameState.tiles;
        var neighbours = [];
        if (this.row > 0) {
            neighbours.push(tiles[this.row-1][this.col]);
        }
        if (this.row < 9) {
            neighbours.push(tiles[this.row+1][this.col]);
        }

        if (this.col > 0) {
            neighbours.push(tiles[this.row][this.col-1]);
        }
        if (this.col < 9) {
            neighbours.push(tiles[this.row][this.col+1]);
        }

        return neighbours
    }

    this.select = function() {
        var id = this.getId();
        $(id).addClass('selected');

        this.selectedTimer = setInterval(function () {
            $(id).toggleClass('selected');
        },400);

        this.gameState.selectedTile = this;
    }

    this.unselect = function () {
        $(this.getId()).removeClass('selected');
        if (this.gameState.selectedTile === this){
            this.gameState.selectedTile = null;
        }
        if (this.selectedTimer) {
            clearInterval(this.selectedTimer);
            this.selectedTimer = null;
        }
    }
}


