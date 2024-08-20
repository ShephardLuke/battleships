let clickedOn = [];
let projection = [];
let currentShip = [];
let leftSizes = [];

for (let size of sizes) {
  leftSizes.push(size);
}

let setup = {
  shipGrid: [],
  ships: [],
  sameShip: function (tile1, tile2) {
    for (let ship of setup.ships) {
      let found = 0;
      for (let pos of ship) {
        if (pos[0] === tile1[0] && pos[1] === tile1[1]) {
          found++
        }
        if (pos[0] === tile2[0] && pos[1] === tile2[1]) {
          found++
        }
      }
      if (found === 2) {
        return true;
      }
    }
    return false;
  }
}

function setupShips(mode) {
  if (mode === 0) {
    updateText();
    setup.shipGrid = createGrid([], "S", document.getElementById("setupGrid"), true, true);
  }
}

function addSetupShip(tile) {
  if (leftSizes.length === 0) {
    return;
  }
  if (setup.shipGrid[tile[0]][tile[1]] === 1) {
    return;
  }
  clickedOn.push(tile);
  if (clickedOn.length === 2) {
    if (clickedOn[0][0] === clickedOn[1][0] && clickedOn[0][1] === clickedOn[1][1]) {
      clickedOn.pop()
      console.log(clickedOn);
      return;
    }
    let ship = createShip(currentShip[0], currentShip[currentShip.length - 1]);
    if (ship === false) {
      clickedOn = [];
      return;
    }
    if (!leftSizes.includes(ship.length)) {
      clickedOn.pop();
      return false;
    }
    for (let pos of ship) {
      if (setup.shipGrid[pos[0]][pos[1]] === 1) {
        clickedOn = [];
        showProjection([], false);
        return;
      }
    }
    setup.ships.push(ship);
    for (let pos of ship) {
      setup.shipGrid[pos[0]][pos[1]] = 1;
    }
    leftSizes.splice(leftSizes.indexOf(ship.length), 1);
    updateGrid(setup.shipGrid, document.getElementById("setupGrid"), "S", setup);
    updateText();
    clickedOn = [];
  } else {
    showProjection([tile], false);
  }
}

function setupHoverIn(tile) {
  projection = []
  let valid = true;
  if (clickedOn.length === 0) {
    return;
  }
  let ship = createShip(clickedOn[0], tile);
  if (ship === false || ship.length > leftSizes[leftSizes.length - 1]) {
    return;
  }
  if (!leftSizes.includes(ship.length)) {
    valid = false;
  }
  for (let pos of ship) {
    if (setup.shipGrid[pos[0]][pos[1]] === 1) {
      return;
    }
  }
  for (let pos of ship) {
    projection.push(pos);
  }
  currentShip = projection
  showProjection(projection, valid);
}

function destroySetupShip(tile) {
  projeciton = [];
  clickedOn = [];
  for (let i = 0; i < setup.ships.length; i++) {
    let ship = setup.ships[i];
    if (setup.sameShip(tile, ship[0])) {
      setup.ships.splice(i, 1);
      for (let pos of ship) {
        setup.shipGrid[pos[0]][pos[1]] = 0;
      }
      leftSizes.push(ship.length);
      break
    }
  }
  updateGrid(setup.shipGrid, document.getElementById("setupGrid"), "S", setup);
  updateText();
}

function updateText() {
  let text = document.getElementById("setupNeed");
  text.innerHTML = "Ships left to place: "
  let toAdd = "";
  let temp = [];
  for (let size of leftSizes) {
    temp.push(size);
  }
  let index = 0;
  while (temp.length > 0) {
    if (temp.includes(sizes[index])) {
      toAdd += `${shipNames[index]} (${sizes[index]})`
      temp.splice(temp.indexOf(sizes[index]), 1)
      if (temp.length != 0) {
        toAdd += ", ";
      }
    }
    index++;
  }
  if (toAdd === "") {
    text.innerHTML = "All ships have been placed. Press play to start the game!"
    document.getElementById("playButton").style = "display:inline";
  } else {
    text.innerHTML += toAdd;
    document.getElementById("playButton").style = "display:none";
  }

}
