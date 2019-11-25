/**
 * Working on examples from Chapter 2 of Nature of Code
 * https://natureofcode.com/book/chapter-2-forces/
 */

class Paddle {
    constructor(x, y, color, length = 100) {
            this.center = createVector(x, y);
            this.ends = [],
            this.color = color,
            this.length = length

        this.ends.push(new Ball(this.center.x - (this.length / 2), this.center.y, color, 2));
        this.ends.push(new Ball(this.center.x + (this.length / 2), this.center.y), color, 8);
        this.ends[0].hit = true;
        this.ends[1].hit = true;
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
        this.ends[0]._accelerationToMouse();
        this.ends[0].applyForce(mouseVector);
        this.ends[0].updatePosition();
        this.ends[1]._accelerationToMouse();
        this.ends[1].applyForce(mouseVector);
        this.ends[1].updatePosition();

        this.length = dist(this.ends[0].x, this.ends[0].y, this.ends[1].x, this.ends[1].y);
        this.center.x = (this.ends[0].x + this.ends[1].x) / 2;
        this.center.y = (this.ends[0].y + this.ends[1].y) / 2;
    }

    // REF: http://www.jeffreythompson.org/collision-detection/line-point.php
    intersectsPoints(px, py) {

        // get distance from the point to the two ends of the line
        let d1 = dist(px, py, this.ends[0].x, this.ends[0].y);
        let d2 = dist(px, py, this.ends[1].x, this.ends[1].y);

        // since floats are so minutely accurate, add
        // a little buffer zone that will give collision
        let buffer = 0.5;    // higher # = less accurate

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

// REF: https://natureofcode.com/book/chapter-1-vectors/
class Ball {
    constructor(x, y, color, mass = 1) {
        this.hit = false,
            this.acceleration = createVector(0, 0),
            this.velocity = createVector(0, 0),
            this.position = createVector(x, y),
            this.color = color,
            this.topSpeed = 15,
            this.mass = mass;
    }

    // Allows Ball's position to be called like a vector.
    // e.g. ball.x
    get x() {
        return this.position.x;
    }

    set x(newX) {
        this.position.x = newX;
    }

    get y() {
        return this.position.y;
    }

    set y(newY) {
        this.position.y = newY;
    }

    applyForce(force) {
        // Only apply force if ball is hit
        if (this.hit) {
            this.acceleration.add(
                p5.Vector.div(force,this.mass)
                );
        }
    }

    checkEdges() {
        if (this.position.x > windowWidth) {
            this.position.x = windowWidth;
            this.velocity.x *= -1;
        } else if (this.position.x < 0) {
            this.velocity.x *= -1;
            this.position.x = 0;
        }

        if (this.position.y > windowHeight) {
            this.velocity.y *= -1;
            this.position.y = windowHeight;
        } else if (this.position.y < 0) {
            this.velocity.y *= -1;
            this.position.y = 0;
        }
    }

    draw() {
        fill(this.color);
        strokeWeight(0);
        ellipse(this.position.x, this.position.y,
            this.mass*5, this.mass*5);
    }

    _accelerationToMouse() {
        /**
         * To set acceleration to follow the direction
         * of the mouse, we set acceleration to a vector
         * Acceleration = Mouse Position - Ball Position
         * The result vector is then normalized to between 0,1
         * and scaled.
         */
        let mousePos = createVector(mouseX, mouseY);
        let vecToMousePos = mousePos.sub(this.position);
        vecToMousePos = vecToMousePos.normalize();
        vecToMousePos.mult(0.1);
        this.applyForce(vecToMousePos);
    }

    updatePosition() {
        if (this.hit) {
            this.velocity.add(this.acceleration);
            this.velocity.limit(this.topSpeed);
            this.position.add(this.velocity);
            // Clear Acceleration Each Iteration
            this.acceleration.mult(0);
        }
        this.checkEdges();
    }
}

let balls = [];
let paddle;

function setup() {
    createCanvas(windowWidth, windowHeight);
    let ballCount = 200;
    for (let i = 0; i < ballCount; i++) {
        let x_cord = map(random(), 0, 1, 0, width);
        let y_cord = map(random(), 0, 1, 0, height);
        let ball_color = color(229,0,106);
        let ball_mass = Math.floor(Math.random() * 10);
        balls.push(new Ball(x_cord, y_cord,
            ball_color, ball_mass));
    }

    // Create Paddle in center of screen
    paddle = new Paddle((windowWidth/2), (windowHeight/2), color(50,50,50), 500);
}

function draw() {
    background(243,152,0);
    let forceWind = createVector(random(-0.5, 0.5), 0);
    let forceGravity = createVector(0, 0.1);
    let netForce = p5.Vector.add(forceGravity, forceWind);
    paddle.updatePosition(netForce);

    for (let i = 0; i < balls.length; i++) {
        balls[i].applyForce(forceWind);
        balls[i].applyForce(forceGravity);

        // begin friction
        // friction affects velocity, not acceleration
        let forceFriction = balls[i].velocity.copy();
        let coefficientOfFriction = 0.05;
        forceFriction.mult(-1); // direction of friction vector is opposite of velocity
        forceFriction.normalize(); // scale magnitude to 1, while preserving direction
        forceFriction.mult(coefficientOfFriction); // scale now normalized vector magnitude by the coefficient of friction
        balls[i].applyForce(forceFriction); // apply the scaled vector to the ball as a force.
        // end friction

        balls[i].updatePosition();
    }

    for (let i = 0; i < balls.length; i++) {
        if (paddle.intersectsPoints(balls[i].position.x, balls[i].position.y)) {
            balls[i].hit = true;
            balls[i].color = color(0,104,183);
        }
        balls[i].draw();
    }

    paddle.draw();

    fill(255);
    stroke(0);
    strokeWeight(5);

    let textLeftEdge = 50;
    let textTopEdge = 50;
    text('Mouse Heading: ' + mouseVector.heading(), textLeftEdge, textTopEdge);
    text('paddle.ends[0] x/y: ' + floor(paddle.ends[0].x) + ', ' + floor(paddle.ends[0].y), textLeftEdge, textTopEdge + 20);
    text('paddle.ends[1] x/y: ' + floor(paddle.ends[1].x) + ', ' + floor(paddle.ends[1].y), textLeftEdge, textTopEdge + 40);
    text('Ball 0 Acceleration: ' + balls[0].acceleration.x + ', ' + balls[0].acceleration.y, textLeftEdge, textTopEdge + 60);
    text('Frame Rate: ' + floor(frameRate()), textLeftEdge, textTopEdge + 80);
}
