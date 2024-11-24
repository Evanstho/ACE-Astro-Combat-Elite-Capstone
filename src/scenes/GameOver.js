import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    // Pass in data from AsteroidMode
    init(data) {
        this.score = data.score;
        this.timeSurvived = data.timeSurvived;
    }

    create() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;
        const unhighlightedColor = 0x00ff00; 
        const highlightedColor = 0xffffff; 

        // Title text
        this.add.bitmapText(width / 2, 100, 'retro_gaming', 'GAME OVER')
            .setOrigin(0.5)
            .setTint(unhighlightedColor)
            .setScale(3.0);

        // Score text
        this.add.bitmapText(width / 2, 200, 'retro_gaming', `Score: ${this.score}`)
            .setOrigin(0.5)
            .setTint(unhighlightedColor)
            .setScale(2.0);

        // Time survived text
        this.add.bitmapText(width / 2, 300, 'retro_gaming', `Time Survived: ${this.timeSurvived}`)
            .setOrigin(0.5)
            .setTint(unhighlightedColor)
            .setScale(2.0);

        // Play Another Round button
        const playAgainButton = this.add.rectangle(width / 2, 400, 300, 60)
            .setStrokeStyle(3, unhighlightedColor)
            .setInteractive()
            .on('pointerover', () => {
                playAgainButton.setStrokeStyle(3, highlightedColor);
                playAgainText.setTint(highlightedColor);
            })
            .on('pointerout', () => {
                playAgainButton.setStrokeStyle(3, unhighlightedColor);
                playAgainText.setTint(unhighlightedColor);
            })
            .on('pointerdown', () => {
                this.scene.start('AsteroidShootout');
            });

        const playAgainText = this.add.bitmapText(width / 2, 400, 'retro_gaming', 'Play Another Round')
            .setOrigin(0.5)
            .setTint(unhighlightedColor);
        
        //Submit Score
        //TODO: add a route to submit score
        const submitScoreButton = this.add.rectangle(width / 2, 500, 300, 60)
            .setStrokeStyle(3, unhighlightedColor)
            .setInteractive()
            .on('pointerover', () => {
                submitScoreButton.setStrokeStyle(3, highlightedColor);
                submitText.setTint(highlightedColor);
            })
            .on('pointerout', () => {
                submitScoreButton.setStrokeStyle(3, unhighlightedColor);
                submitText.setTint(unhighlightedColor);
            })
            .on('pointerdown', () => {
                console.log('Score submission page');
                this.scene.start('scoreSubmissionScene', {score: this.score, time:this.timesurvived});
            });
        
        const submitText = this.add.bitmapText(width / 2, 500, 'retro_gaming', 'Submit Score')
            .setOrigin(0.5)
            .setTint(unhighlightedColor);

        // Back to Mode Selector button
        const backButton = this.add.rectangle(width / 2, 600, 300, 60)
            .setStrokeStyle(3, unhighlightedColor)
            .setInteractive()
            .on('pointerover', () => {
                backButton.setStrokeStyle(3, highlightedColor);
                backText.setTint(highlightedColor);
            })
            .on('pointerout', () => {
                backButton.setStrokeStyle(3, unhighlightedColor);
                backText.setTint(unhighlightedColor);
            })
            .on('pointerdown', () => {
                this.scene.start('ModeSelectorScreen');
            });

        const backText = this.add.bitmapText(width / 2, 600, 'retro_gaming', 'Back to Mode Selector')
            .setOrigin(0.5)
            .setTint(unhighlightedColor);
    }
}
