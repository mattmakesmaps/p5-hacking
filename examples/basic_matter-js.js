/**
 * Basic matter.js example.
 * REF: https://github.com/liabru/matter-js/wiki/Getting-started
 * REF: https://thecodingtrain.com/CodingChallenges/062.1-plinko.html
 */

let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Events = Matter.Events;

let engine;
let world;
let balls = [];
let blocks = [];

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
        fill(255,0,0);
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
            density: 1
        }
        this.radius = radius;
        this.body = Bodies.circle(x, y, radius, this.matter_options);
        World.add(world, this.body);
    }

    applyForce(force) {
        Matter.Body.applyForce(this.body, this.body.position, force);
    }

    show() {
        fill(255,0,0);
        let pos = this.body.position;
        ellipse(pos.x,pos.y,this.radius * 2); // third param to ellipse is diameter
    }
}

function setup() {
    createCanvas(700, 600);
    engine = Engine.create();
    world = engine.world;
    let b = new Ball(200, 20, 10);
    let b1 = new Ball(260, 20, 5);
    balls.push(b);
    balls.push(b1);
    let block1 = new Block(230, 100, 100, 25);
    let block2 = new Block(500, 100, 25, 200);
    blocks.push(block1);
    blocks.push(block2);

    //REF: https://github.com/liabru/matter-js/blob/master/examples/events.js#L53
    // an example of using collisionStart event on an engine
    Events.on(engine, 'collisionStart', function(event) {
        var pairs = event.pairs;

        // change object colours to show those starting a collision
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            console.log(pair);
            if (pair.bodyA.label === 'Ball') {

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

    for (block of blocks) {
        block.show();
    }

    for (ball of balls) {
        let wind = Matter.Vector.create(0.01,0.0);
        ball.applyForce(wind);
        ball.show();
    }

}