'use strict'

function playerTurn(tile) { // Player's turn
  let tileStr = String.fromCharCode(tile[1] + 97).toUpperCase() + String(tile[0] + 1);
  takeTurn(tile, tileStr, player, enemy);
  updateGrid(player.shootGrid, document.getElementById("shootGrid"), "A", player); // Add boards to page

  setTimeout(function () {
    if (!checkWinner()) {
      enemyTurn();
    }
  }, 3000)

}
