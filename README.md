# Battleships
### https://battleships.shephardluke.co.uk
My own version of the battleships game, made with HTML, CSS and JavaScript. Made in December 2021 in about a week.

# How to play
## Setup
Press the play butto which will start the game setup. You have to place your 5 ships where you want on the grid by first clicking the start square, then you will see a preview of where your ship will be if you move the mouse around. Clicking will place the previewed ship in that place.

Ships can be placed only horizontally or vertically, and a grey preview means that is a valid placement, otherwise a red preview means a ship of that length cannot be created due to there being one already there or it is an invalid length. Right clicking a placed ship will delete it allowing you to replace it somewhere else.

After you place all 5 ships (lengths 2, 3, 3, 4, 5) you can press play to start the actual game.

## Playing the game
There will be 2 grids on the screen, the top is the enemy (CPU) and the bottom is yours with your ships visible, just like in normal battleships. The enemy will have the same battleships in their grid in any position, hidden from you. Your goal is to find and destroy their ships before they destroy you.

### Your turn
When the text in the middle says its your turn, you can click a sqaure in the enemy's (top) grid to guess where you think one of their ships is. Once you click the sqaure it will either turn white (miss) or red (hit their ship).

### The enemy's (CPU) turn
Once you have guessed a square, the enemy will try to guess one of your squares. You will see in your bottom grid which square they shot and if it hit your ship (red square) or if it was a miss (white sqaure).

### To win
Whoever destroys all 5 of their opponents ships first wins the game.

## Hitting ships
A white square on any grid means that there is no ship there and a red sqaure means that a ship was hit there. The game will tell you or the enemy if either of you sunk a ship and which ship was sunk.

There are 5 ships that both the player and enemy have:

|Ship       |Spaces|
|-----------|---|
|Patrol Boat|(2)|
|Submarine  |(3)|
|Destroyer  |(3)|
|Battleship |(4)|
|Carrier    |(5)|

If you sink all of the enemy's ships first you win, otherwise the enemy wins if they sink your ships first.

# Code Description
## CPU
The CPU chooses where to shoot by the ```enemyturn``` method in ```enemyHandler.js```. 

There are 3 "modes" which the CPU switches between depending on if it has found ships or not.
|Mode        |Condition                                                         |Chosen square                                                               |Next mode if hit|Next mode if miss|
|------------|------------------------------------------------------------------|----------------------------------------------------------------------------|-----------|------------|
|Random mode |No hits on unsunk ships                                           |Chooses a random sqaure that has not been fired at before.                  |Destroy    |Random      |
|Destroy mode|Hit(s) on unsunk ship(s) but unknown ship direction               |Chooses a random sqaure around the hit(s) that has not been fired at before.|Line       |Destroy                                                                                         |
|Line mode   |Adjacent hits with empty sqaures in the same direction either side|Chooses a random square of the two sides that has not been fired at before. |Line       |If at least 1 empty sqaure on a side then line, otherwise no empty sqaures on either side is destroy*|

*No empty sqaures either side of a line can only occur if the player has ships side by side in parallel. The switch to destory mode will allow the CPU to not get stuck and hit those ships in the other axis.

This CPU method can be greatly improved upon as randomness is not the best way to find ships, it would be worth improving one day.

# Related
A good website I found showcasing different CPU methods in battleships, which inspired my CPU method:
http://www.datagenetics.com/blog/december32011/
