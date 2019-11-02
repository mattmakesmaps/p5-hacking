let config = {
    recWidth: 30,
    recHeight: 5,
    noiseSeed: 0.0,
    padding: 10
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // stroke(255,255,255);
    noStroke();
}

function calcColor(val) {
    // REF: https://p5js.org/reference/#/p5/lerpColor
    let from = color(29, 161, 255);
    let to = color(255, 123, 29);
    colorMode(RGB); // Try changing to HSB.
    return lerpColor(from, to, val);
}

function drawRectangleRotation(x = 0, y = 0) {
    // REF: https://p5js.org/reference/#/p5/atan2
    let aX = (config.recWidth / 2) + x;
    let aY = (config.recWidth / 2) + y;
    let aAngle = atan2(mouseY - aY, mouseX - aX);

    config.noiseSeed = config.noiseSeed + 0.0002;
    let noiseCalc = noise(config.noiseSeed);

    // Map the noiseCalc value to a range
    // that is quarter pi above or below current aAngle
    // Then rotate by that.
    const jitterScale = QUARTER_PI;
    let jitter = map(noiseCalc, 0, 1, aAngle - jitterScale, aAngle + jitterScale);

    // REF: https://stats.stackexchange.com/questions/70801/how-to-normalize-data-to-0-1-range
    // The range for atan2() is -PI to PI;
    // let normalizedAngle = (aAngle - -PI) / TWO_PI;
    // `map()` is analagous to above
    let normalizedAngle = map(aAngle, -PI, PI, 0, 1);
    let noiseyNormalizedAngle = noiseCalc * normalizedAngle;

    translate(aX, aY);
    rotate(jitter);
    fill(calcColor(normalizedAngle));
    rect(
        (-config.recWidth / 2),
        (-config.recHeight / 2),
        config.recWidth,
        config.recHeight
    );
}

function draw() {
    background(65);
    let spacing = config.recWidth + config.padding;
    let numCols = windowWidth / spacing;
    let numRows = windowHeight / spacing;

    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            push();
            drawRectangleRotation(spacing * i, spacing * j);
            pop();
        }
    }
}

// magically called when a window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
