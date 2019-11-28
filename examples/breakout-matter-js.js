/**
 * A breakout clone using matter.js and p5.js
 */

let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Events = Matter.Events;
let Composite = Matter.Composite;

let engine;
let world;
let balls = [];
let blocks = [];
let walls = [];
let paddle;
let paddle_y_pos;

class Block {
    constructor(x, y, width, height, color=[0,255,0]) {
        this.matter_options = {
            label: 'Block',
            isStatic: true,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0
        }
        this.body = Bodies.rectangle(x, y, width, height, this.matter_options);
        this.width = width;
        this.height = height;
        World.add(world, this.body);
        this.id = this.body.id;
        this.color = color;
    }

    show() {
        fill(this.color);
        let pos = this.body.position;
        rectMode(CENTER); // matter.js uses x/y as center of rect, not UL corner.
        rect(pos.x,pos.y,this.width, this.height);
    }

    destory() {
        Composite.remove(world,this.body); // matter.js
        // push();
        //     scale(2);
        //     this.show();
        // pop();
        blocks = blocks.filter(block => block.id !== this.id); // p5.js
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
            frictionAir: 0,
            frictionStatic: 0
        }
        this.startPosition = Matter.Vector.create(x,y);
        this.radius = radius;
        this.body = Bodies.circle(x, y, radius, this.matter_options);
        World.add(world, this.body);
        this.id = this.body.id;
    }

    applyForce(force) {
        Matter.Body.applyForce(this.body, this.body.position, force);
    }

    checkEdges() {
        // Hack to reset ball if offscreen
        if (this.body.position.y > windowHeight) {
            console.log('resetting position');
            Matter.Body.setPosition(this.body, this.startPosition);
        }
    }

    updatePosition() {
        // Keep direction of Ball vector by normalizing it,
        // and set the magnitude (speed) to 8 by multiplying it.
        let velocity = Matter.Vector.clone(this.body.velocity);
        velocity = Matter.Vector.normalise(velocity);
        velocity = Matter.Vector.mult(velocity, 8);
        Matter.Body.setVelocity(this.body, velocity);
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
            label: 'Paddle',
            isStatic: true,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0
        }
        this.body = Bodies.rectangle(x, y, width, height, this.matter_options);
        this.width = width;
        this.height = height;
        World.add(world, this.body);
        this.id = this.body.id;
    }

    updatePosition(x,y) {
        let newPosition = Matter.Vector.create(x,y);
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
            isStatic: true,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0
        }
        this.body = Bodies.rectangle(x, y, width, height, this.matter_options);
        this.width = width;
        this.height = height;
        World.add(world, this.body);
        this.id = this.body.id;
    }

    show() {
        fill(80);
        let pos = this.body.position;
        rectMode(CENTER); // matter.js uses x/y as center of rect, not UL corner.
        rect(pos.x,pos.y,this.width, this.height);
    }
}

// REF: colors.co
const colorPalletes = {
    'royal': [
        [230, 57, 70],
        [241, 250, 238],
        [168, 218, 220],
        [69, 123, 157],
        [29, 53, 87]
    ],
    'down2': [
        [38, 70, 83],
        [42, 157, 143],
        [233, 196, 106],
        [244, 162, 97],
        [231, 111, 81]
    ]
}

const blockGridPattern = {
    'basic' : function (colorPallete) {
        let blockRowCount = 8;
        let blockWidth = 60;
        let blockHeight = 20;
        let blocksPerRow = windowWidth/blockWidth;
        let palleteIndex = 0;
        for (let i = 0; i < blockRowCount; i++) {
            palleteIndex += 1;
            if (palleteIndex >= colorPallete.length) {
                palleteIndex = 0;
            }
            let fillColor = colorPallete[palleteIndex];
            console.log(fillColor);
            for (let j = 0; j < blocksPerRow; j++) {
                let block = new Block(j * blockWidth, 100 + (i * blockHeight), blockWidth, blockHeight, fillColor);
                blocks.push(block);
            }
        }
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

    /**
     * Ball Setup
     */
    let ball = new Ball(windowWidth/2, paddle_y_pos - 200, 10);
    // just gets the ball going
    ball.applyForce(Matter.Vector.create(3,8));
    balls.push(ball);

    /**
     * Blocks Setup
     */
    let blockGridSetup = blockGridPattern['basic'];
    let colorPallete = colorPalletes['royal'];
    blockGridSetup(colorPallete);

    /**
     * Paddle Setup
     */
    paddle = new Paddle(300, paddle_y_pos);

    // REF: https://github.com/liabru/matter-js/blob/master/examples/events.js#L53
    // an example of using collisionStart event on an engine
    Events.on(engine, 'collisionEnd', function(event) {
        var pairs = event.pairs;

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];

            // Accellerate the Ball
            if (pair.bodyA.label === 'Ball') {
                let ballID = pair.bodyA.id;
                for (ball of balls) {
                    if (ball.id === ballID){
                        ball.updatePosition();
                    }
                }
            }

            // Destroy the block
            if (pair.bodyA.label === 'Ball' && pair.bodyB.label === 'Block') {
                let blockID = pair.bodyB.id;
                for (block of blocks) {
                    if (block.id === blockID){
                        block.destory();
                    }
                }
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
        ball.checkEdges();
        ball.show();
    }

    for (wall of walls) {
        wall.show();
    }

}