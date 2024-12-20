"use strict" 
import express from 'express';
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player ,Bullet } from "./GameObjects.js";
import { GameRoom } from "./Room.js";
import { v4 as uuidv4 } from 'uuid';

const cors_options = { origin : "*", methods: ["GET"] } ;
const app = express();
app.use(cors(cors_options))
const server = createServer(app);
const io = new Server(server, { cors: cors_options });


const PORT = 2766; 
const TICKRATE = 10; // This is adjustable 20 is good so far with interpolation client side
const SEND_INTERVAL = Math.ceil(1000/TICKRATE);
const gameRooms = { };


setInterval(() => {
  // for loop that sends out updates to every game room that can be found 
  for (const [roomId, game] of Object.entries(gameRooms)){

    
    // for loop that handles continuous simulation of server managed game objects like projectiles 
    for (let [projectile_uuid,projectile] of game.projectiles){
      // if this projectile just spawned it should only go forward 1/2 RTT so 1/20 instead of 1.20 
      const duration = projectile.firstIter? 1/20 : 1/10; 
      const inBounds = projectile.advancePos(duration);
      if (projectile.firstIter) projectile.firstIter = false;  

	if(!inBounds){
        console.log("Deleting OOB projectile",projectile.x,projectile.y);
        projectile.CMD = "D"; // D for destroy object because OOB 
        game.projectiles.delete(projectile.get_uuid());
		continue;
      }

      //collision checking remember there are only two players in a game so O(1) for this loop
	  const players_arr = Object.entries(game.players);
      for(const [player_uuid,player] of players_arr){
        if ((player_uuid !== projectile.getOwner()) && (projectile.body.testCollision(player.body) === true || distance(projectile,player) <= 20)){

            projectile.CMD = "H"; // H here means hit 
			projectile.advancePos(duration);
            game.projectiles.delete(projectile.get_uuid());
            player.health -= 10 ;
            if (game.updates[player_uuid]){
				game.updates[player_uuid]["health"] = player.health;
            } else {
				game.updates[player_uuid]  = {"type":"PLYR","health":player.health};
            }

			if (player.health < 0) {
				game.over = true;
				game.winner = projectile.getOwner();
			}
        } 
      }
      game.updates[projectile.uuid] = projectile;

    } 

	/**
	 * Send out the accumulated updates to all games 
	 */
    if (Object.entries(game.updates).length > 0) { 
        io.to(roomId).emit("update", game.updates, Date.now(), game.over, game.winner );
		if (game.over === true) {
			delete gameRooms[roomId];
		}
        game.updates = { };
    }
  }


}, SEND_INTERVAL);


io.on("connection", (socket) => {
  console.log(`new player:${socket.id}  connected from IP:${socket.handshake.address}`); 

  /** if the room does not yet exist it's created since at least player chose it 
   *  we set up tracking info for the room which holds a reference to the Headless Phaser instance 
   *  that tracks the authoritative state
   *  gameRooms = roomId -> Room()  ex: room2 -> Room(roomId, playerCount, timestamp) etc
   */ 
  socket.on("join_room", (player_choices) => { 
    const {chosen_room, ship_choice} = player_choices;

    if (!gameRooms[chosen_room]){
      gameRooms[chosen_room] = new GameRoom(chosen_room);
      console.log("creating room:",chosen_room);
      // TODO : if we do multiple game modes this would be the time to grab that info 
    } else if (gameRooms[chosen_room].isFull()){
        socket.emit("game_full");
        socket.disconnect();
        return;
    } else {
        console.log(`Adding last player ${socket.id} to start game in ${chosen_room}`);
    }
 
      const thisRoom = gameRooms[chosen_room];
      const new_uuid = uuidv4();
      const starting_x = thisRoom.playerCount === 0 ? 60 : 1240;
      const new_player = new Player(
        new_uuid, // unique and autogenerated
        starting_x,
        340, // each ship starts roughly halfway down the Y axis 
        ship_choice
      ); 
      
      thisRoom.addPlayer(new_uuid,new_player);
      thisRoom.id_map[socket.id] = new_uuid;// socket.id:'23df12po2938721kj' -> uuid: 'fd908213098120' socket ids are private
      socket.join(chosen_room);
      console.log(`Joining player ${socket.id} to their chosen room -> ${chosen_room}`);


      io.to(socket.id).emit("init_self", thisRoom.id_map[socket.id]);
      if(thisRoom.isFull()){  
        console.log("Starting World -> \n",thisRoom);
        io.to(chosen_room).emit("init_world",thisRoom.players);
      } else { 
        io.to(chosen_room).emit("waiting", thisRoom.playerCount);
      }
    }); 

  
  
  // Each socket knows which room they were put in by their internal socket.rooms set 
  // Since we put every socket/player in a number room on joining
  // We can now assume their socket.rooms remembers which room they are in 
  socket.on("input_packet", (inputs) => {
    const roomId = findRoom(socket);  
    const thisRoom = gameRooms[roomId];


    if (!thisRoom){
      console.log("Inputs sent to a non-existent/deleted room no inputs will be applied, exiting operation......"); 
      socket.disconnect();
      return ;
    }
    const player_uuid = thisRoom.id_map[socket.id]
    const player_ship = thisRoom.players[player_uuid]; 

    if (!player_ship.alive === true){
      console.log(`Inputs can not be executed/validated, player is already dead: ${thisRoom.id_map} ${thisRoom.players}`);
    }




    const {W, A, S, D, timestamp, rotation, shooting } = inputs;
    const velocity = 200;
    const strafeVelocity = 100;
    const delta_seconds = 1/60;
    // csp timestamp is used to clear the player's local buffered moves that got accounted for below 
    const new_state = {
      "type": "PLYR", 
      "csp_timestamp": timestamp
    }


    if (W){
      const requested_y = (player_ship.y - (velocity * delta_seconds))  
      player_ship.y =
        requested_y > 720 ? 720:
        requested_y < 0 ? 0:
        requested_y;
      new_state.y = player_ship.y;
      player_ship.body.translate(player_ship.x,player_ship.y)
    }
    if (S){
      const requested_y = (player_ship.y + (velocity * delta_seconds))  
      player_ship.y =
        requested_y > 720 ? 720:
        requested_y < 0 ? 0:
        requested_y;
      new_state.y = player_ship.y;
      player_ship.body.translate(player_ship.x,player_ship.y)
    }

    if (A){
      const requested_x = player_ship.x - (velocity * delta_seconds);
      player_ship.x =
        requested_x > 1300 ? 1300:
        requested_x < 0 ? 0:
        requested_x;
      new_state.x = player_ship.x;
      player_ship.body.translate(player_ship.x,player_ship.y)
    }

    if (D){
      const requested_x = player_ship.x + (velocity * delta_seconds);
      player_ship.x =
        requested_x > 1300 ? 1300 :
        requested_x < 0 ? 0:
        requested_x;
      new_state.x = player_ship.x;
      player_ship.body.translate(player_ship.x,player_ship.y)
    }

    // rotation can't be invalid so it doesn't need correction
    if (rotation){
        new_state["rotation"] = rotation;
        player_ship.setRotation(rotation);
    }

    // Add the new position to the room.updates object sent out every 100ms with setInterval
    if (shooting  && timestamp - player_ship.lastFired >= 500 ){
		player_ship.lastFired = timestamp;
		const bullet_uuid = uuidv4();

		const new_bullet = new Bullet(
        	bullet_uuid,
        	player_uuid, 
        	player_ship.x,
        	player_ship.y,
        	player_ship.rotation 
		);
		// TODO:  advance proejctile 1/2 RTT if it looks weird spawning client side 
		console.log(new_bullet.rotation);
		thisRoom.projectiles.set(bullet_uuid, new_bullet);
    }

    if (new_state) thisRoom.updates[player_uuid] = new_state;

  });


  
  socket.on('disconnecting', () => {
    /**
     * this fires right before socket.io deletes references to both the socket.io for the player and their room if it's empty now
     * both get saved to local variables here so that we can delete the player from the game they were in and notify other players
     * if the room is now empty we can delete it's identifier (room1, room2, room3) string from game_rooms so someone else can use it
     * if the roomId is not in our game_rooms or socket.io's socket.rooms() set the disconnect signal can be safely ignored 
	 * and we disconnect the socket
     */
    const socketId = socket.id;
    const roomId = findRoom(socket);
    const thisRoom = gameRooms[roomId];


    if (!thisRoom || !(socket.rooms).has(roomId)){
      console.log(` One of the following occured:\n
        1) A player attempted to join a full room and was auto-disconnected
        2) The final player in a game session left and the socket.io room was cleaned up\n
        Since there is no room clean up the server will simply proceed. \n
        Current Rooms: ${gameRooms}`);
      return ;
    }

    if (!thisRoom.status === "over"){
        console.log(socketId," has force quit the game prematurely");
    }

    // If the room exists and is in our rooms set tell everyone who left so their sprite is removed
    //io.to(roomId).emit("player_disconnect",thisRoom.id_map[socket.id]); 

    thisRoom.playerCount--;
    console.log("lowering player count",thisRoom.playerCount);
    
    delete thisRoom.players[thisRoom.id_map[socketId]];
    delete thisRoom.id_map[socketId];
    console.log("Attempting to cleanup id map and game objects for :","players map",thisRoom.players,"id_map",thisRoom.id_map);

    if (thisRoom.playerCount === 0){
      console.log(`Final player has left ${roomId}, the socket.io room is now gone and the reference to ${roomId} in gameRooms will be deleted/reset.`);
      delete gameRooms[roomId];
    } else {
      io.to(roomId).emit("player_disconnect",thisRoom.id_map[socket.id]); 
    }

  });


  socket.on("error",(error) => {
    // basic error logging which we hopefully do not need
    console.log(`An unexpected error occured during connection.\n
      error: ${error}\n
      client: ${socket.id}\n
      IP: ${socket.handshake.address}\n
      rooms : ${socket.rooms}\n

      `);

    });

  
  
}); // End PvP sockets/server 


server.listen(PORT, () =>{ 
  console.log(`= ${new Date(Date.now()).toString()} -- PvP Server listening for new games on Port: ${PORT}`);
});



//returns game room given player's socket object
const findRoom = (socket) => Array.from(socket.rooms).filter((room_id) => room_id != socket.id)[0] 


// returns status of live game rooms as requested by a player in the lobby 
app.get("/rooms", async (req,res) => {
  const allRooms = {};
  for (const [roomId, gameRoom] of Object.entries(gameRooms)){
    allRooms[roomId] = {
      "status" : gameRoom.status,
      "playerCount" : gameRoom.playerCount,
      "roomFull" : gameRoom.isFull()
    }
  }
  res.send(allRooms);

});


function distance (gameObj1, gameObj2){
  // returns distance between two game objects (Euclidean distance)
  return Math.sqrt(
    Math.pow((gameObj1.x - gameObj2.x), 2) +
    Math.pow((gameObj1.y - gameObj2.y), 2)
  );
}
   

function inDiameter(ship, projectile, sumRadii = 24){
  //  we use circular collision detection
  // when the distance is less than the sum of radii of two objects they are colildtin 
  // 5 is half the pixel width of a projectile and 19 the average radius of a ship
  return(distance(ship,projectile) <  5 + 19)
}