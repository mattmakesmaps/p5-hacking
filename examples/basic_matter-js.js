/**
 * Basic matter.js example.
 * REF: https://github.com/liabru/matter-js/wiki/Getting-started
 * REF: https://thecodingtrain.com/CodingChallenges/062.1-plinko.html
 */

let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;

let engine;
let world;
let balls = [];

class Ball {
    constructor(x, y, radius) {
        // A full list of matter.js options:
        // https://brm.io/matter-js/docs/classes/Body.html#properties
        this.matter_options = {
            frictionAir: 0.75,
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

        push();
            translate(pos.x, pos.y);
            ellipse(0,0,this.radius);
        pop();
    }
}

function setup() {
    createCanvas(700, 600);
    engine = Engine.create();
    world = engine.world;
    let b = new Ball(200, 20, 10);
    let b1 = new Ball(260, 20, 40);
    balls.push(b);
    balls.push(b1);
}

function draw() {
    background(65);

    Engine.update(engine);

    for (ball of balls) {
        let wind = Matter.Vector.create(0.3,0.0);
        ball.applyForce(wind);
        ball.show();
    }
}