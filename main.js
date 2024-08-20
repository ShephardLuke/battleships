let mode;
let inSetup = true;
let player;
let enemy;
let debug = false; // For testing, currently it only lets you choose where the enemy shoots.

function onePlayer() {
  mode = 0;
  document.getElementById("menu").style = "display:none";
  document.getElementById("setup").style = "display:block";
  setupShips(mode)
}

function setupComplete() {
  document.getElementById("setup").style = "display:none";
  document.getElementById("game").style = "display:block";
  startGame();
}
