import { RectangleBody } from "./SATCollision.js";
import { shipDimensions, bulletDimensions } from "./shipInfo.js";
/**
 * TODO : powerups ?
 * On powerups vs game objects
 * A powerup can be a game object if it is attainable in game such as the player flying over it
 * for now we will limit game objects to just simple moving rendered objects that server needs to control
 */

class GameObject{
    // Game Objects are things that are drawn to the screen and need to be tracked with unique ids 
    constructor(uuid, x, y, type){   
        this.uuid = uuid;
        this.x = x;
        this.y = y;
        this.active = true ;
        this.type = type;
    }

    get_uuid () {
        // returns a universal unique identifier on a game object so each client knows what object to draw/move where 
        return this.uuid ;
    }
     
    get_type(){
        // returns a 4 character type (ex: BLLT, PLYR, MISL, ASTR)so the server knows immediately how to deal with this object
        return this.type ;
    }

    is_active() {
        // might be redundant but maybe this is useful as a catch all way to know which objects should be destroyed/cleared from game and screen
        return this.active ;
    }

}

export class Player extends GameObject {
    // Here a player and a ship are one and the same
    constructor(uuid, x, y, ship_sprite){
        super(uuid, x, y, "PLYR") // fourth argument is type tag used by frontend 
        this.uuid = uuid;
        this.x = x;
        this.y = y;
        this.rotation = 4.71239 ;
        this.health = 100;
        this.accel = 0;
        this.velocity = 0 ;
        this.alive = true ;
        this.lives = 3;
        this.score = 0 ; 
        this.ship_sprite = ship_sprite;
        this.weapons = [] ;
        this.powerups = [];
        this.body = new RectangleBody(
            x, y,
            shipDimensions[this.ship_sprite].width,
            shipDimensions[this.ship_sprite].height,
            this.rotation
        );
        this.lastFired = 0 ; // ms since the last projectile was fired by this player
    }

    getHealth(){
        return this.health;
    }


	setRotation(rotation){
		this.rotation = rotation;
		this.body.rotate(rotation);
	}

	setScore(){

	}

} 


export class Bullet extends GameObject{
    constructor(uuid, owner, x, y, rotation){
        super(uuid, x, y, "BLLT")
        this.owner = owner ;
        this.rotation = rotation;
        this.firstIter = true; // marker so on creation a bullet only goes forward 1/2RTT
        this.body = new RectangleBody(
            x, y,
        	bulletDimensions.width,
			bulletDimensions.height,
            rotation  + Math.PI/2
        );
        // bullets translate as they move through the game but never change rotation so we don't use this.body.rotate() for them
    }
    

    getOwner(){
        return this.owner 
    }

    // projectiles are all controlled by the server
    // 1/10 represents the smallest unit distance(pixels) in the smallest time duration for the server 100ms/1000ms
    // this function returns false if the projectile goes ouf of known bounds 
    advancePos(duration, velocity = 500){ 
      this.x += Math.cos(this.rotation) * velocity * duration;
      this.y += Math.sin(this.rotation) * velocity * duration;
      this.body.translate(this.x,this.y);
    //   if (this.x < 0 || this.x > 1300  || this.y < 0 || this.y > 720){
    //     return false;
    //   }
      if (this.x < -100 || this.x > 1400 || this.y < -100 || this.y > 820){
        return false;
      }
      return true;
    }
}


export class Missile extends GameObject{
      constructor(uuid, x, y){
        super(uuid, x, y,"MISL")
    }
}

export class Asteroid extends GameObject{
      constructor(uuid, x, y){
        super(uuid, x, y,"ASTR")
    }
}



function rand(min, max) {
    // returns a random integer between min and max 
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
}
