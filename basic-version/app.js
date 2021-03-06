/* global $*/
// to do: (i) make site mobile ready, (ii) make star wars theme, (iii) swipe enabled, (iv) refactor, (v) fix self-collide.

var PIXEL_SIZE = 10
var BOARD_SIZE = 50
var gameOver
var intervalID
var length = 8
var head   // creating the variables in the global scope allows us to call it and its functions anwyhere in the code (e.g. I can now call head.addTail() in food.eatFood())

function SnakePiece ($container, tail) {
  this.x = 0
  this.y = 0
  this.vx = 1
  this.vy = 0
  this.tail = tail

// appending the snake onto the DOM
  this.$container = $container
  this.$snake = $("<div class = 'snake'></div>")
  this.$snake.appendTo($container)
}

SnakePiece.prototype = {
  draw: function (x, y) {
    // draw pixels on screen
    this.$snake.css({
      left: this.x * PIXEL_SIZE,
      top: this.y * PIXEL_SIZE
    })

    // draw the tail (if there is one))
    if (this.tail) {
      this.tail.draw(this.x, this.y)
    }

    // set new position
    this.x = x
    this.y = y
  },
  // update() updates the screen everytime it is called.
  update: function () {
    var x = this.x + this.vx
    var y = this.y + this.vy

    this.draw(x, y)
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
    } else if (this.selfCollided(head) === true) {
      gameOver = true
      return gameOver
    }
    return gameOver
  },

  selfCollided: function (head) {
    if (!head || !head.tail) return
    if (this.x === head.tail.x && this.y === head.tail.y) {
      return true
    } else {
      return this.selfCollided(head.tail)
    }
  },

  endGame: function () {
    if (gameOver === true) {
      clearInterval(intervalID)
      window.alert('game over! click on your fate below to restart')
    }
  }
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

var Food = function ($container) {
  this.x2 = getRandomInt(0, 49)
  this.y2 = getRandomInt(0, 49)

  this.$food = $("<div class = 'food'></div>")
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
      length++
    }
  }
}

// jQuery goes here:

$(function () {
  var $container = $('.container')

  // create the snake
  head = new SnakePiece($container)
  for (var i = 0; i < 8; i++) {
    head.addTail()
  }

  // update the snake (& the food, whenever it's eaten) at 50ms intervals
  intervalID = setInterval(function () {
    head.update()
    food.generateFood()
    food.eatFood(head.x, head.y)
    head.selfCollided(head)
    head.isGameOver()
    head.endGame()
    $('#score').html(length * 10)
  }, 40)

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
        else break
        /* falls through */
      case 38:    // up
        if (head.vy < 1) {
          head.setDirection(0, -1)
          break
        }
        else break
        /* falls through */
      case 39:    // right
        if (head.vx > -1) {
          head.setDirection(1, 0)
          break
        }
        else break
        /* falls through */
      case 40:    // down
        if (head.vy > -1) {
          head.setDirection(0, 1)
          break
        }
        else break
        /* falls through */
      default: return // exit this handler for other keys
    }
    event.preventDefault() // prevent the default action (scroll / move caret)
  })

// setting up swipe listeners
  $('.container').on('swipeleft', function (event) {
    if (head.vx < 1) head.setDirection(-1, 0)
  })
  $('.container').on('swiperight', function (event) {
    if (head.vx > -1) head.setDirection(1, 0)
  })
  $('.container').on('swipeup', function (event) {
    if (head.vy < 1) head.setDirection(0, -1)
  })

  $('.container').on('swipedown', function (event) {
    if (head.vy > -1) head.setDirection(0, 1)
  })
})
