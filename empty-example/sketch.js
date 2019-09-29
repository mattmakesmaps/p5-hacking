let config = {
  frameRate: 5,
  cells_per_row: 250,
  y_axis_enum: 1,
  x_axis_enum: 2
}

function bootstrapDrawing() {
  background(175,175,175);

  // From: https://p5js.org/examples/color-linear-gradient.html
  b1 = color(204, 102, 0);
  b2 = color(0, 102, 153);

  setGradient(0,0,width,height,b1,b2, config.x_axis_enum);

  // Remaining color to be used for squares
  fill(0,0,0);
  noStroke();
}

// calculate state of new generation based on
// previous generation neighbors.
function rules(left, middle, right) {
  let ruleset = [0,1,0,1,1,0,1,0];

  if (left == 1 && middle == 1 && right == 1) {
    return ruleset[0];
  } else if (left == 1 && middle == 1 && right == 0) {
    return ruleset[1];
  } else if (left == 1 && middle == 0 && right == 1) {
    return ruleset[2];
  } else if (left == 1 && middle == 0 && right == 0) {
    return ruleset[3];
  } else if (left == 0 && middle == 1 && right == 1) {
    return ruleset[4];
  } else if (left == 0 && middle == 1 && right == 0) {
    return ruleset[5];
  } else if (left == 0 && middle == 0 && right == 1) {
    return ruleset[6];
  } else if (left == 0 && middle == 0 && right == 0) {
    return ruleset[7];
  } else {
    return 0;
  }
}

function calculateCurrentGeneration(previousGeneration) {
  let current_generation = Array(previousGeneration.length).fill(0);
  // ommitting edges of row from calculation
  for (let i = 1; i < current_generation.length - 1; i++) {
    let new_state = rules(previousGeneration[i-1], previousGeneration[i], previousGeneration[i+1]);
    current_generation[i] = new_state;
  }
  return current_generation;

}

// From: https://p5js.org/examples/color-linear-gradient.html
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === config.y_axis_enum) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === config.x_axis_enum) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

/** MAIN METHODS **/
function setup() {
  createCanvas(1000, 1000);
  // noLoop(); 
  frameRate(config.frameRate);
}

let history = [];

function draw() {
  bootstrapDrawing();

  const CELLS_PER_ROW = config.cells_per_row;
  const CELL_WIDTH = (width / CELLS_PER_ROW);
  const CELL_HEIGHT =  (height / CELLS_PER_ROW);
  const NUM_ROWS = (height / CELL_HEIGHT);

  if (history.length == 0) {
    let first_generation = Array(CELLS_PER_ROW).fill(0);
    first_generation[int(CELLS_PER_ROW / 2)] = 1;
    history.push(first_generation);
  }

  for (let i = 0; i < NUM_ROWS; i++) {
    let current_generation = calculateCurrentGeneration(history[history.length - 1]);
    history.push(current_generation);

    current_generation.forEach(function (element, index_of_row) {
      if (element === 1) {
        rect(index_of_row * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
      }
    });
  }

}