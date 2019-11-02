let config = {
    noiseSeed: 0.0,
    padding: 10
}

/**
 * I have to add these `const` values because I can't access
 * the p5.js `const` at this point in the program execution.
 */
const QUARTER_PI = 0.78539816339;
const TWO_PI = 6.28318530718;

/**
 * TODO: What scoping rules require that we need to use `var`
 * versus `const` or `let`?
 */
var jitterScale = QUARTER_PI;
var jitterScaleMin = -TWO_PI;
var jitterScaleMax = TWO_PI;
var jitterScaleStep = 0.1;

var recHeight = 5;
var recHeightStep = 1;
var recWidth = 30;
var recWidthStep = 2;

var seedColorFrom = [29, 161, 255];
var seedColorTo = [255, 123, 29];

function setup() {
    gui = createGui('jitter');
    gui.addGlobals('jitterScale', 'recWidth', 'recHeight', 'seedColorFrom', 'seedColorTo');
    createCanvas(windowWidth, windowHeight);
    // stroke(255,255,255);
    noStroke();
}

function calcColor(val) {
    // REF: https://p5js.org/reference/#/p5/lerpColor
    let colorFrom = color(seedColorFrom);
    let colorTo = color(seedColorTo);
    return lerpColor(colorFrom, colorTo, val);
}

function drawRectangleRotation(x = 0, y = 0) {
    // REF: https://p5js.org/reference/#/p5/atan2
    let aX = (recWidth / 2) + x;
    let aY = (recWidth / 2) + y;
    let aAngle = atan2(mouseY - aY, mouseX - aX);

    config.noiseSeed = config.noiseSeed + 0.0002;
    let noiseCalc = noise(config.noiseSeed);

    // Map the noiseCalc value to a range
    // that is quarter pi above or below current aAngle
    // Then rotate by that.
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
        (-recWidth / 2),
        (-recHeight / 2),
        recWidth,
        recHeight
    );
}

function draw() {
    background(65);
    let spacing = recWidth + config.padding;
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
