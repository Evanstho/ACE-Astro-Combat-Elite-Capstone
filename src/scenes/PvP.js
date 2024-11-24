"use strict" ; 
import Phaser from "phaser";
import { Ship } from "../classes/ship";
import { Projectile } from "../classes/projectile";
import {io} from "socket.io-client";
import { Deque } from '@datastructures-js/deque';

export class PvPScene extends Phaser.Scene{
    constructor(){
        super("PvPScene") 

        // Networking and State synchroniztion         
        this.socket = null;
        this.TICKRATE = 100 // server's send rate, the client expects updates every 100ms roughly 
        this.updates = { };
        this.timeSinceLastUpdate = 0;
        this.moveBuffer = new Deque();
        this.over = false;
        this.winner = null;

        // Local Player State Management
        this.player_id = null ; // local player's public id/uuid
        this.localPlayer = null ; //reference to the local player's sprite 
        this.players = { }; // holds references to all sprites local and remote for the server to manipulate
        this.projectileMap = new Map();

        // fire rate cap  
        this.clickCooldown = 500 // TODO: set click fire rate maximum through further playtests 
        this.lastTimeClicked = 0;
        this.justClicked = false;
        this.flash = null;
    }   
    
    init (player_choices){
        const localhost = "http://localhost:2766"
        const SERVER_URL = import.meta.env.VITE_SERVER_URL; // alternative server URL For testing
        try{
            this.socket = io(localhost, {
                reconnect : false // TODO: for now we don't allow reconnections
            });

            this.socket.on("connect",() => {
                console.log("Connected to server");
            });

        } catch (error) {  
            console.error(`Failed to connect to game server: ${error}`);
            // TODO : Tell the player the connection failed somehow
            this.scene.start("LobbyScene");
        } 
        
        this.socket.on("game_full",() => {
            // TOOD: add some message to the scene to tell the player the game is full
            console.log("Game is currently full, returning to lobby");
            this.socket.disconnect();
            this.scene.start("LobbyScene");
        });
        const choices = {
            "chosen_room":player_choices.room_number,
            "ship_choice" :player_choices.ship_selection
        };
        this.socket.emit("join_room", choices);

        // give the local player control of their ship 
        this.socket.once("init_self", (local_player_number) => {
            this.player_id = local_player_number;
        });
    }


    create() {
        /*************************** WORLD INITIALIZATION **************************************/ 
        this.starfield = this.add.sprite(0, 0, 'starfield').setOrigin(0, 0);
        this.starfield.play('twinkle');
        this.socket.once("init_world", (initializedPlayers) => {

            this.ship_outline  = this.add.graphics();
            const waiting_text = this.add.text(100,0,"Starting game ...", { /*fontFamily: 'Arial',*/ fontSize: 50, color: '#00ff00' });
            for (let player_id in initializedPlayers){
                const init_ship = initializedPlayers[player_id]; 
                const {uuid, x ,y ,ship_sprite} = init_ship ;

                const newPlayerShip = new Ship(this, x, y, ship_sprite,true)
                    .setCollideWorldBounds(true)
                    .setOrigin(0.5,0.5);

                if (uuid === this.player_id){  // tell the scene/ this player which ship is their own to control
                    this.localPlayer = newPlayerShip ; 
                    this.ship_outline.lineStyle(2, 0xffffff);
                    // identify the local player with a white box
                    const shipBounds = this.localPlayer.getBounds()
                    this.ship_outline.strokeRect(shipBounds.x , shipBounds.y,  shipBounds.width, shipBounds.height);
                    newPlayerShip.addHealthBar(this, 5,10);
                } else {
                    // the other's player healthbar is in the top right 
                    newPlayerShip.addHealthBar(this, 1215, 10); 
                }
                this.players[player_id] = newPlayerShip ;
            }

            // clear the outlines on the this player's ship once they start moving 
           this.input.keyboard.on("keydown" ,() => {
                this.ship_outline.clear() ;
                waiting_text.setVisible(false);
            });

            this.input.on("pointermove", () => {
                this.ship_outline.clear() ;
                waiting_text.setVisible(false);
            });

            this.flash = this.add.sprite(this.localPlayer.x, this.localPlayer.y, 'flash').setVisible(false);
            this.flash.setScale(.3);
            this.anims.create({
                    key: 'zap',
                    frames: this.anims.generateFrameNumbers('flash', { start: 0, end: 3 }), 
                    frameRate: 60,
                    hideOnComplete: true,
                    repeat: 0 // play only once
            });
            
        });
        
        // buffer the updates into this.updates for the update() function to play them
        // out in a way that looks nice 
        this.socket.on("update", ( updates, server_timestamp, over, winner) => {
            // buffers server updates so interpolation can be applied
            this.updates = updates ;
            this.over = over;
            this.timeSinceLastUpdate = Date.now() - server_timestamp;
            this.winner = winner;
        });
        
        // return the player to the lobby if the game is full
        this.socket.on("game_full",() => {
            console.log('Chosen game was full, returning to lobby');
            this.socket.disconnect();
            this.scene.start("LobbyScene");
        })

   
        /*************************** SETTING UP INPUT TRACKING KEYS **************************************/ 
        this.lstrafe = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rstrafe = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.forward = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.backward = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.pointer =  this.input.activePointer;


        this.input.on('pointerup', (pointer) => {
            // TODO: reset ability to click somehow 
            this.justClicked = false ;
        });

        /***************************** Projectile Pool Creation ***********************/
        this.projectiles = this.physics.add.group({
            classType: Projectile,
            runChildUpdate: true, // allows calling update on projectiles
        });


		if (this.localPlayer){
			this.flash = this.add.sprite(this.localPlayer.x, this.localPlayer.y, 'flash').setVisible(true);
        	this.flash.setScale(.3);
        	this.anims.create({
                	key: 'zap',
                	frames: this.anims.generateFrameNumbers('flash', { start: 0, end: 3 }), 
                	frameRate: 60,
                	hideOnComplete: true,
                	repeat: 0 // play only once
        	});
		}


    }    


        

    
    
    update(time, delta){
        if (!this.localPlayer) return;

        const delta_seconds = 1/60; // this seems to perform better overall than using the player's local delta
        const inputs = {
            "W" : this.forward.isDown,
            "S" : this.backward.isDown,
            "A" : this.lstrafe.isDown,
            "D" : this.rstrafe.isDown,
            "timestamp": Date.now(),
            "delta_seconds": delta_seconds,
        };


        const angleToPointer = Phaser.Math.Angle.BetweenPoints(this.localPlayer, this.pointer);
        if (this.pointerChanged(this.localPlayer.rotation, angleToPointer, 1) === true ) {
            inputs["rotation"] = angleToPointer;
        }

        if (this.pointer.leftButtonDown() && !this.justClicked && this.clickOffCooldown()){
            inputs["shooting"] = true;
            this.lastTimeClicked = this.time.now;
            this.justClicked = true;

            // sound and muzzle flash per shot 
            this.sound.play('laserSound', { volume: 0.2 });
            const gap = 40;                             
            const cosAngle = Math.cos(this.localPlayer.rotation);
            const sinAngle = Math.sin(this.localPlayer.rotation);
            const offsetX = cosAngle * gap;
            const offsetY = sinAngle * gap;
            this.flash.setRotation(this.localPlayer.rotation + Phaser.Math.DegToRad(90));
            this.flash.setPosition(this.localPlayer.x + offsetX, this.localPlayer.y + offsetY).setVisible(true);
            this.flash.play('zap');

        }
        
        const input_detected = (inputs["W"] || inputs["S"] || inputs["A"] || inputs["D"] || inputs["rotation"] || inputs["shooting"]) ? true : false;

        if (input_detected) {
            this.applyMove(inputs);
            this.socket.emit("input_packet", inputs);
            this.moveBuffer.pushBack(inputs);
        } 

        // apply updates to updates buffer
        this.handleUpdates(this.updates, this.timeSinceLastUpdate);

        // interpolate the remote players over 100 ms 
        for (let [uuid,player] of Object.entries(this.players)){
            if (uuid !== this.player_id){
                this.interpolatePosition(player, delta);
            }
        } 

        // all existing bullets get interpolated for motion between server udpates
        for (let [uuid, projectile] of this.projectileMap){

            this.interpolatePosition(projectile, delta); 

            if (projectile.spent === true && projectile.owner === this.player_id){
                this.sound.play("ship_hit",{volume : 0.2});
            }

            if (!projectile.alive){
                projectile.setVisible(false);
                projectile.setActive(false);
                this.projectileMap.delete(uuid);
            }
        }
        
    }

   
    


    handleUpdates(updates, elapsedTime){
        for (const [uuid, newObjectState] of Object.entries(updates)){
            const {
                x, y, rotation, CMD, // all drawn game objects
                health, alive,  csp_timestamp, powerups, // player-only attributes
                owner
            } = newObjectState;
            
            // how/what gets applied in an updates depends on what type of gameObject this is PLYR, BLLT etc.
            switch(newObjectState.type) { 

            case "PLYR":
                const player_ship = this.players[uuid];
                // if the uuid matches this.player_id we are manipulating the sprite/body the player who owns the scene 
                if (!alive){

                }

                if (uuid === this.player_id){
                    // Reconciliation : set authoritative state
                    if (rotation) player_ship.setRotation(rotation);
                    if (x) player_ship.setX(x);
                    if (y) player_ship.setY(y);

                    // discard all moves the server accounted for already
                    // essentially every move older than the csp timestamp this client gave the server last
                    while (!this.moveBuffer.isEmpty()  && this.moveBuffer.front().timestamp <= csp_timestamp)
                        this.moveBuffer.popFront();
                        //console.log("Clearing move buffer")

                    // reapply not yet verified inputs for local player
                    // reuse client side prediction moves pending server verification to keep movement responsive
                    for (const move of this.moveBuffer.toArray())
                        //console.log("Reapplying moves","move timestamp",move.timestamp, "return timestamp",csp_timestamp);
                        this.applyMove(move);
                    
                } else {
                    // here we manipulate remote players/enemy ships, we set their interpolation course to play out in update()
                    if (rotation) player_ship.setRotation(rotation); // rotations are instant 
                    // set interpolation parameters 
                    player_ship.oldX = player_ship.x;
                    player_ship.oldY = player_ship.y;
                    if(x) player_ship.newX = x || player_ship.x;
                    if(y) player_ship.newY = y || player_ship.y;
                    player_ship.progress = 0 ;
                }                        

                if(health){
                    const hit_player = this.players[uuid];
                    hit_player.setHealth(health);
                }
                break;

            case "BLLT":
                if (!this.projectileMap.has(uuid)){
                    // create a new bullet based on server command 
                    // not sure if new Bullet() is better or worse than projectiles.get(x,y) from the pool 
                    const new_bullet = new Projectile(this, x, y, owner);
                    this.projectileMap.set(uuid, new_bullet);
                    new_bullet
                        .setRotation(rotation + Phaser.Math.DegToRad(90))
                        .setActive(true)
                        .setVisible(true);
                } else {

                    const bullet_sprite = this.projectileMap.get(uuid);
                    if (CMD === "D")  bullet_sprite.alive = false;
                    if (CMD === "H")  {
                        bullet_sprite.spent = true;
                        bullet_sprite.alive = false;
                    }
                    bullet_sprite.oldX = bullet_sprite.x;
                    bullet_sprite.oldY = bullet_sprite.y;
                    bullet_sprite.newX = x || bullet_sprite.x;
                    bullet_sprite.newY = y || bullet_sprite.y;
                    bullet_sprite.progress = 0 ;
                } 
                break;
            }
        }
        this.updates = { }; // discard the updated states we just applied and wait for new ones 

        if (this.over === true){
            console.log("Ending game");
            this.socket.disconnect()
            if (this.player_id === this.winner){
                this.scene.start("PvPGameOver", {"outcome" : true})
            } else {
                this.scene.start("PvPGameOver", {"outcome" : false})
            }
            this.resetGame();
            this.scene.stop();
            
        }
    }
        
    resetGame() {

        this.socket = null;
        this.updates = { };
        this.timeSinceLastUpdate = 0;
        this.moveBuffer = new Deque();
        this.over = false;
        this.winner = null;

        // Local Player State Management
        this.player_id = null ; // local player's public id/uuid
        this.localPlayer = null ; //reference to the local player's sprite 
        this.players = { }; // holds references to all sprites local and remote for the server to manipulate
        this.projectileMap = new Map();

        // fire rate cap  
        this.lastTimeClicked = 0;
        this.justClicked = false;
    }

    applyMove(inputs){
        // applies a single movement to the ship owned by the local player in this scene  using the input defined
        // a move can be applied for CSP or reapplied for reconciliation after an update
        const { rotation , delta_seconds} =  inputs ;
        const velocity =  200; // TODO: vary vertical and horizontal velocity 
        if (inputs["A"]) this.localPlayer.setX((this.localPlayer.x - (delta_seconds * velocity)));
        if (inputs["D"]) this.localPlayer.setX((this.localPlayer.x + (delta_seconds * velocity)));
        if (inputs["W"]) this.localPlayer.setY((this.localPlayer.y - (delta_seconds * velocity)));
        if (inputs["S"]) this.localPlayer.setY((this.localPlayer.y + (delta_seconds * velocity)));
        if (rotation) this.localPlayer.setRotation((rotation));
    }
  
    pointerChanged(currentRotation, angleToPointer, threshold){
        // detects a significant pointer change (if the change is above the threshold)
        return Math.abs(angleToPointer - currentRotation) > Phaser.Math.DegToRad(threshold);
    }
    
    clickOffCooldown(){
        // click cooldown
        return this.time.now - this.lastTimeClicked >= this.clickCooldown;
    }

    interpolatePosition(object, delta, duration = 100){
        // interpolates position of a game object over a set duration defaulted to 100ms since that's our server send rate
        // this function assumes each object has x,y as attributes as well as oldX/oldY newX/newY
        object.progress += delta;
        const t = Phaser.Math.Clamp(object.progress/duration, 0, 1);
        object.x = Phaser.Math.Linear(object.oldX, object.newX, t);
        object.y = Phaser.Math.Linear(object.oldY, object.newY, t);
        if (t === 1){ 
            object.progress = 0;
            object.oldX = object.x;
            object.oldY = object.y;
        }        
    }
    
    
}

