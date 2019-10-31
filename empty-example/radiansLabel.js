let config = {
    numCols: 20,
    numRows: 15,
    recWidth: 100,
    recHeight: 10,
    noiseSeed: 0.0
}

function setup() {
    createCanvas(700, 600);
}

function draw() {
    background(65);

    // The Center is now 0,0
    translate(width/2, height/2);
    let aX = (width / 2);
    let aY = (height / 2);

    // Create circle
    noFill();
    stroke(240,240,240);
    circle(0, 0, 200);
    rect(-90, -90, -70, -70);

    // rotate future elements on canvas (rectangle).
    let aAngle = atan2(mouseY - aY, mouseX - aX);

    config.noiseSeed = config.noiseSeed + 0.01;
    let noiseCalc = noise(config.noiseSeed);
    text(noiseCalc, -275, -275);

    // Map the noiseCalc value to a range
    // that is quarter pi above or below current aAngle
    // Then rotate by that.
    const jitterScale = QUARTER_PI;
    let jitter = map(noiseCalc, 0, 1, aAngle - jitterScale, aAngle + jitterScale);

    // rotation text
    text(aAngle, mouseX - (width/2), mouseY - (height/2));
    rotate(jitter);

    // draw rectangle
    fill(240,240,240);
    stroke(0,0,0);
    rect(
        (-config.recWidth / 2),
        (-config.recHeight / 2),
        config.recWidth,
        config.recHeight
    );
}