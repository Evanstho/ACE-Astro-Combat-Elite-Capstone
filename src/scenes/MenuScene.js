import Phaser from "phaser";


// TODO class is unused for now 
export class MenuScene extends Phaser.Scene {
    init() {
        console.log('MenuScene initialized');
    }

    preload() {

    }

    create() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;

        // title text
        this.add.text(width / 2, 100, 'A.C.E.', { 
            font: '96px Arial', 
            fill: '#00ff00' 
        }).setOrigin(0.5);

        // subtitle text
        this.add.text(width / 2, 160, 'Astro Combat Elite', { 
            font: '32px Arial', 
            fill: '#00ff00' 
        }).setOrigin(0.5);

        // start Game button
        const startButton = this.add.text(width / 2, height / 2, 'Start Game', { 
            font: '24px Arial', 
            fill: '#00dd00', 
            stroke: '#00dd00', 
            strokeThickness: 1,
            padding: 10 
        })  .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                console.log("Start Game clicked");
                this.scene.start('game');
            })
                .on('pointerover', () => startButton.setStyle({ fill: '#00ff00', stroke: '#00ff00' }))
                .on('pointerout', () => startButton.setStyle({ fill: '#00dd00', stroke: '#00dd00' }));

        // settings button
        const settingsButton = this.add.text(width / 2, height / 2 + 50, 'Settings', { 
            font: '24px Arial', 
            fill: '#00dd00', 
            stroke: '#00dd00', 
            strokeThickness: 1,
            padding: 10 
        })  .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => settingsButton.setStyle({ fill: '#00ff00', stroke: '#00ff00' }))
            .on('pointerout', () => settingsButton.setStyle({ fill: '#00dd00', stroke: '#00dd00' }));
                // event listener for settings scene tbd
    }
}