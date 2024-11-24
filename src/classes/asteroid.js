import Phaser from "phaser";

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
    //Sprite is a class which enables automatic handling of physics
    constructor(scene, x, y, size) {
        super(scene, x, y, 'asteroid'); // super() for extending the Sprite class
        this.scene = scene; // set asteroid to scene
        this.size = size; // large, medium, or small
        this.init();
    }

    init() {
        // add sprite to scene, since Phaser doesnt automatically do this after creation
        this.scene.add.existing(this);
        // also have to add sprite to physics system
        this.scene.physics.add.existing(this);

        // mass and bounce for physics
        this.body.setMass(999);
        this.body.setBounce(1);


        // set size scale
        switch (this.size) {
            case 'large':
                this.setScale(0.3); // 3 times the area of medium              
                break;
            case 'medium':
                this.setScale(0.173); // 3 times the area of small
                break;
            case 'small':
                this.setScale(0.1);
                break;
        }

        // circle of 300 roughly corresponds the area of asteroid3.png
        this.setCircle(300);  
    }

    spawnSmallerAsteroids() {
        let smallerSize;
        let scale;

        if (this.size === 'large') {
            smallerSize = 'medium';
            scale = 0.173;
        } else if (this.size === 'medium') {
            smallerSize = 'small';
            scale = 0.1;
        } else {
            return; // small asteroids don't break further
        }

        for (let i = 0; i < 3; i++) {
            const xOffset = Phaser.Math.Between(-30, 30);
            const yOffset = Phaser.Math.Between(-30, 30);
            const newAsteroid = new Asteroid(this.scene, this.x + xOffset, this.y + yOffset, smallerSize);
            this.scene.asteroids.add(newAsteroid);
            newAsteroid.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
            newAsteroid.setAngularVelocity(Phaser.Math.Between(-50, 50));
            newAsteroid.setScale(scale);
        }
    }
}