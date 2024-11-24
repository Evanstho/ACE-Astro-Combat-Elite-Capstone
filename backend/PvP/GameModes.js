// specify the physics and starting values for each game mode here
// things like maximum velocity, lives, 
class GameMode {
    constructor(duration, num_players){
        this.duration = duration ;
        this.num_players = num_players;
        // TODO : maybe more is needed here but I am not sure what  
    }
}
export class Deathmatch_1v1 extends GameMode{
    // TODO : fine tune settings in the server then pplace them here 
    MAX_ROTATION_SPEED = 2098;// TOOD:placheholder
    MAX_ACCELERATION = 3892937;
    MAX_VELOCITY_Y =  200 ; // TOOD : placheholder 
    MAX_VELOCITY_X = 200 ;// TODO : placeholder



    calculate_rotation (){
    // return a valid rotation to update t

    }
    validate_position(x,y){
        // compare this x and y to 1300/0 720/0 the max bounds of the game 
    }

}

export const Deathmatch1v1Settings = {
    "health" : 100,
    "powerups" : [],
    "weapons": [],
    "MAX_VELOCITY_X" : 500,
    "MAX_VELOCITY_Y" :500, 
    "X_SPEED" : 300,
    "Y_SPEED" : 300, 
    "drag" : 0.3,
    "damping" : true,
};

export class BattleRoyale extends GameMode{

}