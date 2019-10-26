let config = {
    numCols: 8,
    numRows: 6 
}

/** MAIN METHODS **/
function setup() {
  createCanvas(700, 600);
}

function drawRectangleRotation(x = 0,y = 0) {
    let recWidth = 60;
    let recHeight = 10;
    let aX = (recWidth / 2) + x;
    let aY = (recWidth / 2) + y;
    let aAngle = atan2(mouseY - aY, mouseX - aX);
    translate(aX, aY);
    rotate(aAngle);
    rect((-recWidth / 2), (-recHeight / 2), recWidth, recHeight);
}

function draw() {
    background(204);

    for (let i = 0; i < config.numCols; i++){
        for (let j = 0; j < config.numRows; j++) {
            push();
            drawRectangleRotation(70 * i, 70 * j);
            pop();
        }
    }
}