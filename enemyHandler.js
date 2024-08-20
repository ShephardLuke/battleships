let testVar;
function enemyTurn() { // Computer's turn
  let hits = enemy.foundHits[0];
  let toShoot = [Math.round(Math.random() * 9), Math.round(Math.random() * 9)];
  let dir = false
  if (enemy.foundHits[0].length > 1) {
    dir = checkDir(enemy.foundHits[0]); // Get direction of hits
    let only = []
    if (dir === 0) {
      only = [-2, 2]
    } else if (dir === 1) {
      only = [-1, 1]
    }
    let found = false;
    for (let pos of hits) {
      let available = checkFor(enemy, 0, pos[0], pos[1], enemy.shootGrid, false, true, only)
      if (available.length > 0) {
        toShoot = available[0];
        found = true;
        break;
      }
    }
    if (!found) {
      for (let pos of enemy.foundHits[0]) {
        enemy.foundHits.push([pos]);
      }
      enemy.foundHits.shift();
      enemyTurn();
      return;
    }

  } else if (hits.length === 1) {
    let available = checkFor(enemy, 0, hits[0][0], hits[0][1], enemy.shootGrid);
    toShoot = available[Math.round(Math.random() * (available.length - 1))];
  }

  if (debug) {
    let debugInput = prompt("Place to fire: ");
    toShoot = [debugInput.substr(1) - 1, debugInput[0].toLowerCase().charCodeAt(0) - 97];
  }

  for (let y = 0; y < enemy.shootGrid.length; y++) { // Not same tile twice
    for (let x = 0; x < enemy.shootGrid[y].length; x++) {
      testVar = toShoot;
      if (toShoot[0] === y && toShoot[1] === x) {
        if (!(player.shipGrid[y][x] === 0 || player.shipGrid[y][x] === 1)) {
          enemyTurn();
          return;
        }
      }
    }
  }
  let toShootStr = String.fromCharCode(toShoot[1] + 65) + (toShoot[0] + 1).toString(); // for naming tile on webpage

  let code = takeTurn(toShoot, toShootStr, enemy, player);
  if (code === 1) { // Hit ship
    enemy.foundHits[0].push(toShoot);
  } else if (code === 2) { // Destroyed ship
    enemy.foundHits[0].push(toShoot);
    let largestHit = toShoot;
    let firstHit = enemy.foundHits[0][0];
    //console.log(firstHit, largestHit);
    let shipLen = sizes[player.destroyed[player.destroyed.length - 1]];
    let dir = checkDir([firstHit, largestHit])

    for (let pos of enemy.foundHits[0]) {
      if (dir === 0) {
        if (pos[1] < firstHit[1]) {
          firstHit = pos;
        }
        if (pos[1] > largestHit[1]) {
          largestHit = pos;
        }
      } else {
        if (pos[0] < firstHit[0]) {
          firstHit = pos;
        }
        if (pos[0] > largestHit[0]) {
          largestHit = pos;
        }
      }
    }

    let predicted = createShip(firstHit, largestHit);
    //console.log(enemy.foundHits, predicted, firstHit, largestHit, dir);
    let firstIndex;
    if (predicted.indexOf(toShoot) === 0) {
      firstIndex = false;
    } else {
      firstIndex = true;
    }
    while (predicted.length != shipLen) {
      if (firstIndex) {
        predicted.splice(predicted[0], 1);
      } else {
        predicted.pop();
      }

    }
    //console.log(predicted, shipLen);
    let toKeep = [];
    for (let i = 0; i < enemy.foundHits[0].length; i++) {
      let pos = enemy.foundHits[0][i];
      let found = false;
      for (let predPos of predicted) {
        if (pos[0] === predPos[0] && pos[1] === predPos[1]) {
          found = true;
        }
      }
      if (!found) {
        toKeep.push(enemy.foundHits[0][i]);
      }
    }
    enemy.foundHits[0] = toKeep;
    if (enemy.foundHits[0].length === 0 && enemy.foundHits.length > 1) {
      enemy.foundHits.shift();
    }
  }


  updateGrid(player.shipGrid, document.getElementById("shipGrid"), "B", player);

  setTimeout(function () {
    if (!checkWinner()) {
      document.getElementById("result").innerHTML = "It is your turn. Click a space on the top grid to shoot."
      player.turn = true;
    }
  }, 3000)
}
