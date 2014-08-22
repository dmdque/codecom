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
var path_1 = [[0,0], [1,1], [2,2], [3,3], [4,4], [5,5], [6,6]];
var path_2 = [[0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0]];
var path_3 = [[0,1], [1,1], [2,1], [3,1], [4,1], [5,1], [6,1]];
var all_paths = [path_1, path_2, path_3];

var tiles = this.tileGroups[tileGroupLetter];  // tiles available this turn
var wanted_tile = null;
var tile, coordinates, i, j;
var k;

OUTER:
for (i = 0; i < tiles.length; i++) {
  tile = tiles[i];
  if (tile.owner) continue;  // can't buy a tile that's been bought

  var path_num;

  for(path_num = 0; path_num < all_paths.length; path_num++) {
    for(j = 0; j < all_paths[path_num].length; j++) {
      coordinates = all_paths[path_num][j];
      if (coordinates[0] === tile.x && coordinates[1] === tile.y) {
        // We have a match!
        wanted_tile = tile;
        break OUTER;
      }
    }
  }
}


// If none of the tiles you want are available, skip this round.
if(!wanted_tile) {
  return null;
}

//////////////////////////////////////////////////////////////////////////////
// 2. Choose your bid price. You only pay and win the tile if your bid wins.

var my_bid = Math.floor(1 + Math.random() * 10);
var my_bid = (5 - path_num) * 2;

//////////////////////////////////////////////////////////////////////////////
// 3. Respond with an object with properties 'gold' and 'desiredTile'.

return {gold: my_bid, desiredTile: wanted_tile};


// -- FOR MORE INFO, READ THE GUIDE -- //
//         It's at the top bar.

