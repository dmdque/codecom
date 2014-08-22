
// SUMMARY
//   * Your goal is to 'buy' a path of tiles from left to right.
//   * One group of tiles is available for bidding each turn.
//   * Each turn, bid to win one tile from the tile group.
//   * This code runs once a turn.


//////////////////////////////////////////////////////////////////////////////
// 1. Pick a tile from this turn's tileGroup to bid for.

// Here's a dumb but (relatively) simple strategy: try to buy a specific path.
// HINT: the default code for the other team is going for this path too!
// here we define 3 possible paths
// we will favour the path with a lower number


/**
 * access to how much remaining gold?
 */

var tiles = this.tileGroups[tileGroupLetter];  // tiles available this turn
var wanted_tile = null;
var tile, coordinates, i, j;
var k;

/**
 * returns true if same col, false if not
 */
var isSameCol = function(tile1, tile2) {
  if(tile1[0] == tile2[0]) {
    return true;
  } else {
    return false;
  }
};

/**
 * returns true if same row, false if not
 */
var isSameRow = function(tile1, tile2) {
  if(tile1[1] == tile2[1]) {
    return true;
  } else {
    return false;
  }
};


var isInTargetRows = function(tile) {
  if(tile.y == 1) {
    return true;
  } else if(tile.y == 2) {
    return true;
  //} else if(tile.y == 3) {
    //return true;
  } else {
    return false;
  }
};

var isWantedTile = function(tile) {
  if(tile.y == 1) {
    if(this.getTile(tile.x, 2).owner === null) {
      return true;
    } else if(this.getTile(tile.x, 2).owner == 'humans') {
      return false;
    } else { // if(this.getTile(tile.x, 2).owner === 'ogres') {}
      return true;
    }
  } else if(tile.y == 2) {
    if(this.getTile(tile.x, 1).owner === null) {
      return true;
    } else if(this.getTile(tile.x, 1).owner === 'humans') {
      return false;
    } else { // if(this.getTile(tile.x, 1).owner === 'ogres') {}
      return true;
    }
  } else {
    return false;
  }
}
  //if(!isInTargetRows(tile)) {
    //return false;
  //}
  //for(path_num = 0; path_num < all_paths.length; path_num++) {
    //for(j = 0; j < all_paths[path_num].length; j++) {
      //coordinates = all_paths[path_num][j];
      //if (coordinates[1] === tile.x && coordinates[1] === tile.y) {
        //// We have a match!
        //wanted_tile = tile;
        //break OUTER;
      //}
    //}
  //}

// for blocking other player
var isEnemyBelow = function(tile) {
  if(tile.y > 1) {
    return (this.getTile(tile.x, tile.y - 1).owner == 'ogres');
  } else {
    return false;
  }
};


OUTER:
for (i = 0; i < tiles.length; i++) {
  tile = tiles[i];
  if (tile.owner) continue;  // can't buy a tile that's been bought

  this.debug('hi');
  if(isWantedTile(tile) == true) {
    wanted_tile = tile;
    break OUTER;
  } else {
    this.highlightTile(tile);
  }
}


// If none of the tiles you want are available, skip this round.
if(!wanted_tile) {
  return null;
}

//////////////////////////////////////////////////////////////////////////////
// 2. Choose your bid price. You only pay and win the tile if your bid wins.

//var my_bid = Math.floor(1 + Math.random() * 10);
// very simple for now
var my_bid = 18;

//////////////////////////////////////////////////////////////////////////////
// 3. Respond with an object with properties 'gold' and 'desiredTile'.

return {gold: my_bid, desiredTile: wanted_tile};


// -- FOR MORE INFO, READ THE GUIDE -- //
//         It's at the top bar.

// TESTS
// isEnemyBelow test
//var isEnemyBelowTest = function(tile) {
  //this.highlightTile(tile);
  //this.debug('isEnemyBelow: ', isEnemyBelow(tile));
//}
