import Phaser from "phaser";

export class Cell extends Phaser.GameObjects.Rectangle{
    // selectable cell for UI menus using cell index
    constructor(scene, x, y, width, height,fillColor, index)
    {
        super(scene, x, y, width, height,fillColor)
        // add in  index rectangles for use in hud 
        this.index = index ; 
        this.setInteractive();
        scene.add.existing(this);
    }
    

}

