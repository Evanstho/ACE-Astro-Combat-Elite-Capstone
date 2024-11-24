import Phaser from "phaser";
import HealthBar from "./healthBar";

export class Ship extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, ship_image,pvp = false){
        super(scene, x, y, ship_image);
    
        this.setScale(0.2);
        scene.physics.world.enable(this);

        this.body.setMass(1); // Mass for collisions 
        if (!pvp){
            this.body.setBounce(1);
            this.setMaxVelocity(1000); // Max velocity in pixels per second
            this.setDamping(true); // Drag/air resistance
            this.setDrag(0.3); // Lower for more drag
        }
        this.setRotation(4.71239); 
        this.alive = true;
        this.health = 100;
        this.healthBar = null;
        this.shield = 0;
        this.shieldBar = null;

        // these track interpolation progress on a certain sprite
        this.oldX = x ;
        this.oldY = y ;
        this.newX = x ;
        this.newY = y ;
        this.progress = 0 ;
        
        scene.add.existing(this);
    }
    addHealthBar(scene, x, y){
        // gives a player a health bar and ties it to their sprite for easy management
        this.healthBar = new HealthBar(scene,x,y);
    }

    // add a health bar but mark it as a shield bar
    addShieldBar(scene, x, y) {
        this.shieldBar = new HealthBar(scene, x, y, true); 
    }

    decrementHealth(amount){
        // TODO: add some temporary effect like flickering on damage maybe
        this.health -= amount;
        if (this.health < 0) 
            this.health = 0 ;
        if(this.healthBar)
            this.healthBar.decrease(amount);
    }

    decrementShield(amount) {
        if (this.shield > 0) {
            this.shield -= amount;
            if (this.shield < 0) 
                this.shield = 0;
            if (this.shieldBar) 
                this.shieldBar.decrease(amount);
        }
    }

    setHealth(amount){

        if(this.healthBar)
            this.healthBar.decrease(this.health - amount);
        this.health = amount;
        if (this.health < 0) 
            this.health = 0;

    }

        


    // Allows the ship to keep track of how much damage it recieves
    // Un-tested
    damaged(points) {
        let damage = points;

        //first deplete shield
        if (this.shield > 0){ 
            if (damage > this.shield) {
                damage -= this.shield;
                this.decrementShield(this.shield);
            } else {
                this.decrementShield(damage);
                damage = 0;
            }
        }
        // then deplete health
        if (damage > 0) {
            this.decrementHealth(damage);
        }
        if (this.health <= 0) {
            this.destroyed();
        }
    }
        

    // Function sets the alive status to false and does the death animation
    destroyed() {
        this.alive = false;
        // Do death stuff
    }

    //sets the amount of shields
    setShield(points) {
        this.shield = points;
        if (this.shieldBar) 
            this.shieldBar.setValue(points);
    }


  
}