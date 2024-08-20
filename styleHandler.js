function updateBorder(tile, dir, varType) {
    let toAdd = "";
    if (dir.includes(-1)) {
      toAdd += "border-top: 1px solid var(--" + varType + "-color);"
    }
    if (dir.includes(1)) {
      toAdd += "border-bottom: 1px solid var(--" + varType + "-color);;"
    }
    if (dir.includes(-2)) {
      toAdd += "border-left: 1px solid var(--" + varType + "-color);;"
    }
    if (dir.includes(2)) {
      toAdd += "border-right: 1px solid var(--" + varType + "-color);;"
    }
    if (toAdd === "") {
      return;
    } else {
      tile.style = toAdd;
    }
  }
  
  function showProjection(projection, valid=true) {
    let type;
    updateGrid(setup.shipGrid, document.getElementById("setupGrid"), "S", setup);
    if (projection.length == 0) {
      return;
    }
    for (let pos of projection) {
      let cell = document.getElementById("S" + String(pos[0]) + String(pos[1]))
      cell.className = "grid-projection";
      if (!valid) {
        cell.className = "grid-projection-invalid";
      }
    }
    for (let pos of projection) {
      let cell = document.getElementById("S" + String(pos[0]) + String(pos[1]))
      let nearbyDir = checkFor(setup, 0, pos[0], pos[1], setup.shipGrid, false, false)
      let nearbyPos = checkFor(setup, 0, pos[0], pos[1], setup.shipGrid, false, true)
      let toAdd = []
      for (let i = 0; i < nearbyPos.length; i++) {
        let pos2 = nearbyPos[i]
        let cell2 = document.getElementById("S" + String(pos2[0]) + String(pos2[1]))
        if (cell2.className === "grid-projection" || cell2.className == "grid-projection-invalid") {
            type = cell2.className.substring(5);
            toAdd.push(nearbyDir[i]);
        }
      }
      if (toAdd.length > 0) {
        console.log(toAdd[0]);
        updateBorder(cell, toAdd, type);
      }
    }
  }
  