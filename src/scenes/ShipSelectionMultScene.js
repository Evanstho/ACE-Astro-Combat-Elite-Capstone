import phaser from 'phaser';

export class ShipSelectionMultScene extends Phaser.Scene { 
    constructor() {
        super("ShipSelectionMultScene")
        this.ship = ""
    }
    
    create() {
        //starfield background 
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

        // Create ship image
        this.shipSelection = this.add.sprite(650, 375, 'shipSelection');
        this.shipSelection.setScale(.8)

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

        // Ship Selection Screen
        const subtitleText = this.add.bitmapText(width / 2, 50, 'retro_gaming', 'Ship Selection')
            .setOrigin(0.5)
            .setTint(0x00ff00)
            .setScale(subtitleScale);
        
        // place rectangles around all the ships
        let rectangle1 = this.add.rectangle(360, 190, 200, 120).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle1
            .on("pointerover", () => {
                rectangle1.setStrokeStyle(2, 0xffffff)

            })
            .on("pointerout", () => {
                rectangle1.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship1"
                console.log(`$(this.ship) selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });
        
        let rectangle2 = this.add.rectangle(560, 180, 150, 130).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle2
            .on("pointerover", () => {
                rectangle2.setStrokeStyle(2, 0xffffff)

            })
            .on("pointerout", () => {
                rectangle2.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship2"
                console.log(`$(this.ship) selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });
        
        let rectangle3 = this.add.rectangle(755, 190, 130, 170).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle3
            .on("pointerover", () => {
                rectangle3.setStrokeStyle(2, 0xffffff)

            })
            .on("pointerout", () => {
                rectangle3.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship3"
                console.log(`$(this.ship) selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });
        
        let rectangle4 = this.add.rectangle(935, 190, 130, 170).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle4
            .on("pointerover", () => {
                rectangle4.setStrokeStyle(2, 0xffffff)

            })
            .on("pointerout", () => {
                rectangle4.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship4"
                console.log(`$(this.ship) selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });
        
        let rectangle5 = this.add.rectangle(360, 345, 120, 130).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle5
            .on("pointerover", () => {
                rectangle5.setStrokeStyle(2, 0xffffff)
            })
            .on("pointerout", () => {
                rectangle5.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship5"
                console.log(`${this.ship} selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });
        
        let rectangle6 = this.add.rectangle(560, 330, 150, 160).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle6
            .on("pointerover", () => {
                rectangle6.setStrokeStyle(2, 0xffffff)
            })
            .on("pointerout", () => {
                rectangle6.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship6"
                console.log(`${this.ship} selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });
        let rectangle7 = this.add.rectangle(760, 360, 180, 110).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle7
            .on("pointerover", () => {
                rectangle7.setStrokeStyle(2, 0xffffff)
            })
            .on("pointerout", () => {
                rectangle7.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship7"
                console.log(`${this.ship} selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });

        let rectangle8 = this.add.rectangle(945, 365, 170, 130).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle8
            .on("pointerover", () => {
                rectangle8.setStrokeStyle(2, 0xffffff)
            })
            .on("pointerout", () => {
                rectangle8.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship8"
                console.log(`${this.ship} selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });
            
        
        let rectangle9 = this.add.rectangle(355, 525, 180, 120).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle9
            .on("pointerover", () => {
                rectangle9.setStrokeStyle(2, 0xffffff)

            })
            .on("pointerout", () => {
                rectangle9.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship9"
                console.log(`$(this.ship) selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });
        
        let rectangle10 = this.add.rectangle(565, 525, 150, 140).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle10
            .on("pointerover", () => {
                rectangle10.setStrokeStyle(2, 0xffffff)
            })
            .on("pointerout", () => {
                rectangle10.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship10"
                console.log(`${this.ship} selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });

        let rectangle11 = this.add.rectangle(760, 525, 160, 120).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle11
            .on("pointerover", () => {
                rectangle11.setStrokeStyle(2, 0xffffff)
            })
            .on("pointerout", () => {
                rectangle11.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship11"
                console.log(`${this.ship} selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });

        let rectangle12 = this.add.rectangle(940, 530, 150, 180).setStrokeStyle(3, 0x000000).setInteractive();

        rectangle12
            .on("pointerover", () => {
                rectangle12.setStrokeStyle(2, 0xffffff)
            })
            .on("pointerout", () => {
                rectangle12.setStrokeStyle(3, 0x000000)
            })
            .on("pointerdown", () => {
                this.ship = "ship12"
                console.log(`${this.ship} selected`);
                this.scene.start('LobbyScene', {selection: this.ship});
            });
        
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