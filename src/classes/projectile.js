export class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, owner = null) {
        
        super(scene, x, y, 'projectile'); 
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.init();

        this.oldX = x;
        this.oldY = y;
        this.newX = x;
        this.newY = y;
        this.progress = 0 ;
        this.alive = true;
        this.spent = false;
        this.owner = owner;
    }

    init() {
        this.setCircle(5);
        this.setCollideWorldBounds(false);
        this.body.onWorldBounds = true;
        this.scene.physics.world.on('worldbounds', this.onWorldBounds, this);
        this.setScale(0.05); 
    }

    activate(x, y, velocityX, velocityY, rotation) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocity(velocityX, velocityY);
        this.setRotation(rotation);


        // currently projectiles are simply destroy upon collision with asteroid or world bounds

        /*
        // Add a timer to destroy the projectile after 2000ms
        this.lifespan = this.scene.time.addEvent({
            delay: 2000,
            callback: this.deactivate,
            callbackScope: this,
        });
        */
    }

    /* 
    deactivate() {
        this.setActive(false);
        this.setVisible(false);
        if (this.lifespan) {
            this.lifespan.remove(); 
        }
    }
    */

    onWorldBounds(body) {
        if (body.gameObject === this) {
            this.destroy();
        }
    }

    
}
