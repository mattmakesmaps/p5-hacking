/**
 * Rather then use a rectangle primitive, construct
 * two vectors to create a line.
 * 
 * A third vector is created representing the mouse
 * position, which is used to rotate the line.
 */

class Paddle {
    constructor(x, y, color, length = 100) {
            this.center = createVector(x, y);
            this.ends = [],
            this.color = color,
            this.length = length

        this.ends.push(new Ball(this.center.x - (this.length / 2), this.center.y, color));
        this.ends.push(new Ball(this.center.x + (this.length / 2), this.center.y), color);
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
        this.ends[0].updatePosition();
        this.ends[1].updatePosition();
        this.length = dist(this.ends[0].x, this.ends[0].y, this.ends[1].x, this.ends[1].y);
        this.center.x = (this.ends[0].x + this.ends[1].x) / 2;
        this.center.y = (this.ends[0].y + this.ends[1].y) / 2;
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
            // No Acceleration!
            // this.acceleration = createVector(0,0),
            // Acceleration is random!
            // this.acceleration = p5.Vector.random2D(),
            // Acceleration Towards the Mouse! (see _accellerationToMous())
            this.acceleration = createVector(0, 0),
            this.velocity = createVector(0, 0),
            this.position = createVector(x, y),
            this.color = color
            this.topSpeed = 15;
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

    draw() {
        fill(this.color);
        stroke(this.color);
        strokeWeight(10);
        point(this.position.x, this.position.y);
    }

    _accellerationToMouse() {
        /**
         * To set accelleration to follow the direction
         * of the mouse, we set accelleration to a vector
         * Accelleration = Mouse Position - Ball Position - (Width/2 , Height/2)
         * The result vector is then normalized to between 0,1
         * 
         * The last is required because of the intial translation, but I
         * bet could be removed if we use push pop in the main draw().
         */
        let mousePos = createVector(mouseX, mouseY);
        let vecToMousePos = mousePos
            .sub(this.position)
            .sub(createVector(width/2, height/2));
        this.acceleration = vecToMousePos;
        this.acceleration = this.acceleration.normalize();
        // will this slow down accelleration?
        this.acceleration = this.acceleration.mult(0.25);
    }

    updatePosition() {
        if (this.hit) {
            this._accellerationToMouse();
            this.velocity.add(this.acceleration);
            this.velocity.limit(this.topSpeed);
            this.position.add(this.velocity);
        }
    }
}

let balls = [];
let paddle;

function setup() {
    createCanvas(windowWidth, windowHeight);
    let ballCount = 500;
    for (let i = 0; i < ballCount; i++) {
        let x_cord = map(random(), 0, 1, -(width / 2), (width / 2));
        let y_cord = map(random(), 0, 1, -(height / 2), (height / 2));
        let ball_color = color(229,0,106);
        balls.push(new Ball(x_cord, y_cord, ball_color));
    }
    paddle = new Paddle(0, 0, color(50,50,50), 500);
}

function draw() {
    background(243,152,0);
    translate(width / 2, height / 2);

    // Create a vector representing the translated
    // mouse position.
    let mouseVector = createVector(
        mouseX - (width / 2),
        mouseY - (height / 2)
    );

    // The implementation should be updated to not require a new
    // Paddle each call to draw().
    // paddle = new Paddle(0, 0, color('teal'), 500);
    // paddle.setup();

    paddle.updatePosition(mouseVector);
    for (let i = 0; i < balls.length; i++) {
        balls[i].updatePosition();
    }

    for (let i = 0; i < balls.length; i++) {
        if (paddle.intersectsPoints(balls[i].position.x, balls[i].position.y)) {
            // note how we're toggling not just setting to true
            // just for fum.
            balls[i].hit = true;
            balls[i].color = color(0,104,183);
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
    text('Ball 0 Accelleration: ' + balls[0].acceleration.x + ', ' + balls[0].acceleration.y, 50, 160);
    text('Frame Rate: ' + floor(frameRate()), 50, 180);
}
