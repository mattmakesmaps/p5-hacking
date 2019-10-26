let config = {
    numCols: 20,
    numRows: 15,
    recWidth: 30,
    recHeight: 5
}

function setup() {
    createCanvas(700, 600);
}

function calcColor(val) {
    // REF: https://p5js.org/reference/#/p5/lerpColor
    let from = color(255, 105, 180);
    let to = color(0, 255, 255);
    colorMode(RGB); // Try changing to HSB.
    return lerpColor(from, to, val);
}

function drawRectangleRotation(x = 0, y = 0) {
    // REF: https://p5js.org/reference/#/p5/atan2
    let aX = (config.recWidth / 2) + x;
    let aY = (config.recWidth / 2) + y;
    let aAngle = atan2(mouseY - aY, mouseX - aX);
    translate(aX, aY);
    rotate(aAngle);
    fill(calcColor(aAngle));
    rect(
        (-config.recWidth / 2),
        (-config.recHeight / 2),
        config.recWidth,
        config.recHeight
    );
}

function draw() {
    background(204);

    for (let i = 0; i < config.numCols; i++) {
        for (let j = 0; j < config.numRows; j++) {
            push();
            let padding = config.recWidth + 10;
            drawRectangleRotation(padding * i, padding * j);
            pop();
        }
    }
}