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
var my_bid = null;

var this_getTile = this.getTile;
var isWantedTile = function(tile) {
  if(tile.x == 1) {
    // try this.parent?
    if(this_getTile(2, tile.y).owner === null) {
      return true;
    } else if(this_getTile(2, tile.y).owner == 'ogres') {
      return false;
    } else { // if(this_getTile(tile.x, 2).owner === 'ogres') {}
      // essential to get this square:
      // bid high
      my_bid = 22;
      return true;
    }
  } else if(tile.x == 2) {
    if(this_getTile(1, tile.y).owner === null) {
      return true;
    } else if(this_getTile(1, tile.y).owner === 'ogres') {
      return false;
    } else { // if(this_getTile(tile.x, 1).owner === 'ogres') {}
      my_bid = 22;
      return true;
    }
  } else {
    return false;
  }
};

OUTER:
for (i = 0; i < tiles.length; i++) {
  tile = tiles[i];
  if (tile.owner) continue;  // can't buy a tile that's been bought

  this.debug('hi');
  if(isWantedTile(tile) === true) {
    wanted_tile = tile;
    break OUTER;
  } else {
    this.highlightTile(tile);
  }

}

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

if(this.myTiles.length < 6) {
  if(my_bid === null) {
    my_bid = 20;
  }
} else {
  my_bid = this.gold;
}
// bid 21 unless last turn, bid 2

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
// VERSION 1.0.1
