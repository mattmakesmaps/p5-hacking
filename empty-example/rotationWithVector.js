/**
 * Rather then use a rectangle primitive, construct
 * two vectors to create a line.
 * 
 * A third vector is created representing the mouse
 * position, which is used to rotate the line.
 */

class Paddle {
    constructor(x, y, color, length = 100) {
        this.x = x,
            this.y = y,
            this.center = null,
            this.ends = [],
            this.color = color,
            this.length = length
    }

    setup() {
        this.center = createVector(this.x, this.y);
        this.ends.push(createVector(this.x - (this.length / 2), this.y));
        this.ends.push(createVector(this.x + (this.length / 2), this.y));
    }

    draw() {
        fill(this.color);
        stroke(this.color);
        strokeWeight(10);
        line(this.ends[0].x,
            this.ends[0].y,
            this.ends[1].x,
            this.ends[1].y);
    }

    updatePosition(mouseVector) {
        this.ends[0].rotate(mouseVector.heading());
        this.ends[1].rotate(mouseVector.heading());
    }

    intersectsPoints(px, py) {

        // get distance from the point to the two ends of the line
        let d1 = dist(px, py, this.ends[0].x, this.ends[0].y);
        let d2 = dist(px, py, this.ends[1].x, this.ends[1].y);

        // since floats are so minutely accurate, add
        // a little buffer zone that will give collision
        let buffer = 0.1;    // higher # = less accurate

        // if the two distances are equal to the line's 
        // length, the point is on the line!
        // note we use the buffer here to give a range, 
        // rather than one #
        if (d1 + d2 >= this.length - buffer && d1 + d2 <= this.length + buffer) {
            return true;
        }
        return false;
    }
}

class Ball {
    constructor(x, y, color) {
        this.hit = false,
            // this.acceleration = createVector(0,0),
            // Acceleration is random!
            this.acceleration = p5.Vector.random2D(),
            this.velocity = createVector(0, 0),
            this.position = createVector(x, y),
            this.speed = 3.5,
            this.color = color
    }

    draw() {
        fill(this.color);
        stroke(this.color);
        strokeWeight(10);
        point(this.position.x, this.position.y);
    }

    updatePosition() {
        if (this.hit) {
            // will this slow down accelleration?
            this.acceleration = this.acceleration.mult(0.75);
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
        }
    }
}

let balls = [];
let paddle;

function setup() {
    createCanvas(700, 600);
    let ballCount = 1000;
    for (let i = 0; i < ballCount; i++) {
        let x_cord = map(random(), 0, 1, -(width / 2), (width / 2));
        let y_cord = map(random(), 0, 1, -(height / 2), (height / 2));
        let ball_color = color(255, 150, 0);
        balls.push(new Ball(x_cord, y_cord, ball_color));
    }
}

function draw() {
    background(65);
    translate(width / 2, height / 2);

    // Create a vector representing the translated
    // mouse position.
    let mouseVector = createVector(
        mouseX - (width / 2),
        mouseY - (height / 2)
    );

    // The implementation should be updated to not require a new
    // Paddle each call to draw().
    paddle = new Paddle(0, 0, color('teal'), 500);
    paddle.setup();

    paddle.updatePosition(mouseVector);
    for (let i = 0; i < balls.length; i++) {
        balls[i].updatePosition();
    }

    for (let i = 0; i < balls.length; i++) {
        if (paddle.intersectsPoints(balls[i].position.x, balls[i].position.y)) {
            // note how we're toggling not just setting to true
            // just for fum.
            balls[i].hit = !balls[i].hit;
            paddle.color = color('red');
        }
        balls[i].draw();
    }

    paddle.draw();

    fill(255);
    stroke(0);
    strokeWeight(5);

    text('Mouse Heading: ' + mouseVector.heading(), 50, 100);
    text('paddle.ends[0] x/y: ' + floor(paddle.ends[0].x) + ', ' + floor(paddle.ends[0].y), 50, 120);
    text('paddle.ends[1] x/y: ' + floor(paddle.ends[1].x) + ', ' + floor(paddle.ends[1].y), 50, 140);
    text('Frame Rate: ' + floor(frameRate()), 50, 160);
}
