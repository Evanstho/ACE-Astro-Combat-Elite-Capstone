export class GameRoom {
    constructor(roomId){
        // Game rooms
        this.roomdId = roomId;
        this.playerCount = 0; // 2 is default max for testing the 1v1 Mode
        this.timestamp = 0 ; // last known timestamp of inputs run/verified
        this.id_map = {};
        this.updates = {};
        this.status = "needs player";
        this.players = {};
        this.projectiles = new Map();
        this.maxPlayers = 2 ; // this can be made a constructor parameter to make different game modesk
        this.over = false;
        this.winner = null;
        this.gameMode = null
    }

    isFull(){
        return this.playerCount === this.maxPlayers;
    }

    addPlayer(uuid, player){
        this.players[uuid] = player;
        this.playerCount++;
        if (this.isFull) this.status = "ongoing";
    }

   removePlayer(socketId){
        // Removes all tracking on a player both client and server side given their socket.id
        // Removes their socket.id from the id_map
        // Removes the their ship gameObject from this.players
        
        this.playerCount--;
        delete this.players[this.id_map[socketId]];
        delete this.id_map[socketId];

   } 

   addPlayerProxy(){
    // maps socket.id to a UUID which corresponds toa sprite/ship client side
   }

}

