import Phaser from "phaser";



// based heavily on official phaser example health bar 
//https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/graphics/health%20bars%20demo.js
export default class HealthBar {

    constructor (scene, x, y, isShield = false)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 76 / 100;
        this.isShield = isShield; // boolean to distinguish health from shield bar
        this.draw();
        scene.add.existing(this.bar);
    }

    decrease (amount){
        amount ? this.value -= amount : amount-- ;
        if (this.value < 0) this.value = 0;
        this.draw();
        return (this.value === 0); // use this to update onscreen count accordingly
    }

    setValue(amount) {
        this.value = amount;
        this.draw();
    }

    draw (){
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 80, 16);

        //  draw health/shield bar
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);
        if (this.isShield) {
            this.value <= 25 ? this.bar.fillStyle(0xff0000) : this.bar.fillStyle(0x0000ff);
        } else {
            this.value <= 25 ? this.bar.fillStyle(0xff0000) : this.bar.fillStyle(0x00ff00);
        }
        
        let d = Math.floor(this.p * this.value);
        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

    // set position in scene
    setDepth(depth) {
        this.bar.setDepth(depth);
    }

}
