/**
 * A breakout clone using matter.js and p5.js
 */

let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Events = Matter.Events;

let engine;
let world;
let balls = [];
let blocks = [];
let walls = [];
let paddle;
let paddle_y_pos;

class Block {
    constructor(x, y, width, height) {
        this.matter_options = {
            label: 'Block',
            isStatic: true
        }
        this.body = Bodies.rectangle(x, y, width, height, this.matter_options);
        this.width = width;
        this.height = height;
        World.add(world, this.body);
    }

    show() {
        fill(214,71,0);
        let pos = this.body.position;
        rectMode(CENTER); // matter.js uses x/y as center of rect, not UL corner.
        rect(pos.x,pos.y,this.width, this.height);
    }
}


class Ball {
    constructor(x, y, radius) {
        // A full list of matter.js options:
        // https://brm.io/matter-js/docs/classes/Body.html#properties
        this.matter_options = {
            label: 'Ball',
            restitution: 1,
            density: 1,
            friction: 0,
            frictionAir: 0
        }
        this.radius = radius;
        this.body = Bodies.circle(x, y, radius, this.matter_options);
        World.add(world, this.body);
    }

    applyForce(force) {
        Matter.Body.applyForce(this.body, this.body.position, force);
    }

    show() {
        fill(255,241,206);
        let pos = this.body.position;
        ellipse(pos.x,pos.y,this.radius * 2); // third param to ellipse is diameter
    }
}

class Paddle {
    constructor(x, y, width=100, height=25) {
        this.matter_options = {
            label: 'Paddle'
        }
        this.body = Bodies.rectangle(x, y, width, height, this.matter_options);
        this.width = width;
        this.height = height;
        World.add(world, this.body);
    }

    updatePosition(x,y) {
        let newPosition = Matter.Vector.create(x,y);
        // let vectorToNewPosition = Matter.Vector.sub(newPosition, this.body.position);
        // let forceToNewPosition = Matter.Vector.normalise(vectorToNewPosition);
        // forceToNewPosition = Matter.Vector.mult(forceToNewPosition, 0.01);
        // Matter.Body.applyForce(this.body, this.body.position, forceToNewPosition);
        Matter.Body.setPosition(this.body, newPosition);
    }

    show() {
        fill(23,96,125);
        let pos = this.body.position;
        rectMode(CENTER); // matter.js uses x/y as center of rect, not UL corner.
        rect(pos.x,pos.y,this.width, this.height);
    }
}

class Wall {
    constructor(x, y, width, height) {
        this.matter_options = {
            label: 'Wall',
            isStatic: true
        }
        this.body = Bodies.rectangle(x, y, width, height, this.matter_options);
        this.width = width;
        this.height = height;
        World.add(world, this.body);
    }

    show() {
        noStroke();
        fill(80);
        let pos = this.body.position;
        rectMode(CENTER); // matter.js uses x/y as center of rect, not UL corner.
        rect(pos.x,pos.y,this.width, this.height);
    }
}


function setup() {
    createCanvas(windowWidth, windowHeight);

    engine = Engine.create();
    world = engine.world;
    // turn off gravity
    world.gravity.y = 0;
    paddle_y_pos = windowHeight * 0.9;

    /**
     * Wall Setup
     */
    let topWall = new Wall(windowWidth/2, 0, windowWidth, 10);
    let leftWall = new Wall(0, windowHeight/2, 10, windowHeight);
    let rightWall = new Wall(windowWidth, windowHeight/2, 10, windowHeight);
    walls.push(topWall, leftWall, rightWall);

    let b = new Ball(200, 20, 10);
    let b1 = new Ball(260, 20, 5);
    b.applyForce(Matter.Vector.create(0.0,4));
    balls.push(b);
    balls.push(b1);
    // let block1 = new Block(230, 200, 100, 25);
    let block2 = new Block(500, 200, 25, 200);
    let block3 = new Block(350, paddle_y_pos + 12.5, 7000, 10);
    // blocks.push(block1);
    blocks.push(block2);
    blocks.push(block3);

    paddle = new Paddle(300, paddle_y_pos);

    // REF: https://github.com/liabru/matter-js/blob/master/examples/events.js#L53
    // an example of using collisionStart event on an engine
    Events.on(engine, 'collisionStart', function(event) {
        var pairs = event.pairs;

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if (pair.bodyA.label === 'Ball' && pair.bodyB.label === 'Paddle') {
                console.log(pair);
                // Reversing and normalizing the velocity so that it can
                // be scaled by an arbitrary factor.
                let velocity = Matter.Vector.clone(pair.bodyA.velocity);
                let reverseVelocity = Matter.Vector.neg(velocity);
                reverseVelocity = Matter.Vector.normalise(reverseVelocity);
                reverseVelocity = Matter.Vector.mult(reverseVelocity, 10);
                Matter.Body.setVelocity(pair.bodyA, reverseVelocity);
            }
        }
    });
}

function draw() {
    background(65);

    Engine.update(engine);

    paddle.updatePosition(mouseX, paddle_y_pos);
    paddle.show();

    for (block of blocks) {
        block.show();
    }

    for (ball of balls) {
        ball.show();
    }

    for (wall of walls) {
        wall.show();
    }

}