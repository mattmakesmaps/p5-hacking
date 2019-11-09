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
            this.x = x,
            this.y = y,
            this.position = null,
            this.velocity = 5,
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
        if (!this.position) {
            this.position = createVector(this.x, this.y);
        }

        if (this.hit) {
            this.position.add(this.velocity);
        }
    }
}

let balls = [];
let paddle;

function setup() {
    createCanvas(700, 600);
    let ballCount = 500;
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
            balls[i].hit = true;
            paddle.color = color('red');
        }
        balls[i].draw();
    }

    paddle.draw();

    fill(255);
    strokeWeight(0);
    text('Mouse Heading: ' + mouseVector.heading(), 100, 100);
    text('paddle.ends[0] x/y: ' + paddle.ends[0].x + ', ' + paddle.ends[0].y, 100, 120);
    text('paddle.ends[1] x/y: ' + paddle.ends[1].x + ', ' + paddle.ends[1].y, 100, 140);
    text('Frame Rate: ' + floor(frameRate()), 100, 160);
    // text('b1.position x/y: ' + b1.position.x + ', ' + b1.position.y, 100, 180);
}
