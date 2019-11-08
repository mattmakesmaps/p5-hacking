/**
 * Rather then use a rectangle primitive, construct
 * two vectors to create a line.
 * 
 * A third vector is created representing the mouse
 * position, which is used to rotate the line.
 */
let ball = {
    hit: false,
    position: null,
    velocity: 5,
    speed: 3.5
}

function setup() {
    createCanvas(700, 600);
    ball.position = createVector(20, 20);
}

function linePoint(x1, y1, x2, y2, px, py) {

  // get distance from the point to the two ends of the line
  d1 = dist(px,py, x1,y1);
  d2 = dist(px,py, x2,y2);

  // get the length of the line
  lineLen = dist(x1,y1, x2,y2);

  // since floats are so minutely accurate, add
  // a little buffer zone that will give collision
  buffer = 0.1;    // higher # = less accurate

  // if the two distances are equal to the line's 
  // length, the point is on the line!
  // note we use the buffer here to give a range, 
  // rather than one #
  if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
    return true;
  }
  return false;
}

function draw() {
    background(65);
    stroke(255);
    fill(255);


    let lineLength = 100;
    translate(width/2,height/2);
    strokeWeight(10);
    point(ball.position.x, ball.position.y);

    // Create a 100 pixel line.
    let v1 = createVector(0 - (lineLength/2), 0);
    let v2 = createVector(0 + (lineLength/2), 0);

    // Create a vector representing the translated
    // mouse position.
    let mouseVector = createVector(
        mouseX - (width/2),
        mouseY - (height/2)
    );


    strokeWeight(0);
    text('Heading: ' + mouseVector.heading(), 100, 100);
    text('v1 x/y: ' + v1.x + ', ' + v1.y, 100, 120);
    text('v2 x/y: ' + v2.x + ', ' + v2.y, 100, 140);
    // text('pVect x/y: ' + pVect.x + ', ' + pVect.y, 100, 160);
    text('ball.position x/y: ' + ball.position.x + ', ' + ball.position.y, 100, 180);
    strokeWeight(3);

    // rather the rotating the canvas, we rotate the vectors.
    v1.rotate(mouseVector.heading());
    v2.rotate(mouseVector.heading());

    let hit = linePoint(v1.x,v1.y, v2.x, v2.y, ball.position.x,ball.position.y);
    if (hit) {
        ball.hit = true;
        // ball.position.x = ball.position.x + 1;
        // ball.position.y = ball.position.y + 0.5;
        stroke(255,150,0, 150);
    }
    else {
        stroke(0,150,255, 150);
    }

    if (ball.hit) {
        ball.position.add(ball.velocity);
    }
    
    // Draw the line now that we've rotated the canvas.
    let someLine = line(v1.x,v1.y,v2.x,v2.y);
}