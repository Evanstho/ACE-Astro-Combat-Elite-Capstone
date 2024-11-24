import phaser from 'phaser';

export class ControlScene extends Phaser.Scene { 
    constructor() {
        super("ControlScene")
    }
    
    create() {
        //starfield background 
        this.starfield = this.add.sprite(0, 0, 'starfield').setOrigin(0, 0);

        // create animation for starfield
        this.anims.create({
            key: 'twinkle',
            frames: this.anims.generateFrameNumbers('starfield', { start: 0, end: 11 }), 
            frameRate: 5,
            repeat: -1
        });

        // Play animation
        this.starfield.play('twinkle');

        // Scene dimensions
        const width = this.sys.game.config.width;

        // Scale
        const titleScale = 7;
        const controlScale = 1.25;
        const subtitleScale = 2.0;

        // Rectangle size
        const rectWidth = 200;
        const rectHeight = 50;
        const strokeWidth = 3;
        const unhighlightedColor = 0x00ff00; // Green outline
        const highlightedColor = 0xffffff; // White outline
        
        // Title text
        const titleText = this.add.bitmapText(width / 2, 100, 'retro_gaming', 'A.C.E.')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(titleScale);
        
        // Subtitle text 
        const subtitleText = this.add.bitmapText(width / 2, 160, 'retro_gaming', 'Astro Combat Elite')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(subtitleScale);
        
        // Control header
        const controlText = this.add.bitmapText(width / 2, 250, 'retro_gaming', 'Controls')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(subtitleScale);
        
        // Controls text
        const thrust = this.add.bitmapText(width / 2, 300, 'retro_gaming', 'W:  Thrusters')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(controlScale);
        const lStrafe = this.add.bitmapText(width / 2, 325, 'retro_gaming', 'A:  Left Strafe')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(controlScale);
        const rStrafe = this.add.bitmapText(width / 2, 350, 'retro_gaming', 'D:  Right Strafe')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(controlScale);
        const click = this.add.bitmapText(width / 2, 375, 'retro_gaming', 'Left Click:  Shoot')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(controlScale);
        const weapon = this.add.bitmapText(width / 2, 400, 'retro_gaming', '1, 2, 3:  Weapon Select')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(controlScale);
        const mouse = this.add.bitmapText(width / 2, 425, 'retro_gaming', 'Mouse Movement:  Aimming and turning')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(controlScale);
        
        //Back Button
        const backButton = this.add.rectangle(1150, 650, rectWidth, rectHeight)
            .setStrokeStyle(strokeWidth, unhighlightedColor)
            .setInteractive()
            .on('pointerover', () => {
                backButton.setStrokeStyle(strokeWidth, highlightedColor);
                backText.setTint(highlightedColor); // set text to white
            })
            .on('pointerout', () => {
                backButton.setStrokeStyle(strokeWidth, unhighlightedColor);
                backText.setTint(unhighlightedColor); // set text back to green
            })
            .on('pointerdown', () => {
                console.log('settings chosen');
                this.scene.start('ModeSelectorScreen');
            });

        const backText = this.add.bitmapText(1150, 650, 'retro_gaming', 'Back', 24)
        .setOrigin(0.5)
        .setTint(unhighlightedColor);

    }
}