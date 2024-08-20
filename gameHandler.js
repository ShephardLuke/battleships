let sizes = [2, 3, 3, 4, 5] // Ship sizes - 2, 3, 3, 4, 5 - source: wikipedia

let shipNames = ["Patrol Boat", "Submarine", "Destroyer", "Battleship", "Carrier"]; // Source - wikipedia

function onCellClick(tile) {
  if (inSetup) {
    addSetupShip(tile)
  } else {
    if (player.turn) {
      player.turn = false;
      playerTurn(tile);
    }
  }
}

function onCellRightClick(tile) {
  if (inSetup) {
    destroySetupShip(tile);
  }
}

function onCellHoverIn(tile) {
  if (inSetup) {
    setupHoverIn(tile);
  }
}

function onCellHoverOut(tile) {
//   if (inSetup) {
//     setupHoverOut(tile)
//   }
}

function startGame() {
  inSetup = false;
  let playerShips = [];
  for (let size of sizes) {
    for (let ship of setup.ships) {
      if (size === ship.length && !playerShips.includes(ship)) {
        playerShips.push(ship)
        break
      }
    }
  }
  setup.ships = playerShips;
  player = new Board(setup.ships, "Your", ["A", "B"], true) // Creates boards and 2D arrays that contain ship positions to keep track of which ones are down
  player.turn = true;
  enemy = new Board(generateShips(), "The enemy's", ["C", "D"])
  enemy.foundHits = [[]];
  updateGrid(player.shipGrid, document.getElementById("shipGrid"), "B", player)
}

function takeTurn(toShoot, tileName, current, other) { // Where code shared between player and enemy is ran
  let code = 0;
  let tileShot = shoot(other.shipGrid[toShoot[0]][toShoot[1]]) // tileShot = miss (2) or hit (3)
  current.shootGrid[toShoot[0]][toShoot[1]] = tileShot; // Update grids
  other.shipGrid[toShoot[0]][toShoot[1]] = tileShot;

  let destroyedText = "";
  let destroyCheck = [];

  destroyCheck = checkShips(other); // Check if any ship has been destroyed, if so add it to the text display so the player knows
  let textToAdd = current.name + " shot was fired at " + tileName + "! It was a ";
  if (tileShot === 2) {
    textToAdd += "miss...";
  } else {
    textToAdd += "hit!";
    code = 1;
  }

  for (let ship of destroyCheck) {
    if (!other.destroyed.includes(ship)) {
      destroyedText = " " + other.name + " " + shipNames[ship] + " has sunk!";
      other.destroyed.push(ship);
      code = 2;
    }
  }

  textToAdd += destroyedText;

  document.getElementById("result").innerHTML = textToAdd;

  if (other.destroyed.length === other.ships.length) {
    current.won = true;
  }
  return code;
}

function shoot(tile) { // Checks if the tile chosen is a hit or a miss
  switch (tile) {
    case 0: // Empty
      return 2; // Miss
    case 1: // Ship
      return 3; // Hit
    default:
      return tile; // Change nothing if same tile was hit more than once
  }
}

function createShip(first, last) {
  let predicted = [];
  predicted.push(last);
  let direction = false;
  if (first[1] > last[1]) {
    direction = 2;
  } else if (first[1] < last[1]) {
    direction = -2;
  } else if (first[0] > last[0]) {
    direction = 1;
  } else {
    direction = -1;
  }
  let i = 0;
  let lastPoint = last;
  while (true) {
    lastPoint = predicted[predicted.length - 1];
    if (lastPoint[0] == first[0] && lastPoint[1] == first[1]) {
      break;
    }
    if (direction === 2) { // right
      predicted.push([lastPoint[0], lastPoint[1] + 1]);
    } else if (direction === -2) { // left
      predicted.push([lastPoint[0], lastPoint[1] - 1]);
    }
    if (direction === 1) { // up
      predicted.push([lastPoint[0] + 1, lastPoint[1]]);
    } else if (direction === -1) { // down
      predicted.push([lastPoint[0] - 1, lastPoint[1]]);
    }
    i++;
    if (i > 10) {
      return false;
    }
  }
  return predicted;
}

function checkWinner() {
  let displayText = "";
  if (player.won && !enemy.won) {
    displayText += "Congratulations! You have won!";
  } else if (!player.won && enemy.won) {
    displayText += "The enemy has won! Better luck next time...";
  } else if (player.won && enemy.won) {
    displayText += "It is a draw!"; // Not actually possible
  } else {
    return false;
  }

  document.getElementById("result").innerHTML = displayText;
  return true;
}