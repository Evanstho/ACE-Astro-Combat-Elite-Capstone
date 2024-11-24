import Phaser from "phaser";

import { PreloaderScene } from "./scenes/Preloader";
import {AsteroidShootout} from "./scenes/AsteroidMode"
import { ModeSelectorScreen } from "./scenes/ModeSelector";
import {LobbyScene} from "./scenes/LobbyScene";
import { PvPScene } from "./scenes/PvP";
import { ControlScene } from "./scenes/ControlScene";
import { GameOverScene } from "./scenes/GameOver";
import { PvPGameOver } from "./scenes/PvPGameOver";
import { ShipSelectionMultScene } from "./scenes/ShipSelectionMultScene";
import { ShipSelectionSingleScene } from "./scenes/ShipSelectionSingleScene";
import { LeaderboardScene } from "./scenes/Leaderboard";
import { scoreSubmissionScene } from "./scenes/Submisson";


const config = {
    type: Phaser.AUTO,
    width: 1300,
    height: 720,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        PreloaderScene,
        ModeSelectorScreen,
        LobbyScene,
        AsteroidShootout,
        PvPScene,
        ControlScene,
        PvPGameOver,
        GameOverScene,
        ShipSelectionSingleScene,
        ShipSelectionMultScene,
        LeaderboardScene,
        scoreSubmissionScene
    ],

    fps:{
        target:60
    }

             
    
};

export default new Phaser.Game(config);
