function Board(ships, name, identifiers = [false, false], clickable) { // Board constructor, for player and enemy setup
    this.ships = ships;
    let container = [undefined, undefined];
    if (clickable) {
      container = [document.getElementById("shootGrid"), document.getElementById("shipGrid")];
    }
    this.shootGrid = createGrid([], identifiers[0], container[0], clickable); // two grids - one for own ships and enemy shots and other for own shots
    this.shipGrid = createGrid(ships, identifiers[1], container[1], false);
    this.name = name;
    this.destroyed = [];
    this.won = false;
    this.sameShip = function (tile1, tile2) {
      for (let ship of ships) {
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
  
  function createGrid(ships = [], identifier = false, container = undefined, clickable = false, hoverable = false) { // creates maps for constructor - adds ships to empty grid
    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    for (let y = 0; y < grid.length; y++) { // add ships to map (top map only)
      for (let x = 0; x < grid[y].length; x++) {
        for (let ship of ships) {
          for (let pos of ship) {
            if (pos[0] === y && pos[1] === x) {
              grid[y][x] = 1;
            }
          }
        }
      }
    }
    if (container == undefined) {
      return grid;
    }
    container.style.setProperty("--grid-rows", grid.length + 1);
    container.style.setProperty("--grid-columns", grid[0].length + 1);
    container.appendChild(document.createElement("div")).className = "grid-blank";
  
    for (let y = 0; y < grid[0].length; y++) {
      let tile = document.createElement("div");
      container.appendChild(tile).className = "grid-blank";
      tile.innerHTML = String.fromCharCode(y + 65);
    }
  
    for (let y = 0; y < grid.length; y++) {
      let cell = document.createElement("div");
      container.appendChild(cell).className = "grid-blank";
      cell.innerHTML = y + 1;
      for (let x = 0; x < grid[y].length; x++) {
        cell = document.createElement("div");
        let child = container.appendChild(cell);
        child.className = "grid-blank";
        cell.id = identifier + String(y) + String(x);
        if (clickable) {
          child.addEventListener("click", function () {
            onCellClick([y, x]);
          })
          child.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            onCellRightClick([y, x]);
          })
        }
        if (hoverable) {
          child.addEventListener("mouseover", function () {
            onCellHoverIn([y, x]);
          })
          child.addEventListener("mouseout", function () {
            onCellHoverOut([y, x]);
          })
        }
      }
    }
  
    return grid;
  }
  function generateShips() {
    let result = [[], [], [], [], []] // [], [], [], []]; // Where the final ship positions are stored
    for (let i = 0; i < sizes.length; i++) { // Loop through each ship size to generate positions
      let rotation = Math.round(Math.random())
      if (rotation) { // if rotation === 1 (1 = true), vertical - positions go down from the start number
        let toFind = [Math.round(Math.random() * (10 - sizes[i])), Math.round(Math.random() * 9)] // Random tile that will take whole ship size. It is checked first to see if it is alreay taken, if it is then it restarts.
        if (isOccupied(toFind, result)) {
          return generateShips();
        }
        result[i].push(toFind);
        for (let j = 1; j < sizes[i]; j++) { // Add following positions, checking if the tile is occupied so see if a restart is needed.
          if (isOccupied([result[i][0][0] + j, result[i][0][1]], result)) {
            return generateShips()
          }
          result[i].push([result[i][0][0] + j, result[i][0][1]])
        }
      } else { // horizontal - positions go right from start number
        let toFind = [Math.round(Math.random() * 9), Math.round(Math.random() * (10 - sizes[i]))]
        if (isOccupied(toFind, result)) {
          return generateShips();
        }
        result[i].push(toFind);
        for (let j = 1; j < sizes[i]; j++) {
          if (isOccupied([result[i][0][0], result[i][0][1] + j], result)) {
            return generateShips()
          }
          result[i].push([result[i][0][0], result[i][0][1] + j])
        }
      }
    }
    return result;
  }
  
  function checkShips(current) { // A check to see if any ships are destroyed, returning the index of it so it can be identified
    let ships = current.ships;
    let grid = current.shipGrid;
    let output = [];
    for (let ship of ships) {
      let destroyed = true;
      for (let pos of ship) {
        if (grid[pos[0]][pos[1]] === 1) { // If any part of ship has not been hit, it is not destroyed
          destroyed = false;
        }
      }
      if (destroyed) {
        output.push(ships.indexOf(ship));
      }
    }
    return output;
  }
  
  function checkFor(current, filter, y, x, grid, sameShip = false, getPos = true, only = [-2, -1, 1, 2]) {
    let found = [];
    let foundDir = [];
    if (y > 0) {
      if (grid[y - 1][x] === filter && (!sameShip || current.sameShip([y, x], [y - 1, x])) && only.includes(-1)) {
        found.push([y - 1, x])
        foundDir.push(-1);
      }
    }
    if (y < grid.length - 1) {
      if (grid[y + 1][x] === filter && (!sameShip || current.sameShip([y, x], [y + 1, x])) && only.includes(1)) {
        found.push([y + 1, x])
        foundDir.push(1);
      }
    }
    if (x > 0) {
      if (grid[y][x - 1] === filter && (!sameShip || current.sameShip([y, x], [y, x - 1])) && only.includes(-2)) {
        found.push([y, x - 1])
        foundDir.push(-2);
      }
    }
    if (x < grid.length - 1) {
      if (grid[y][x + 1] === filter && (!sameShip || current.sameShip([y, x], [y, x + 1])) && only.includes(2)) {
        found.push([y, x + 1])
        foundDir.push(2);
      }
    }
    if (getPos) {
      return found;
    } else {
      return foundDir;
    }
  }
  
  function checkDir(positions) {
    let startY = positions[0][0];
    let startX = positions[0][1];
    let yChanged = false;
    let xChanged = false;
    for (let pos of positions) {
      if (pos[0] != startY) {
        yChanged = true;
      }
      if (pos[1] != startX) {
        xChanged = true;
      }
    }
    if (!yChanged) {
      return 0;
    } else if (!xChanged) {
      return 1;
    }
    console.error("No direction found in dunction checkDir!");
    return false;
  }
  
  function updateGrid(grid, container, identifer, current) { // updates grid to webpage (user needs to see)
    for (let y = 0; y < grid.length; y++) {
      let nearby = []
      for (let x = 0; x < grid[0].length; x++) {
        let tile = document.getElementById(identifer + String(y) + String(x));
        switch (grid[y][x]) {
          case 1:
            tile.className = "grid-ship";
            nearby = checkFor(current, 1, y, x, grid, true, false, undefined).concat(checkFor(current, 3, y, x, grid, true, false, undefined));
            if (nearby.length > 0) {
              updateBorder(tile, nearby, "ship");
            }
            break;
          case 2:
            tile.className = "grid-miss";
            break;
          case 3:
            tile.className = "grid-hit";
            if (grid === player.shootGrid) {
              nearby = checkFor(current, 3, y, x, player.shootGrid, false, false, undefined);
            } else {
              nearby = checkFor(current, 1, y, x, player.shipGrid, true, false, undefined).concat(checkFor(current, 3, y, x, player.shipGrid, true, false, undefined));
            }
            if (nearby.length > 0) {
              updateBorder(tile, nearby, "hit");
            }
            break;
          default:
            tile.className = "grid-blank";
            updateBorder(tile, [-2, -1, 1, 2], "outline")
        }
      }
    }
  }
  
  function isOccupied(condition, grid) { // To stop two ships in one tile when generating
    for (let row of grid) {
      for (let pos of row) {
        if (pos[0] === condition[0] && pos[1] === condition[1]) { // Checks if a ship is already there
          return true;
        }
      }
    }
    return false;
  }