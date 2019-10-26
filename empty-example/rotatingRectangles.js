let config = {
  frameRate: 5,
  cells_per_row: 250,
  y_axis_enum: 1,
  x_axis_enum: 2
}

/** MAIN METHODS **/
function setup() {
  createCanvas(500, 500);
}

function draw() {
    background(204);

    push();
        let aX = (width / 2) - 200;
        let aY = (height /2);
        let aAngle = atan2(mouseY - aY, mouseX - aX);
        translate(aX, aY);
        rotate(aAngle);
        rect(-30, -5, 60, 10);
    pop();

    push();
        let bX = (width / 2) + 200;
        let bY = (height /2);
        let bAngle = atan2(mouseY - bY, mouseX - bX);
        translate(bX, bY);
        rotate(bAngle);
        rect(-30, -5, 60, 10);
    pop();
}