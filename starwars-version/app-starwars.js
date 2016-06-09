/* global $*/

var PIXEL_SIZE = 10
var BOARD_SIZE = 50
var gameOver
var length = 8
var intervalID
var head   // creating the variables in the global scope allows us to call it and its functions anwyhere in the code (e.g. I can now call head.addTail() in food.eatFood())

// defining a constructor function (SnakePiece) for creating snake pieces (each square is an object)
function SnakePiece ($container, tail) {
  this.x = 0
  this.y = 0
  this.vx = 1
  this.vy = 0
  this.tail = tail

// appending the snake onto the DOM
  this.$container = $container

  this.$snake = $('<div class = "snake"></div>')
  this.$snake.appendTo($container)
}

// adding functions to the SnakePiece prototype (move, update, setDirection, addTail, isGameOver, endGame)
SnakePiece.prototype = {
  // "drawing" the snake pieces by multiplying a single coordinate by PIXEL_SIZE (10px)
  move: function (x, y) {
    this.$snake.css({
      left: this.x * PIXEL_SIZE,
      top: this.y * PIXEL_SIZE
    })

    // move the tail to where the current piece is
    if (this.tail) {
      this.tail.move(this.x, this.y)
    }

    // set new position of the first piece
    this.x = x
    this.y = y
  },

  // update() updates the screen everytime it is called.
  update: function () {
    var x = this.x + this.vx
    var y = this.y + this.vy

    this.move(x, y)
  },

  // a function to set direction of the snake
  setDirection: function (vx, vy) {
    this.vx = vx
    this.vy = vy
  },

  // a function to add a new piece to the tail of the snake
  addTail: function () {
    var oldTail = this.tail
    this.tail = new SnakePiece(this.$container, oldTail)
  },

  // setting the conditions for ending the gameOver
  isGameOver: function () {
    gameOver = false
    if (this.x >= BOARD_SIZE || this.y >= BOARD_SIZE || this.x < 0 || this.y < 0) {
      gameOver = true
      return gameOver
    } else if (this.x === head.tail.x && this.y === head.tail.y) {
      gameOver = true
      return gameOver
    } else if (length > 19) {
      $('.container').addClass('winning-background')
    }
    return gameOver
  },

  // end the game
  endGame: function () {
    if (gameOver === true) {
      clearInterval(intervalID)
      window.alert('game over!')
      // document.location.reload() // auto reload page to encourage addictive behavior
    }
  }
}

// generate random integers (used to set coordinates of food pieces)
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// defining a Food constructor function (similar to the SnakePiece constructor) to create food objects
function Food ($container) {
  this.x2 = getRandomInt(0, 47)
  this.y2 = getRandomInt(0, 47)

  this.$food = $("<div class = 'food one'></div>")
  this.$food.appendTo($container)

// this draws the food into existence, using the random x and y values of the food object. we can replace the pixels with something else (e.g. star wars icons).
  this.generateFood = function () {
    this.$food.css({
      left: this.x2 * PIXEL_SIZE,
      top: this.y2 * PIXEL_SIZE
    })
  }

// a function to change icons as snake length increases
  this.changeIcon = function () {
    if (length > 10) this.$food.addClass('two').removeClass('one')
    if (length > 12) this.$food.addClass('three').removeClass('two')
    if (length > 14) this.$food.addClass('four').removeClass('three')
    if (length > 16) this.$food.addClass('five').removeClass('four')
    if (length > 18) this.$food.addClass('six').removeClass('five')
  }

  this.eatFood = function (headx, heady) {
    if ((this.x2 === headx && this.y2 === heady) || ((this.x2 + 1) === headx && (this.y2 + 1) === heady) || ((this.x2 + 2) === headx && (this.y2 + 2) === heady)) {
      console.log('Nom!')
      this.x2 = getRandomInt(0, 47)
      this.y2 = getRandomInt(0, 47)
      head.addTail()
      length++
      console.log(length)
    }
  }
}

// jQuery goes here:

$(function () {
  var $container = $('.container')
  // adding a start button
  // $(".start").click(function() {
  //   $container.toggle()
  // })

  // create the snake
  head = new SnakePiece($container)
  for (var i = 0; i < 8; i++) {
    head.addTail()
  }

  // initialise food
  var food = new Food($container)

  // update the snake (& the food, whenever it's eaten)
  intervalID = setInterval(function () {
    head.update()
    food.generateFood()
    food.eatFood(head.x, head.y)
    food.changeIcon()
    head.isGameOver()
    head.endGame()
  }, 40)

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

// to do: (i) make site mobile ready, (ii) improve swipe sensitivity, (iii) refactor.
