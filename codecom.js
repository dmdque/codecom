// SUMMARY
//   * Your goal is to 'buy' a path of tiles from left to right.
//   * One group of tiles is available for bidding each turn.
//   * Each turn, bid to win one tile from the tile group.
//   * This code runs once a turn.


//////////////////////////////////////////////////////////////////////////////
// 1. Pick a tile from this turn's tileGroup to bid for.

// here we define 3 possible paths
// we will favour the path with a lower number

var highlightTile = this.highlightTile;

var i;
/**
 * array, function -> array
 */
var map = function(list, map_function) {
  var mapped = [];
  list.forEach(function(item) {
    mapped.push(map_function(item));
  });
  return mapped;
};

/**
 * returns the nearest column on the right of a tile with a human tile
 * if no tile, return right edge of board
 * tile, tile => Number
 */
var closestLeft = function(my_tiles, current_tile) {
  var max = -1;
  my_tiles.forEach(function(tile) {
    if(max < tile.x && tile.x < current_tile.x) {
      max = tile.x;
    }
  });
  return max;
};

/**
 * returns the nearest column on the right of a tile with a human tile
 * if no tile, return right edge of board
 * tile, tile => Number
 */
var closestRight = function(my_tiles, current_tile) {
  var min = 7;
  my_tiles.forEach(function(tile) {
    if(current_tile.x < tile.x && tile.x < min) {
      min = tile.x;
      highlightTile(tile);
    }
  });
  return min;
};

//var grid = this.tileGrid;

var debug = this.debug;
var grid = [ [0, 0, 0, 0, 0, 0, 0] , [0, 0, 0, 0, 0, 0, 0] , [0, 0, 0, 0, 0, 0, 0] , [0, 0, 0, 0, 0, 0, 0] , [0, 0, 0, 0, 0, 0, 0] , [0, 0, 0, 0, 0, 0, 0] , [0, 0, 0, 0, 0, 0, 0] ];

var propagateLeft = function(tile) {
  var left_bound = closestLeft(my_tiles, tile);
  for(var j = -1; tile.x + j > left_bound; j--) {
    debug('left tile.x + j: ', tile.x + j);
    grid[tile.x + j][tile.y] += 2;
    for(var k = -1; k > j; k--) {
      if(tile.y + k < 7) {
        grid[tile.x + j][tile.y + k] += 1;
      }
      if(tile.y - k >= 0) {
        grid[tile.x + j][tile.y - k] += 1;
      }
    }
  }
};

var propagateRight = function(tile) {
  debug(grid);
  var right_bound = closestRight(my_tiles, tile);
  for(var j = 1; tile.x + j < right_bound; j++) {
    debug('right tile.x + j: ', tile.x + j);
    grid[tile.x + j][tile.y] += 2;
    for(var k = 1; k <= j; k++) {
      if(tile.y + k < 7) {
        grid[tile.x + j][tile.y + k] += 1;
      }
      if(tile.y - k >= 0) {
        grid[tile.x + j][tile.y - k] += 1;
      }
    }
  }
};


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

var this_getTile = this.getTile;
var isWantedTile = function(tile) {
  if(tile.y == 1) {
    // try this.parent?
    if(this_getTile(tile.x, 2).owner === null) {
      return true;
    } else if(this_getTile(tile.x, 2).owner == 'humans') {
      return false;
    } else { // if(this_getTile(tile.x, 2).owner === 'ogres') {}
      // essential to get this square:
      // bid high
      my_bid = 22;
      return true;
    }
  } else if(tile.y == 2) {
    if(this_getTile(tile.x, 1).owner === null) {
      return true;
    } else if(this_getTile(tile.x, 1).owner === 'humans') {
      return false;
    } else { // if(this_getTile(tile.x, 1).owner === 'ogres') {}
      my_bid = 22;
      return true;
    }
  } else {
    return false;
  }
};

// for blocking other player
var isEnemyBelow = function(tile) {
  if(tile.y > 1) {
    return (this.getTile(tile.x, tile.y - 1).owner == 'ogres');
  } else {
    return false;
  }
};


var tiles = this.tileGroups[tileGroupLetter]; // tiles available this turn
var wanted_tile = null;
var tile, coordinates;
var my_bid = null;
var my_tiles = this.myTiles;

// main

for(i = 0; i < my_tiles.length; i++) {
  tile = my_tiles[i];
  if(tile.owner == 'humans') {
    highlightTile(tile);
    propagateRight(tile);
    propagateLeft(tile);
  }
}

var highest_value = -1;
for(i = 0; i < tiles.length; i++) {
  tile = tiles[i];
  if(tile.owner) { continue; } // can't buy a tile that's been bought
  if(grid[tile.x][tile.y] > highest_value) {
    this.highlightTile(tile);
    highest_value = grid[tile.x][tile.y];
    wanted_tile = tile;
  }
}
this.debug('highest_value: ', highest_value);

//OUTER:
//for (i = 0; i < tiles.length; i++) {
  //tile = tiles[i];
  //if (tile.owner) continue;  // can't buy a tile that's been bought

  //this.debug('hi');
  //if(isWantedTile(tile) === true) {
    //wanted_tile = tile;
    //break OUTER;
  //} else {
    //this.highlightTile(tile);
  //}

//}

/*
this.turns.length
this.turns[this.turns.length - 1].ogres

*/

// If none of the tiles you want are available, skip this round.
if(!wanted_tile) {
  return null;
}

//////////////////////////////////////////////////////////////////////////////
// 2. Choose your bid price. You only pay and win the tile if your bid wins.

//if(this.myTiles.length < 6) {
  //if(my_bid === null) {
    //if(wanted_tile.x == 3) {
      //my_bid = 22; // for specific enemy
    //} else {
      //my_bid = 18;
    //}
  //}
//} else {
  //my_bid = this.gold;
//}
// bid 21 unless last turn, bid 2
my_bid = 12;

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
// VERSION 3.0.3
