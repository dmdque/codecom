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
    var points = 4;
    grid[tile.x + j][tile.y] += points;
    points--;
    //for(var k = -1; k >= -1 && points > 0; k--) {
    for(var k = -1; k >= j && points; k--) {
      points--;
      if(tile.y + k < 7) {
        grid[tile.x + j][tile.y + k] += points;
      }
      if(tile.y - k >= 0) {
        grid[tile.x + j][tile.y - k] += points;
      }
    }
  }
};

var propagateRight = function(tile) {
  debug(grid);
  var right_bound = closestRight(my_tiles, tile);
  for(var j = 1; tile.x + j < right_bound; j++) {
    debug('right tile.x + j: ', tile.x + j);
    var points = 4;
    grid[tile.x + j][tile.y] += points;
    points--;
    //for(var k = 1; k <= 1 && points; k++) {
    for(var k = 1; k <= j && points; k++) {
      points--;
      if(tile.y + k < 7) {
        grid[tile.x + j][tile.y + k] += points;
      }
      if(tile.y - k >= 0) {
        grid[tile.x + j][tile.y - k] += points;
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

var createImportanceGrid = function() {
  for(i = 0; i < my_tiles.length; i++) {
    tile = my_tiles[i];
    propagateRight(tile);
    propagateLeft(tile);
  }
};

var highest_value;
/**
 * returns wanted tile and sets highest value to the tile's value
 */
var pickBestTile = function() {
  //TODO: // to try: if I have 2 or more tiles, score must be 2 or greater to want
  // (maybe 3 or greater)
  highest_value = -1;
  if(my_tiles.length >= 1) {
    highest_value = 4;
  }
  for(i = 0; i < tiles.length; i++) {
    tile = tiles[i];
    if(tile.owner) { continue; } // can't buy a tile that's been bought
    // can take this out with new >=2 limit
    //if(tile.y < 2 || tile.y > 4) { continue; } // limit to middle three
    if(grid[tile.x][tile.y] >= highest_value) {
      highlightTile(tile);
      highest_value = grid[tile.x][tile.y];
      wanted_tile = tile;
    }
  }
  return wanted_tile;
};

createImportanceGrid();
wanted_tile = pickBestTile();
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


//TODO: turn into function
var bid_strat1 = [21, 21, 21, 21, 21, 21, 2];
var bid_strat2 = [18, 18, 18, 18, 18, 19, 19];
var bid_strat3 = [17, 17, 17, 17, 17, 17, 26];
var bid_strat4 = [17, 17, 17, 17, 17, 17, 26];
var bid_strat5 = [17, 17, 17, 17, 17, 17, 26];
var bid_strat6 = [20, 20, 20, 20, 20, 20, 8];
var bid_strat7 = [8, 20, 20, 20, 20, 20, 20];
var bid_strats = [bid_strat1, bid_strat2, bid_strat3, bid_strat4, bid_strat5, bid_strat6, bid_strat7];
//var strat_num = Math.floor(Math.random() * 4);

if(this.myTiles.length === 0) {
  my_bid = bid_strats[this.round % 7][this.myTiles.length];
} else {
  if(highest_value === 0) {
    return null;
  } else {
    my_bid = bid_strats[this.round % 3][this.myTiles.length];
  }
}


// need to improve bidding strategy
// look to what they're doing, and bid responsively
// 

// detect if enemy is about to win

/*
check each row
check if two rows are connected
if not, check if a valid play could connect them

*/
var opponent_tiles = this.opponentTiles;
var checkOppoonentclose = function(opponent_tiles) {
  var current_tiles;
  var lifeboat = null;



  // try to get to the other side
  // with one lifeboat allowed
  // find a tile with row = 0, col = *
  for(var row = 0; row < 7; row++) {
  }
}


// note that it's possible to have multiple lifeboats that solve the path
// this doesn't account for cases with 'redundant' but neessary tiles
var step = function(current_tile, lifeboat) {
  var row = current_tile.y + 1;
  var col = current_tile.x;
  if(row === 7) {
    // got to the other side
    return {finished: true, lifeboat: lifeboat};
  }
  var current_tiles = opponent_tiles.filter(function(tile) {
    if(row === 0) {
      if(tile.y == row) {
        return true;
      } else {
        return false;
      }
    } else {
      if(tile.y == row && (tile.x == col - 1 || tile.x == col || tile.x == col + 1)) {
        return true;
      } else {
        return false;
      }
    }
  });
  if(current_tiles == []) {
    if(lifeboat === null) {
      current_tiles.push({x: col - 1, y: row});
      current_tiles.push({x: col, y: row});
      current_tiles.push({x: col + 1, y: row});
    }
  } else {
    // at least two holes
    return false; // no path
  }
  var problems = [];
  var return_val = false;
  current_tiles.forEach(function(tile) {
    var boat = step(file, lifeboat);
    if(boat.finished == true) {
      problems.push(boat);
    } else if(boat.finished == 'pass') {
      return boat;
    }
  });
  return {finished: 'pass', lifeboats: problems};
}
debug(step({x: 0, y: -1}, null));

//if(this.myTiles.length === 0) {
  //my_bid = 8;
//} else {
  //if(highest_value === 0) {
    //return null;
    ////my_bid = 1;
  //} else {
    //my_bid = 20;
  //}
//}

//////////////////////////////////////////////////////////////////////////////
// 3. Respond with an object with properties 'gold' and 'desiredTile'.

return {gold: my_bid, desiredTile: wanted_tile};


// -- FOR MORE INFO, READ THE GUIDE -- //
//         It's at the top bar.

// TESTS
// isEnemyBelow test
//var isEnemyBelowTest = function(tile) {
  //this.highlissssssssssssssssssssssssssshtTile(tile);
  //this.debug('isEnemyBelow: ', isEnemyBelow(tile));
//}
// VERSION 3.1.3
