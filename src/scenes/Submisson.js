import Phaser from 'phaser';

export class scoreSubmissionScene extends Phaser.Scene {
    constructor() {
        super("scoreSubmissionScene")
    }

    init(data) {
       this.time = data.time;
        this.score = data.score;
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
        
        // submission header
        const submissionText = this.add.bitmapText(width / 2, 200, 'retro_gaming', 'Enter your name below')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(subtitleScale);
        
        // TODO: Get input name data
    
        //under construction
        const constructionText = this.add.bitmapText(width / 2, 350, 'retro_gaming', 'Under Construction')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(subtitleScale);
        


        //submit Button
        const submitButton = this.add.rectangle(width / 2, 650, rectWidth, rectHeight)
            .setStrokeStyle(strokeWidth, unhighlightedColor)
            .setInteractive()
            .on('pointerover', () => {
                submitButton.setStrokeStyle(strokeWidth, highlightedColor);
                submitText.setTint(highlightedColor); // set text to white
            })
            .on('pointerout', () => {
                submitButton.setStrokeStyle(strokeWidth, unhighlightedColor);
                submitText.setTint(unhighlightedColor); // set text back to green
            })
            .on('pointerdown', async () => {
                console.log('pointer down sending data');
                
                // data containing user info from Asteroid Mode
                // Current Issue: 404 - "An error occured when attempting to SENDthe data"
                // Notes: Most likely due to connection issue
                const data = {
                    name: 'Playername',  //place holder
                    time: this.time,
                    asteroid_score: this.score
                };

                try {
                    //call the route
                    const response = await fetch('/add-asteroid', {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    //Check response
                    if (response.status != 201) {
                        console.log("ERROR: An error occured with sending the data", reponse.status);
                    }
                //Error catching
                } catch (error) {
                    console.log('An error occured when attempting to SEND the data')
                }

            this.scene.start('ModeSelectorScreen');
            });//pointerdown
                
        const submitText = this.add.bitmapText(width / 2, 650, 'retro_gaming', 'Submit', 24)
        .setOrigin(0.5)
        .setTint(unhighlightedColor);
    
        //Back Button
        const cancelButton = this.add.rectangle(1150, 650, rectWidth, rectHeight)
            .setStrokeStyle(strokeWidth, unhighlightedColor)
            .setInteractive()
            .on('pointerover', () => {
                cancelButton.setStrokeStyle(strokeWidth, highlightedColor);
                cancelText.setTint(highlightedColor); // set text to white
            })
            .on('pointerout', () => {
                cancelButton.setStrokeStyle(strokeWidth, unhighlightedColor);
                cancelText.setTint(unhighlightedColor); // set text back to green
            })
            .on('pointerdown', () => {
                console.log('settings chosen');
                this.scene.start('ModeSelectorScreen');
            });

        const cancelText = this.add.bitmapText(1150, 650, 'retro_gaming', 'Cancel', 24)
        .setOrigin(0.5)
        .setTint(unhighlightedColor);
    }
}    