var PIXEL_SIZE = 10
var BOARD_SIZE = 50

function SnakePiece($container, tail) {
  this.x = 0
  this.y = 0
  this.vx = 1
  this.vy = 0
  this.tail = tail

  this.$container = $container

  this.$snake = $("<div class = 'snake'></div>")
  this.$snake.appendTo($container)
  }

SnakePiece.prototype = {
    move: function(x, y) {
      //move pixels on screen
      this.$snake.css({
        left: this.x * PIXEL_SIZE,
        top: this.y * PIXEL_SIZE,
      })

      // move the tail to where this piece was
      if (this.tail) {
        this.tail.move(this.x, this.y)
      }

      //set new position
      this.x = x
      this.y = y
    },

  update: function() {
      var x = this.x + this.vx
      var y = this.y + this.vy


      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x >= BOARD_SIZE) x = BOARD_SIZE - 1
      if (y >= BOARD_SIZE) y = BOARD_SIZE - 1

      this.move(x, y)
    },

    setDirection: function(vx, vy) {
      this.vx = vx
      this.vy = vy
    },

    lengthen: function() {
      var oldTail = this.tail
      this.tail = new SnakePiece(this.$container, oldTail)
    },
  }

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFood(foodX, foodY) {
  foodX = getRandomInt(0, 49)
  foodX = getRandomInt(0, 49)

  move(foodX, foodY)
}

console.log(getRandomInt(0,49))


// jQuery goes here:

$(function() {

  var $container = $(".container")

  // create the snake
  var head = new SnakePiece($container)
  for (i = 0; i < 20; i++) {
    head.lengthen()
  }

  // update the snake
  setInterval(function() {
    head.update()
  }, 50)

  // listen for keypresses
   $(document).keydown(function(event) {
      switch(event.which) {
          case 37: head.setDirection(-1, 0); break // left
          case 38: head.setDirection(0, -1); break // up
          case 39: head.setDirection(1, 0); break // right
          case 40: head.setDirection(0, 1); break // down
          default: return // exit this handler for other keys
      }
      event.preventDefault() // prevent the default action (scroll / move caret)
    })
})


// function eatFood() {

// }

// function generateFood() {

// }
