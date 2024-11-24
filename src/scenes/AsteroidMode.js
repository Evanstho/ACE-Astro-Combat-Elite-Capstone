import Phaser from "phaser";
import HealthBar from "../classes/healthBar";
import {Ship} from "../classes/ship";
import {Cell} from "../classes/HUD";
import {Asteroid} from "../classes/asteroid"
import { Projectile } from "../classes/projectile";
import { ShipSelectionSingleScene } from "./ShipSelectionSingleScene";

export class AsteroidShootout extends Phaser.Scene {



    constructor(){
        super("AsteroidShootout")
        this.weaponSelector = [];
        this.weaponIndex = 0; 
    }

    // initialize attributes necessary for specific instance of this Asteroid Shootout scene
    init(data) {
        //Ship Selection Screen Data
        this.shipSelection = data.selection;

        this.startTime = this.time.now; 
        this.score = 0; 
        // Because int() essentially happens in the modeSelector scene or GameOverScene, 
        // this flag ensures that time counter does not start until first frame of update(),
        // ensuring there is no included time from ModeSelector/GameOver
        this.timeInitialized = false; 

        // attributes for progressive difficulty
        this.spawnDelay = 5000; 
        this.maxAsteroidSpawnSpeed = 100; 
    }

    // CREATE
    create() {
        
        // UI
        this.gameMode = this.add.bitmapText(6,0,"retro_gaming","Asteroid Shootout");
        this.pointCount = this.add.bitmapText(6,13,'retro_gaming','Score: 0');
        this.healthCount = this.add.bitmapText(6,25,'retro_gaming','Health: 100');
        this.healthBar = new HealthBar(this,5,40);
        this.shieldCount = this.add.bitmapText(6, 57, 'retro_gaming', 'Shield: 0');
        this.shieldBar = new HealthBar(this, 5, 72, true); // true indicates shield bar
        this.timeSurvived = this.add.bitmapText(1150,0,"retro_gaming","Time Survived: \n 0");

        // Weapons tool bar
        this.weaponsText = this.add.bitmapText(550,590,"retro_gaming","Weapons:");

        
        for (let i = 0; i < 3; i++) {
            const cell = new Cell(this, 650 + (25 * i), 600, 25, 25, 0xffffff, i);
            cell.setStrokeStyle(3, 0x000).setVisible(i === 0); // only the first cell is visible at first
            cell.setDepth(10);
            this.weaponSelector.push(cell);
        }
    
        // highlight the first cell at first
        this.weaponSelector[0].setStrokeStyle(3, 0x66C61C); 
        
        // set UI elements to front
        this.gameMode.setDepth(10);
        this.pointCount.setDepth(10);
        this.healthCount.setDepth(10);
        this.healthBar.setDepth(10);
        this.shieldCount.setDepth(0);
        this.shieldBar.setDepth(0);
        this.timeSurvived.setDepth(10);
        this.weaponsText.setDepth(10);

        //starfield background 
        this.starfield = this.add.sprite(0, 0, 'starfield').setOrigin(0, 0);

        // create animation for starfield
        this.anims.create({
            key: 'twinkle',
            frames: this.anims.generateFrameNumbers('starfield', { start: 0, end: 11 }), 
            frameRate: 5,
            repeat: -1
        });
        // play animation
        this.starfield.play('twinkle');

        // play background music
        this.backgroundMusic = this.sound.add('bgm1', { volume: 0, loop: true });
        this.backgroundMusic.play();

        this.thrusterSound = this.sound.add('thruster', { volume: .7, loop: true });


        //Create ship
        this.ship = new Ship(this, 400, 300, this.shipSelection);

        // max velocity in pixels per second

        this.ship
            // .setMaxVelocity(200)
            .setDamping(true)
            .setDrag(0.3);
        
        // Muzzle Flash
        // because this animation is instantiated in create() only once as a reusable resource, setVisible(false) until later use
        this.flash = this.add.sprite(this.ship.x, this.ship.y, 'flash').setVisible(false);
        this.flash.setScale(.3);
        this.anims.create({
                key: 'zap',
                frames: this.anims.generateFrameNumbers('flash', { start: 0, end: 3 }), 
                frameRate: 60,
                hideOnComplete: true,
                repeat: 0 // play only once
        });

        //Explosion animation -- TODO: Determine if this is the most efficient way
        this.boom = this.add.sprite(0, 0, 'boom').setVisible(false);
        this.boom.setScale(.5);
        this.anims.create({
            key: 'pop',
            frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 2 }),
            frameRate: 15,
            hideOnComplete: true,
            repeat: 0 // play only once
        });


        // create projectile pool
        this.projectiles = this.physics.add.group({
            classType: Projectile,
            // maxSize: 20,     // this has mostly introduced hassles to deactivating projectiles 
            runChildUpdate: true, // allows calling update on projectiles
        });

        // event listener for fire weapon
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.fireProjectile();
            }
        });

        // ASTEROID CREATION
        // initialize asteroid physics and groups
        this.asteroids = this.physics.add.group({
            classType: Asteroid,
            runChildUpdate: true
        });


        for (let i = 0; i < 1; i++){
            this.spawnAsteroidsFromEdges()
        }
        
        // call spawnAsteroidsFromEdges every spawnDelay
        this.asteroidSpawnEvent = this.time.addEvent({
            delay: this.spawnDelay, 
            callback: this.spawnAsteroidsFromEdges, 
            callbackScope: this, // this scene
            loop: true // keep repeating
        });

        // create cursor keys object to track arrow key input
        this.cursors = this.input.keyboard.createCursorKeys();

        // setup WAD keys object to track movement input

        //this.lturn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        //this.rturn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.forward = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.lstrafe = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rstrafe = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


        // Maneuvers 
        this.maneuver1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.maneuver2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        
        //Mouse Turning
        this.input.on('pointermove', this.pointerTurning, this);

        // mouse wheel event listener for weapon selection
        // deltaY sense vertical scroll
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            let visibleCells = this.weaponSelector.filter(cell => cell.visible);
            let newIndex = this.weaponIndex;
        
            if (deltaY > 0) {
                newIndex = (newIndex + 1) % visibleCells.length;
            } else if (deltaY < 0) {
                newIndex = (newIndex - 1 + visibleCells.length) % visibleCells.length;
            }
            this.weaponIndex = this.weaponSelector.indexOf(visibleCells[newIndex]);
            this.updateWeaponSelector();
        });
        
        // Number keys for weapon selection
        this.input.keyboard.on('keydown-ONE', () => {
            this.weaponIndex = 0;
            this.updateWeaponSelector();
        });
        this.input.keyboard.on('keydown-TWO', () => {
            if (this.weaponSelector[1].visible) {
                this.weaponIndex = 1;
                this.updateWeaponSelector();
            }
        });
        this.input.keyboard.on('keydown-THREE', () => {
            if (this.weaponSelector[2].visible) {
                this.weaponIndex = 2;
                this.updateWeaponSelector();
            }
        });        

        // collision detection between projectiles and asteroids
        this.physics.add.collider(this.projectiles, this.asteroids, this.destroyAsteroid, null, this);

        // collision detection between ship and asteroids
        this.physics.add.collider(this.ship, this.asteroids, this.handleShipAsteroidCollision, null, this);

        this.starfield.setDepth(0);
        this.ship.setDepth(5)

        // create blue shield circle and set its depth initially to 0
        this.blueCircle = this.add.circle(this.ship.x, this.ship.y, 30, 0x0000ff).setDepth(-1);
    }

    // UPDATE function called every frame to update scene
    update() {

        // initialize time in first frame in game mode, 
        // otherwise if time is started in create(),  will include time spent in ModeSelector
        if (!this.timeInitialized) {
            this.startTime = this.time.now;
            this.timeInitialized = true;
        }

        if (this.ship.health <= 0) {
            this.scene.start('GameOverScene', {
                score: this.score, 
                timeSurvived: this.formatTime(this.time.now - this.startTime)
            });
        }

        const acceleration = 200; 
        const strafeFactor = 30;

        if (this.forward.isDown) {
            // forward acceleration
            this.physics.velocityFromRotation(this.ship.rotation, acceleration, this.ship.body.acceleration);
        } else {
            this.ship.setAcceleration(0);
        }

        // strafe
        if (Phaser.Input.Keyboard.JustDown(this.lstrafe)) {
            // left acceleration
            const leftStrafeAngle = this.ship.rotation - Phaser.Math.DegToRad(90);
            this.physics.velocityFromRotation(leftStrafeAngle, strafeFactor*acceleration, this.ship.body.acceleration);
        } else if (Phaser.Input.Keyboard.JustDown(this.rstrafe)) {
            // right acceleration
            const rightStrafeAngle = this.ship.rotation + Phaser.Math.DegToRad(90);
            this.physics.velocityFromRotation(rightStrafeAngle, strafeFactor*acceleration, this.ship.body.acceleration);
        }

 
        //Nose following mouse
        //this.input.on('pointermove', pointer)

        // Update time survived display
        this.timeSurvived.setText(`Time Survived: \n${this.formatTime(this.time.now - this.startTime)}`);

        // asteroids wrap around world bounds
        this.asteroids.children.iterate(function(asteroid) {
            this.physics.world.wrap(asteroid, 0);  
        }, this);

        // ship wraps around world bounds
        this.physics.world.wrap(this.ship, 0);  

        // update position of the blue circle to follow the ship
        this.blueCircle.setPosition(this.ship.x, this.ship.y);

    }

    healthShieldUpdate() {
        // update ship's health/shield attributes
        this.healthBar.setValue(this.ship.health);
        this.shieldBar.setValue(this.ship.shield);
        // update health text
        this.healthCount.setText(`Health: ${this.ship.health}`).setDepth(10);

        // if any shield, display that, otherwise hide
        if (this.ship.shield > 0) {
            this.shieldCount.setText(`Shield: ${this.ship.shield}`).setDepth(10);
            this.shieldBar.setDepth(10);
            this.blueCircle.setDepth(4); // just behind ship
        } else {
            this.shieldCount.setDepth(-1); // behind background
            this.shieldBar.setDepth(-1);
            this.blueCircle.setDepth(-1);
        }
    }

    handleShipAsteroidCollision(ship, asteroid) {
        // reduce ship's health by 10
        ship.damaged(10);
        this.sound.play("ship_hit",{volume : 0.2});
        this.healthShieldUpdate();

        /*
        if (this.healthBar) {
            this.healthBar.setValue(ship.health);
        }
        if (this.shieldBar) {
            this.shieldBar.setValue(ship.shield);
        }
        //*/

        // elastic collisions now handled with Phaser's body.bounce
        // maybe play some collison sound 
    }

    fireProjectile() {
        console.log('fire projectile');
        
        // determine type of shot based on the selected weapon
        if (this.weaponIndex === 0) {
            // single shot
            this.shootSingleProjectile(this.ship.x, this.ship.y, this.ship.rotation);
        } else if (this.weaponIndex === 1) {
            // triple shot
            this.shootTripleProjectile(this.ship.x, this.ship.y, this.ship.rotation);
        }
        
        // play firing sound
        this.sound.play('laserSound', { volume: 0.3 });
        
        // Play flash animation
        const gap = 50; // distance from ship
        const cosAngle = Math.cos(this.ship.rotation);
        const sinAngle = Math.sin(this.ship.rotation);
        const offsetX = cosAngle * gap;
        const offsetY = sinAngle * gap;
        this.flash.setRotation(this.ship.rotation + Phaser.Math.DegToRad(90));
        this.flash.setPosition(this.ship.x + offsetX, this.ship.y + offsetY).setVisible(true);
        this.flash.play('zap');
    }
    
    // helper method to shoot a single projectile
    shootSingleProjectile(x, y, rotation) {
        const projectile = this.projectiles.getFirstDead(true);
        if (projectile) {
            const speed = 500;
            const velocityX = speed * Math.cos(rotation);
            const velocityY = speed * Math.sin(rotation);
            projectile.activate(x, y, velocityX, velocityY, rotation + Phaser.Math.DegToRad(90));
        }
    }
    
    // helper method to shoot triple projectiles
    shootTripleProjectile(x, y, rotation) {
        const speed = 500;
        const angleOffset = Phaser.Math.DegToRad(20); 
    
        // center projectile
        this.shootSingleProjectile(x, y, rotation);
    
        // left projectile
        this.shootSingleProjectile(x, y, rotation - angleOffset);
    
        // right projectile
        this.shootSingleProjectile(x, y, rotation + angleOffset);
    }

    
    spawnAsteroidsFromEdges() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;

        // array containing the coordinates and respective positions for each edge
        const edges = [
            { x: Phaser.Math.Between(0, width), y: 0, position: 'top' }, // top edge
            { x: Phaser.Math.Between(0, width), y: height, position: 'bottom' }, // bottom edge
            { x: 0, y: Phaser.Math.Between(0, height), position: 'left' }, // left edge
            { x: width, y: Phaser.Math.Between(0, height), position: 'right' } // right edge
        ];

        // randomly choose an edge
        const chosenEdge = Phaser.Math.RND.pick(edges);

        // randomly select an asteroid size
        const size = ['large', 'medium'][Phaser.Math.Between(0, 1)];

        // create an asteroid at the chosen edge
        const asteroid = new Asteroid(this, chosenEdge.x, chosenEdge.y, size);

        // add the asteroid to the group
        this.asteroids.add(asteroid);

        // determine velocity based on the spawning position
        let velocityX = Phaser.Math.Between(-this.maxAsteroidSpawnSpeed, this.maxAsteroidSpawnSpeed);
        let velocityY = Phaser.Math.Between(-this.maxAsteroidSpawnSpeed, this.maxAsteroidSpawnSpeed);

        // adjust velocity based on the selected position to avoid immediate wrapping
        switch (chosenEdge.position) {
            case 'top':
                velocityY = Phaser.Math.Between(1, this.maxAsteroidSpawnSpeed); // Only downward movement
                break;
            case 'bottom':
                velocityY = Phaser.Math.Between(-this.maxAsteroidSpawnSpeed, -1); // Only upward movement
                break;
            case 'left':
                velocityX = Phaser.Math.Between(1, this.maxAsteroidSpawnSpeed); // Only rightward movement
                break;
            case 'right':
                velocityX = Phaser.Math.Between(-this.maxAsteroidSpawnSpeed, -1); // Only leftward movement
                break;
        }

        asteroid.setVelocity(velocityX, velocityY);
        asteroid.setAngularVelocity(Phaser.Math.Between(-50, 50));

        //increase difficulty by reducing time between spawns and increasing asteroid speed
        this.spawnDelay = Math.max(this.spawnDelay * 0.98, 1500);
        this.maxAsteroidSpawnSpeed = this.maxAsteroidSpawnSpeed + 10


        //reset asteroidSpawnEvent timer since we changed spawnDelay
        if (this.asteroidSpawnEvent) {
            this.asteroidSpawnEvent.remove();
        }

        this.asteroidSpawnEvent = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawnAsteroidsFromEdges,
            callbackScope: this,
            loop: true
        });

    }

    // spawns a floating power-up that can be picked up
    spawnPowerUp(x, y) {
        const powerUpChance = Phaser.Math.Between(0, 49); // 1/50 chance
        const powerUpType = Phaser.Math.Between(0, 1); // 50/50 chance between triple-shot and shield

        if (powerUpChance === 0) {
            let color = 0xffff00; // yellow for triple-shot
            if (powerUpType === 1) {
                color = 0x0000ff; // blue for shield
            }

            const powerUp = this.add.circle(x, y, 10, color).setDepth(10);
            this.physics.add.existing(powerUp);
            powerUp.body.setCircle(10);
            powerUp.body.setVelocity(Phaser.Math.Between(-20, 20), Phaser.Math.Between(-20, 20));
            this.physics.add.overlap(this.ship, powerUp, () => {
                this.pickUpPowerUp(powerUp, powerUpType);
            });
        }
    }

    
    destroyAsteroid(projectile, asteroid) {
        //Play explosion animation
        this.boom.setPosition(asteroid.x, asteroid.y).setVisible(true);
        this.boom.play('pop');

        asteroid.spawnSmallerAsteroids(); // spawn smaller asteroids upon collision
        asteroid.destroy();
        projectile.destroy(); 
        this.sound.play('explosion', { volume: 1 });

        // chance to spawn a power-up
        this.spawnPowerUp(asteroid.x, asteroid.y);
        

        // Increment score
        this.score++;
        this.pointCount.setText(`Score: ${this.score}`);
    }

    // This function registers turning the ship by using the mouse
    pointerTurning(pointermove){
        // Inspiration from sources: 
        // “Rotating a Sprite Towards a Pointer,” phaser.discourse.group, [Online]. Available: https://phaser.discourse.group/t/rotating-a-sprite-towards-the-pointer/921. [Accessed: Apr. 30, 2024].
        // J. Capellan, “Sprite Angle towards pointer,” [Online]. Available: https://codepen.io/jjcapellan/pen/bzVWWW/. [Accessed: Apr. 30, 2024].
        
        let angleToPointer = Phaser.Math.Angle.BetweenPoints(this.ship, pointermove);
        // Slowly rotates ship -- lower the number the slower the ship goes
        //this.ship.rotation = Phaser.Math.Angle.RotateTo(this.ship.rotation, angleToPointer, .04);

        this.ship.setRotation(angleToPointer);
        //console.log(`${this.ship.rotation}`);
    }

    // for Time Survived display
    formatTime(ms) {
        let s = Math.floor(ms / 1000); // convert ms to seconds, round down
        const m = Math.floor(s / 60); // minutes
        s = s % 60; // seconds
        return `${m}:${s < 10 ? '0' + s : s}`; // format time string
    }

    // visually updates weapon HUD at bottom of screen
    updateWeaponSelector() {
        for (let i = 0; i < this.weaponSelector.length; i++) {
            if (i === this.weaponIndex) {
                this.weaponSelector[i].setStrokeStyle(3, 0x66C61C);
            } else {
                this.weaponSelector[i].setStrokeStyle(3, 0x000);
            }
            // only show available cells, hide rest
            this.weaponSelector[i].setVisible(i === 0 || this.weaponSelector[i].visible); 
        }
    }
    

    pickUpPowerUp(powerUp, powerUpType) {
        powerUp.destroy();
        // triple shot power up
        if (powerUpType === 0) {
            this.weaponSelector[1].setVisible(true);
            if (this.powerUpTimer) {
                this.powerUpTimer.remove();
            }
            this.weaponIndex = 1;
            this.updateWeaponSelector();

            // triple shot power up timer, 30 sec
            this.powerUpTimer = this.time.addEvent({
                delay: 30000,
                callback: () => {
                    this.weaponIndex = 0;
                    this.updateWeaponSelector();
                    this.weaponSelector[1].setVisible(false);
                },
                callbackScope: this
            });
        // shield power up
        } else if (powerUpType === 1) {
            this.ship.setShield(100);
            this.shieldCount.setDepth(10);
            this.shieldBar.setDepth(10);
            this.healthShieldUpdate();
        }
    }
}
