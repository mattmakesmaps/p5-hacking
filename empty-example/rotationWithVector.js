/**
 * Rather then use a rectangle primitive, construct
 * two vectors to create a line.
 * 
 * A third vector is created representing the mouse
 * position, which is used to rotate the line.
 */

class Ball {
    constructor(x, y, color) {
        this.hit = false,
        this.x = x,
        this.y = y,
        this.position = null,
        this.velocity= 5,
        this.speed= 3.5
        this.color = color;
    }

    draw() {
        fill(this.color);
        stroke(this.color);
        strokeWeight(10);
        point(this.position.x, this.position.y);
    }

    updatePosition() {
        if (!this.position) {
            this.position = createVector(this.x, this.y);
        }

        if (this.hit) {
            this.position.add(this.velocity);
        }
    }
}

let b1;

function setup() {
    createCanvas(700, 600);
    b1 = new Ball(25,25, color(255, 150, 0));
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

    let lineLength = 100;
    translate(width/2,height/2);
    b1.updatePosition();

    // Create a 100 pixel line.
    let v1 = createVector(0 - (lineLength/2), 0);
    let v2 = createVector(0 + (lineLength/2), 0);

    // Create a vector representing the translated
    // mouse position.
    let mouseVector = createVector(
        mouseX - (width/2),
        mouseY - (height/2)
    );


    fill(255);
    strokeWeight(0);
    text('Heading: ' + mouseVector.heading(), 100, 100);
    text('v1 x/y: ' + v1.x + ', ' + v1.y, 100, 120);
    text('v2 x/y: ' + v2.x + ', ' + v2.y, 100, 140);
    text('b1.position x/y: ' + b1.position.x + ', ' + b1.position.y, 100, 180);
    // text('pVect x/y: ' + pVect.x + ', ' + pVect.y, 100, 160);

    // rather the rotating the canvas, we rotate the vectors.
    v1.rotate(mouseVector.heading());
    v2.rotate(mouseVector.heading());

    let hit = linePoint(v1.x,v1.y, v2.x, v2.y, b1.position.x,b1.position.y);
    if (hit) {
        b1.hit = true;
        stroke(255,150,0, 150);
    }
    else {
        stroke(0,150,255, 150);
    }
    // Draw the line now that we've rotated the canvas.
    strokeWeight(3);
    let someLine = line(v1.x,v1.y,v2.x,v2.y);

    b1.draw();

    
}