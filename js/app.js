let keysDown = {};

addEventListener(
  "keydown",
  function (e) {
    keysDown[e.keyCode] = true;
  },
  false
);

addEventListener(
  "keyup",
  function (e) {
    delete keysDown[e.keyCode];
  },
  false
);
// Main
class Game {
  constructor() {
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.sprites = [];
  }

  update() {
    let bricks = 0;
    for (let i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i] instanceof Bullet) console.log("bullet found");
      this.sprites[i].update(this.sprites);
      if (this.sprites[i] instanceof Brick && !this.sprites[i].brickAlive) {
        bricks++;
      }
    }
    if (bricks == 0) {
      this.reset();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.sprites.length; i++) {
      this.sprites[i].draw(this.ctx);
    }

    this.ctx.fillStyle = "orange";
    this.ctx.fillText("Score: " + ball.score, 10, 20);
    this.ctx.fillText("Lives: " + ball.lives, this.canvas.width - 85, 20);
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "white";
  }

  addSprite(pSprite) {
    this.sprites.push(pSprite);
  }

  removeSprites(pSprite) {
    var index = this.sprites.indexOf(pSprite);
    if (index > -1) {
      this.sprites.splice(index, 1);
    }
  }

  loseLives() {
    var ball = this.sprites[1];
    ball.lives -= 1;

    if (ball.lives === 0) {
      // ball.loseSound.load();
      // ball.loseSound.play();
      this.reset();
    } else {
      var paddle = this.sprites[0];
      paddle.x = this.canvas.width / 2 - 40;
      ball.centerX = this.canvas.width / 2;
      ball.centerY = this.canvas.height - 30;
      ball.dxspeed = ball.speed;
      paddle.shoot = false;
      ball.dyspeed = -ball.speed;
    }

    var toDeleteArray = [];
    for (let i = 0; i < this.sprites.length; i++) {
      if (
        this.sprites[i] instanceof Bullet ||
        this.sprites[i] instanceof Powerup
      )
        toDeleteArray.push(this.sprites[i]);
    }
    for (let i = 0; i < toDeleteArray.length; i++) {
      let index = this.sprites.indexOf(toDeleteArray[i]);
      this.sprites.splice(index, 1);
    }
  }

  reset() {
    var ball = this.sprites[1];
    var paddle = this.sprites[0];
    paddle.shoot = false;
    this.sprites = [];
    ball.pause = true;
    if (13 in keysDown) {
      ball.pause = false;
    }

    ball.score = 0;
    ball.lives = 3;
    this.addSprite(paddle);
    this.addSprite(ball);
    paddle.x = this.canvas.width / 2;

    ball.centerX = this.canvas.width / 2;
    ball.centerY = this.canvas.height - 30;
    ball.dxspeed = ball.speed;
    ball.dyspeed = -ball.speed;
    generateBricks();
  }
}

// Sprite class
class Sprite {
  constructor() {}

  update() {}

  draw(ctx) {}
}

// Brick class
class Brick extends Sprite {
  constructor(x, y, width, height, color) {
    super();
    this.centerX = x;
    this.centerY = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.brickAlive = false;
  }

  update() {}

  draw(ctx) {
    if (!this.brickAlive) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.centerX, this.centerY, this.width, this.height);
    }
  }

  hitBrick() {
    myGame.removeSprites(this);

    var powerUpprobability = 0.2;
    var powerupSize = 8;
    var powerupColor = "red";
    var powerupSpeed = 1;

    if (Math.random() < powerUpprobability) {
      var powerup = new Powerup(
        this.centerX + this.width / 2,
        this.centerY + this.height / 2,
        powerupSize,
        powerupColor,
        powerupSpeed
      );
      myGame.addSprite(powerup);
    }
  }
}

// Ball class
class Ball extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    this.centerX = x;
    this.centerY = y;
    this.radius = radius;
    this.color = color;
    this.speed = speed;
    this.dxspeed = speed;
    this.dyspeed = -speed;
    this.pause = true;
    this.score = 0;
    this.lives = 3;
    // this.loseSound = new Audio("assets/losegame.mp3");
    // this.hit = new Audio("assets/hit.wav");
    // this.wonSound = new Audio("assets/wongame.mp3");
  }

  update(sprites) {
    if (13 in keysDown) {
      this.pause = false;
    }

    if (!this.pause) {
      this.centerX += this.dxspeed;
      this.centerY += this.dyspeed;
      //sprites[0].x = this.centerX - sprites[0].width / 2;
    }
    //left and right borders collision
    if (
      this.centerX - this.radius <= 0 ||
      this.centerX + this.radius >= myGame.canvas.width
    ) {
      this.dxspeed = -this.dxspeed;
    }
    //top border collision
    if (this.centerY - this.radius < 0) {
      this.dyspeed = 3;
    }
    // if the ball passes the canvas from the bottom
    if (this.centerY + this.radius > myGame.canvas.height) {
      myGame.loseLives();
    }

    // collision with paddle
    var paddle = sprites[0];
    var hitsPaddleTop = this.centerY + this.radius > paddle.y;
    var hitsPaddleSides =
      this.centerX > paddle.x && this.centerX < paddle.x + paddle.width;

    if (hitsPaddleTop && hitsPaddleSides) {
      if (this.dyspeed > 0) {
        this.dyspeed = -this.dyspeed;
      }
    }

    // collision with bricks
    for (let i = 2; i < sprites.length; i++) {
      var sprite = sprites[i];
      if (!(sprite instanceof Brick)) continue;

      var brick = sprite;
      var hitsBrickTop =
        this.centerY - this.radius < brick.centerY + brick.height;
      var hitsBrickSides =
        this.centerX > brick.centerX &&
        this.centerX < brick.centerX + brick.width;

      if (!brick.brickAlive && hitsBrickTop && hitsBrickSides) {
        brick.hitBrick();
        this.dyspeed = -this.dyspeed;
        this.score++;
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// Paddle class
class Paddle extends Sprite {
  constructor(x, y, width, height, color, speed) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = speed;
    this.lastBullet = Date.now();
    this.shoot = false;
  }

  update(sprites) {
    if (keysDown[39]) {
      //right arrow
      this.x += this.speed;
      if (this.x + this.width > myGame.canvas.width) {
        this.x = myGame.canvas.width - this.width;
      }
    }
    if (keysDown[37]) {
      //left arrow
      this.x -= this.speed;
    }
    this.x = Math.max(this.x, 4);

    for (var i = 0; i < sprites.length; i++) {
      var sprite = sprites[i];
      if (sprite instanceof Powerup) {
        if (
          sprite.centerY + sprite.radius > this.y &&
          sprite.centerX > this.x &&
          sprite.centerX < this.x + this.width
        ) {
          myGame.removeSprites(sprite);
          this.shoot = true;
        }
      }
    }

    if (32 in keysDown && this.shoot == true && Date.now() - this.lastBullet >= 170) {
      this.lastBullet = Date.now();
      myGame.addSprite(new Bullet(this.x, this.y));
      myGame.addSprite(new Bullet(this.x + this.width, this.y));
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Powerup extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    this.centerX = x;
    this.centerY = y;
    this.radius = radius;
    this.color = color;
    this.speed = speed;
    this.dyspeed = speed;
  }

  update() {
    this.centerY += this.dyspeed;
    if (this.centerY - this.radius > myGame.canvas.height) {
      myGame.removeSprites(this);
      return;
    }
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class Bullet extends Sprite {
  constructor(x, y) {
    super();
    this.centerX = x;
    this.centerY = y;
    this.width = 5;
    this.height = 15;
    this.speed = 4;
  }

  update(sprites) {
    this.centerY -= this.speed;

    let bulletHitBrick = false;

    for (let i = 2; i < sprites.length; i++) {
      var sprite = sprites[i];
      if (!(sprite instanceof Brick)) continue;

      var brick = sprite;
      var hitsBrickTop = this.centerY < brick.centerY + brick.height;
      var hitsBrickSides =
        this.centerX > brick.centerX &&
        this.centerX < brick.centerX + brick.width;

      if (
        !brick.brickAlive &&
        hitsBrickTop &&
        hitsBrickSides &&
        !bulletHitBrick
      ) {
        myGame.removeSprites(this);
        brick.hitBrick();
        myGame.score++;
        bulletHitBrick = true;
        myGame.removeSprites(this);
      }
    }

    if (bulletHitBrick || this.centerY < 0) {
      myGame.removeSprites(this);
      bulletHitBrick = false;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.fillRect(this.centerX, this.centerY, this.width, this.height);
    ctx.fill();
  }
}

//game
var myGame = new Game();

var paddle = new Paddle(
  myGame.canvas.width / 2 - 50,
  myGame.canvas.height - 20,
  100,
  10,
  "white",
  7
);

var ball = new Ball(
  myGame.canvas.width / 2,
  myGame.canvas.height - 30,
  8,
  "white",
  4
);

myGame.addSprite(paddle);
myGame.addSprite(ball);

// initialize the bricks
var numRows = 9;
var numCols = 10;
var brickWidth = 60;
var brickHeight = 20;
var brickPadding = 10;
var offsetTop = 30;
var offsetLeft = 20;

function generateBricks() {
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      var x = col * (brickWidth + brickPadding) + offsetLeft;
      var y = row * (brickHeight + brickPadding) + offsetTop;
      var color = "orange";
      var brick = new Brick(x, y, brickWidth, brickHeight, color);
      myGame.addSprite(brick);
    }
  }
}

generateBricks();
function gameEngineLoop() {
  myGame.draw();
  myGame.update();

  requestAnimationFrame(gameEngineLoop);
}
gameEngineLoop();

var requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
