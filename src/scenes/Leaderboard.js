import phaser from 'phaser';

export class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super("LeaderboardScene")
    }

    create() {
        // Starfield background 
        this.starfield = this.add.sprite(0, 0, 'starfield').setOrigin(0, 0);

        // Create animation for starfield
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
        
        // Leaderboard header
        const controlText = this.add.bitmapText(width / 2, 250, 'retro_gaming', 'LeaderBoard')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(subtitleScale);
        
        // Run the function to retrive data
        // CUrrent issue -- ERROR: Unable to fetch data for top asteroid players
        getTopAsteroidPlayers();
        
        // TODO: Parse retrieved Data - 5 players will be return
        // TODO: Dynamically Display data

        // Under construction
        const constructionText = this.add.bitmapText(width / 2, 350, 'retro_gaming', 'Under Construction')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(subtitleScale);
        
        
        // Back Button
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

// Retrive data to be displayed via async func
async function getTopAsteroidPlayers(req, res) {
    try {
        const response = await fetch('/asteroid');
        if (response.status != 200) {
            console.log("ERROR: Issue with retreiving data");
        }
        const data = await response.json();
        console.log("success", data);
        //Top 5 players retrieved
        return data;
    } catch (error) {
        console.log("ERROR: Unable to fetch data for top asteroid players", error);
    }
}