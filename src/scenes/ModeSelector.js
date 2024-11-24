import Phaser from "phaser";

export class ModeSelectorScreen extends Phaser.Scene{
    constructor(){
        super("ModeSelectorScreen")
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

        // Scale factors for retro_gaming
        const titleScale = 7.0; 
        const subtitleScale = 2.0; 

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

        // Rectangle and stroke properties
        const rectWidth = 600;
        const rectHeight = 100;
        const strokeWidth = 3;
        const unhighlightedColor = 0x00ff00; // Green outline
        const highlightedColor = 0xffffff; // White outline

        // Asteroid Shootout Mode
        const asteroidRectangle = this.add.rectangle(width / 2, 250, rectWidth, rectHeight)
            .setStrokeStyle(strokeWidth, unhighlightedColor)
            .setInteractive()
            .on('pointerover', () => {
                asteroidRectangle.setStrokeStyle(strokeWidth, highlightedColor);
                asteroidText.setTint(highlightedColor); // set text to white
            })
            .on('pointerout', () => {
                asteroidRectangle.setStrokeStyle(strokeWidth, unhighlightedColor);
                asteroidText.setTint(unhighlightedColor); // set text back to green
            })
            .on('pointerdown', () => {
                console.log('Chose Asteroid Shootout');
                //this.scene.start('AsteroidShootout');
                this.scene.start('ShipSelectionSingleScene');
            });

        const asteroidText = this.add.bitmapText(width / 2, 250, 'retro_gaming', 'Asteroid Shootout Mode', 24)
            .setOrigin(0.5)
            .setTint(unhighlightedColor);

        // PvP Mode
        const pvpRectangle = this.add.rectangle(width / 2, 375, rectWidth, rectHeight)
            .setStrokeStyle(strokeWidth, unhighlightedColor)
            .setInteractive()
            .on('pointerover', () => {
                pvpRectangle.setStrokeStyle(strokeWidth, highlightedColor);
                pvpText.setTint(highlightedColor); // set text to white
            })
            .on('pointerout', () => {
                pvpRectangle.setStrokeStyle(strokeWidth, unhighlightedColor);
                pvpText.setTint(unhighlightedColor); // set text back to green
            })
            .on('pointerdown', () => {
                console.log('Chose Multiplayer 1v1');
                //this.scene.start('LobbyScene');
                this.scene.start('ShipSelectionMultScene');
            });

        const pvpText = this.add.bitmapText(width / 2, 375, 'retro_gaming', 'Multiplayer 1v1 Mode', 24)
            .setOrigin(0.5)
            .setTint(unhighlightedColor);
        
        //Controls
        const leaderboardButton = this.add.rectangle(width / 2, 500, rectWidth, rectHeight)
            .setStrokeStyle(strokeWidth, unhighlightedColor)
            .setInteractive()
            .on('pointerover', () => {
                leaderboardButton.setStrokeStyle(strokeWidth, highlightedColor);
                leaderboardText.setTint(highlightedColor); // set text to white
            })
            .on('pointerout', () => {
                leaderboardButton.setStrokeStyle(strokeWidth, unhighlightedColor);
                leaderboardText.setTint(unhighlightedColor); // set text back to green
            })
            .on('pointerdown', () => {
                console.log('Controls chosen');
                this.scene.start('LeaderboardScene');
            });
        
        const leaderboardText = this.add.bitmapText(width / 2, 500, 'retro_gaming', 'Leaderboard', 24)
            .setOrigin(0.5)
            .setTint(unhighlightedColor);
        
        
        //Controls
        const controlsButton = this.add.rectangle(width / 2, 625, rectWidth, rectHeight)
            .setStrokeStyle(strokeWidth, unhighlightedColor)
            .setInteractive()
            .on('pointerover', () => {
                controlsButton.setStrokeStyle(strokeWidth, highlightedColor);
                controlsText.setTint(highlightedColor); // set text to white
            })
            .on('pointerout', () => {
                controlsButton.setStrokeStyle(strokeWidth, unhighlightedColor);
                controlsText.setTint(unhighlightedColor); // set text back to green
            })
            .on('pointerdown', () => {
                console.log('Controls chosen');
                this.scene.start('ControlScene');
            });
        
        const controlsText = this.add.bitmapText(width / 2, 625, 'retro_gaming', 'Controls', 24)
            .setOrigin(0.5)
            .setTint(unhighlightedColor);
    }

}