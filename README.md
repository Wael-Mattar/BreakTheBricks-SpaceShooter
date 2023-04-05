# BreakTheBricks-SpaceShooter

This is an interactive game that utilizes JavaScript and HTML5 canvas. The objective of the game is to demolish bricks by propelling a ball with a paddle. The player has a total of three lives to complete the game. The primary class responsible for updating and displaying the game is the Game class, which also manages the score, lives, and sprites. The Sprite class serves as the foundation class for all game objects and supplies the necessary update() and draw() methods that are employed by the Game class. The Brick and Ball classes are child classes of Sprite and provide the functionality for the bricks and the ball. If the ball hits a brick, it shatters and vanishes from the canvas. There is a 20% chance of obtaining a powerup whenever a brick is destroyed. The Game class keeps track of all the sprites and manages collision detection. The game is restarted when all bricks are demolished or when the player exhausts their lives.


![Screenshot (20)](https://user-images.githubusercontent.com/113843312/229282813-16aa893b-50d0-4513-9eb8-fa2b4e3c5e08.png)
![Screenshot (22)](https://user-images.githubusercontent.com/113843312/229282869-b13d91f3-f756-436c-b7b3-3ce5b9966d95.png)
