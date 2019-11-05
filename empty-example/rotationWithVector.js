/**
 * Rather then use a rectangle primitive, construct
 * two vectors to create a line.
 * 
 * A third vector is created representing the mouse
 * position, which is used to rotate the line.
 */

function setup() {
    createCanvas(700, 600);
}

function draw() {
    background(65);
    stroke(0);
    strokeWeight(3);
    fill(0);

    rect(100,100,10,10);

    let lineLength = 100;
    translate(width/2,height/2);

    // Create a 100 pixel line.
    let v1 = createVector(0 - (lineLength/2), 0);
    let v2 = createVector(0 + (lineLength/2), 0);

    // Create a vector representing the translated
    // mouse position.
    let mouseVector = createVector(
        mouseX - (width/2),
        mouseY - (height/2)
    );

    // Rotate based on mouse heading.
    rotate(mouseVector.heading());
    
    // Draw the line now that we've rotated the canvas.
    let someLine = line(v1.x,v1.y,v2.x,v2.y);
}