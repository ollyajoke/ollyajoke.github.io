// var snake = [{ top: 0, left: 0}, {top: 1, left: 0}, {top: 1, left: 1}];
var snake = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: 'down'}]
var apple = [{ top: 5, left: 3}]


var drawableApple = { color: "green", pixels: apple };
// var drawableObjects = [];
var stationaryObjects = [drawableApple];
// 

var drawSnake = function(snakeToDraw, drawableApple) {
	var drawableSnake = { color: "yellow", pixels: snakeToDraw };
	var drawableObjects = [];
	drawableObjects.push(drawableSnake);
	// stationaryObjects.forEach(function(obj) {
	// 	drawableObjects.push(obj);
	// });
	drawableObjects.push(drawableApple);
	
    // console.log(drawableObjects.length, stationaryObjects.length);
    // console.log(drawableObjects.length, drawableObjects[0], drawableObjects[1]);
    // console.log(stationaryObjects.length, stationaryObjects[0]);
	CHUNK.draw(drawableObjects);
}

// 	drawSnake(snake);

var newSegmentDirection = function(oldSegment) {
	// if (oldSegment.direction === 'down') {
	// 	return { top: oldSegment.top + 1, left: oldSegment.left };
	// } else if (oldSegment.direction === 'right') {
	// 	return { top: oldSegment.top, left: oldSegment.left + 1 };
	// } else if (oldSegment.direction === 'up') {
	// 	return { top: oldSegment.top - 1, left: oldSegment.left };
	// } else if (oldSegment.direction === 'left') {
	// 	return { top: oldSegment.top, left: oldSegment.left - 1 };
	// }
	// return oldSegment;

	switch (oldSegment.direction) {
		case 'down':
			return { top: oldSegment.top + 1, left: oldSegment.left };
		case 'right':
			return { top: oldSegment.top, left: oldSegment.left + 1 };
		case 'up':
			return { top: oldSegment.top - 1, left: oldSegment.left };
		case 'left':
			return { top: oldSegment.top, left: oldSegment.left - 1 };
		default:
			return oldSegment;
	}
}

var getPreviousSegment = function(index, snake) {
	if (index > 0) {
		return snake[index-1];
	} else {
		return snake[index];
	}
}

var moveSnake = function(snake) {
  // var oldSegment = snake[0];
  // var newSegment = newSegmentDirection(oldSegment);
  // newSegment.direction = oldSegment.direction;
  // var newSnake = [newSegment];
  // return newSnake;

  // var newSnake = [];
  // snake.forEach(function(segment) {
  // //snake.map(function(segment) { // - same thing as forEach()
  // 	var newSegment = newSegmentDirection(segment);
  // 	newSegment.direction = segment.direction;
  // 	newSnake.push(newSegment);
  // });
  // return newSnake; 

   return snake.map(function(oldSegment, segmentIndex, snake) {
    var newSegment = newSegmentDirection(oldSegment);
    newSegment.direction = getPreviousSegment(segmentIndex, snake).direction;
    return newSegment;
  });
}

// var oneStep = function() {
// 	snake = moveSnake(snake);
// 	drawSnake(snake);
// }

var growSnake = function(snake) {
	var copySegment = snake[snake.length - 1];
	snake.push({top: copySegment.top, left: copySegment.left}); //, direction: copySegment.direction });
	return snake;
}

var ate = function(snake, otherThing) {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

var oneStep = function() {
  var newSnake = moveSnake(snake);
  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself!");
  }

  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! you hit a wall!");
  }

  if (ate(newSnake, apple)) {
    console.log("collision!");
    newSnake = growSnake(newSnake);
    //apple = CHUNK.randomLocation();
    apple = [CHUNK.randomLocation()];
    drawableApple = { color: "green", pixels: apple };
  }
  // console.log(snake[0].top, snake[0].left, apple[0].top, apple[0].left);
  snake = newSnake;
  drawSnake(snake, drawableApple);
}

var changeDirection = function(direction) {
	snake[0].direction = direction;
}

// oneStep();
// oneStep();
// oneStep();
// oneStep();

// console.log(CHUNK.gameBoundaries());
CHUNK.executeNTimesPerSecond(oneStep, 2);
CHUNK.onArrowKey(changeDirection);
