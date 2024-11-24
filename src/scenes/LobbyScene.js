import Phaser from "phaser";
import {io} from "socket.io-client";

export class LobbyScene extends Phaser.Scene{
    constructor(){
        super("LobbyScene");
        this.rooms = {};
    
    }
   

    init(ship_selection){
        this.socket = io("http://localhost:5316");
        this.socket.on("connect", () => {
             console.log("Contacting server for lobby status")
        });
        this.ship_choice = ship_selection.selection;

    }

    async create() {


        const refreshText = this.add.bitmapText(-50, -15, "retro_gaming","Click to \nRefresh Rooms")
            .setTint(0x00ff00);

        const refreshButton = this.add.rectangle(0, 0, 150, 50)
            .setInteractive()
            .setStrokeStyle(3, 0x00ff00)

            .on("pointerover",() => {
                refreshButton.setStrokeStyle(2,0xffffff)
            })
            .on("pointerout",() => {
                refreshButton.setStrokeStyle(3, 0x00ff00)
            })
            .on("pointerdown",() => {
                this.scene.start(this);
            });

        const refreshContainer = this.add.container(1140,50,[refreshText, refreshButton]);

        const width = this.sys.game.config.width;

        // "Back to ModeSelector" button
        const backButtonRectangle = this.add.rectangle(width / 2, 50, 400, 50)
            .setStrokeStyle(3, 0x00ff00)
            .setInteractive()
            .on('pointerover', () => {
                backButtonRectangle.setStrokeStyle(3, 0xffffff);
                backButtonText.setTint(0xffffff);
            })
            .on('pointerout', () => {
                backButtonRectangle.setStrokeStyle(3, 0x00ff00);
                backButtonText.setTint(0x00ff00);
            })
            .on('pointerdown', () => {
                console.log("Back to ModeSelector");
                this.scene.start("ModeSelectorScreen");
            });

        const backButtonText = this.add.bitmapText(width / 2, 50, 'retro_gaming', 'Back to Mode Selector', 24)
            .setOrigin(0.5)
            .setTint(0x00ff00);

        let y_offset = 220 ; // for the first 4  
        let x_offset = 210 // distance between each container and edge containers to wall 
        for(let i = 1 ; i < 9 ; i++){

            if (i > 4)  y_offset = 540;
            

            let container = this.add.container( (x_offset + ( ((i - 1) * 300) % 1200) ) , y_offset);

            let rectangle = this.add.rectangle(0,0, 220,260).setStrokeStyle(3, 0x00ff00).setInteractive();
            
            rectangle.setData("room_number",`room${i}`);// TODO : change to add multiple server ports 
            const this_room  = rectangle.getData("room_number");// string ex room1 
            container.add(rectangle) ;
            let text = this.add.text(0, 0, this_room, { /*fontFamily: '',*/ fontSize: 30, color: '#00ff00' });
            container.add(text);  
            text.setPosition(-85, -100)  // relative to container top left
            
            rectangle
                .on("pointerover",()=>{
                    rectangle.setStrokeStyle(2,0xffffff)
                })
                .on("pointerout",()=>{
                    rectangle.setStrokeStyle(3, 0x00ff00)
                })
                .on("pointerdown",() =>{
                    console.log("Chose ",rectangle.getData("room_number"))

                    this.socket.disconnect()
                    this.scene.start("PvPScene",{"room_number":rectangle.getData("room_number"), "ship_selection": this.ship_choice})

                   
                });
            this.rooms[this_room] = container; // save reference to container 
        }

        // TODO : make this periodic with setInteval 
        const response = await fetch("http://localhost:2766/rooms");
        const allRooms = await response.json() ;
        for (const [roomId, roomInfo] of Object.entries(allRooms)){
            const {playerCount,status, roomFull} = roomInfo;
            console.log(playerCount,status,roomFull)
            const room_container = this.rooms[roomId];
            let status_text = this.add.text(0, 0, status, { /*fontFamily: '',*/ fontSize: 32 , color: '#00ff00'} );
            let player_count = this.add.text(0, 0,`Players:${playerCount}`, { /*fontFamily: '',*/ fontSize: 32, color: '#00ff00'});
            room_container.add(status_text).add(player_count); 
            status_text.setPosition(-85,-50)
            player_count.setPosition(-85,-10)
        }

    

    }




}