/* global $*/
var PIXEL_SIZE = 10
var BOARD_SIZE = 50
var gameOver

function SnakePiece ($container, tail) {
  this.x = 0
  this.y = 0
  this.vx = 1
  this.vy = 0
  this.tail = tail

  this.$container = $container

// appending the snake onto the DOM
  this.$snake = $("<div class = 'snake'></div>")
  this.$snake.appendTo($container)
}

SnakePiece.prototype = {
  move: function (x, y) {
    // move pixels on screen
    this.$snake.css({
      left: this.x * PIXEL_SIZE,
      top: this.y * PIXEL_SIZE
    })

    // move the tail to where this piece was
    if (this.tail) {
      this.tail.move(this.x, this.y)
    }

    // set new position
    this.x = x
    this.y = y
  },
  // update() updates the screen everytime it is called.
  update: function () {
    var x = this.x + this.vx
    var y = this.y + this.vy

    this.move(x, y)
  },

  setDirection: function (vx, vy) {
    this.vx = vx
    this.vy = vy
  },

  addTail: function () {
    var oldTail = this.tail
    this.tail = new SnakePiece(this.$container, oldTail)
  },

  isGameOver: function () {
    gameOver = false
    if (this.x >= BOARD_SIZE || this.y >= BOARD_SIZE || this.x < 0 || this.y < 0) {
      gameOver = true
      return gameOver
    }
    else if (this.x === head.tail.x && this.y === head.tail.y) {
      gameOver = true
      return gameOver
    }
    return gameOver
  },

  endGame: function () {
    if (gameOver == true) {
      clearInterval(intervalID)
      prompt("game over!")
    }
  }
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

var Food = function ($container) {
  this.x2 = getRandomInt(0, 49)
  this.y2 = getRandomInt(0, 49)

  this.$food = $("<div class = 'snake'></div>")
  this.$food.appendTo($container)

// this draws the food into existence, using the random x and y values of the food object. we can replace the pixels with something else (e.g. star wars icons)
  this.generateFood = function () {
    this.$food.css({
      left: this.x2 * PIXEL_SIZE,
      top: this.y2 * PIXEL_SIZE
    })
  }

  this.eatFood = function (headx, heady) {
    if (this.x2 === headx && this.y2 === heady) {
      console.log('Nom!')
      this.x2 = getRandomInt(0, 49)
      this.y2 = getRandomInt(0, 49)
      head.addTail()
    }
  }
}

var intervalID
var head   // creating the variables in the global scope allows us to call it and its functions anwyhere in the code (e.g. I can now call head.addTail() in food.eatFood())

// jQuery goes here:

$(function () {
  var $container = $('.container')

  // create the snake
  head = new SnakePiece($container)
  for (var i = 0; i < 8; i++) {
    head.addTail()
  }

  // update the snake (& the food, whenever it's eaten)
  intervalID = setInterval(function () {
    head.update()
    food.generateFood()
    food.eatFood(head.x, head.y)
    head.isGameOver()
    head.endGame()
    console.log(head.tail)
  }, 50)

  // initialise food
  var food = new Food($container)

  // listen for directional keypresses. the if statements prevent the snake from reversing onto itself
  $(document).keydown(function (event) {
    switch (event.which) {
        case 37:   // left
        if (head.vx < 1) {
          head.setDirection(-1, 0)
          break
        }
        else {
          break
        }
        case 38:    // up
        if (head.vy < 1) {
          head.setDirection(0, -1)
          break
        }
        else {
          break
        }
        case 39:    // right
        if (head.vx > -1) {
          head.setDirection(1, 0)
          break
        }
        else {
          break
        }
        case 40:    // down
        if (head.vy > -1) {
          head.setDirection(0, 1)
          break
        }
        else {
          break
        }
        default: return // exit this handler for other keys
    }
    event.preventDefault() // prevent the default action (scroll / move caret)
  })
})
