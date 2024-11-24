import Phaser from "phaser";
export class PvPGameOver extends Phaser.Scene{

    constructor(){
        super("PvPGameOver")
        this.winner = null;
    }

    init(winner){
        this.winner = winner.outcome;
    }

    create(){
        this.add.text(600,10, "Round Over", { /*fontFamily: 'Arial',*/ fontSize: 50, color: '#00ff00'} );

        const lobbyText = this.add.bitmapText(-50, -15, "retro_gaming","Back to Lobby")
            .setTint(0x00ff00);
        const lobbyButton = this.add.rectangle(0, 0, 150, 50)
            .setInteractive()
            .setStrokeStyle(3, 0x00ff00)
            .on("pointerover",() => {
                lobbyButton.setStrokeStyle(2,0xffffff)
            })
            .on("pointerout",() => {
                lobbyButton.setStrokeStyle(3, 0x00ff00)
            })
            .on("pointerdown",() => {
                this.scene.start("ShipSelectionMultScene");
            });
        const lobbyButtonContainer  = this.add.container(1140,50,[lobbyText, lobbyButton]);


        const ModeSelectorText= this.add.bitmapText(-50, -15, "retro_gaming","Mode Selection")
            .setTint(0x00ff00);
        const ModeSelectorButton = this.add.rectangle(0, 0, 150, 50)
            .setInteractive()
            .setStrokeStyle(3, 0x00ff00)
            .on("pointerover",() => {
                ModeSelectorButton.setStrokeStyle(2,0xffffff)
            })
            .on("pointerout",() => {
                ModeSelectorButton.setStrokeStyle(3, 0x00ff00)
            })
            .on("pointerdown",() => {
                this.scene.start("ModeSelectorScreen");
       
            });
        const ModeSelectorContainer = this.add.container(1140,125,[ModeSelectorButton, ModeSelectorText]);

        

        if (this.winner === true){
            this.add.text(600,360,"Well fought.", { fontSize: 50, color: '#00ff00' });


        } else {
            this.add.text(600, 360,"Better luck in \nthe next battle.", { fontSize: 50, color: '#00ff00' });

        }

    }


}