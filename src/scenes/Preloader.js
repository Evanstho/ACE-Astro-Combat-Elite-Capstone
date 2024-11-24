export class PreloaderScene extends Phaser.Scene
{
    preload(){
        
        // SHIPS
        for (let i = 1 ; i < 13 ; i++){
            this.load.image(`ship${i}`,`assets/Ships/ship${i}.png`);
        }

        this.load.image('shipSelection', 'assets/Ships/Ship-sprites.png');

        this.load.image('asteroid', 'assets/Asteroids/asteroid3.png');
        this.load.image('projectile', 'assets/Particles/machinegun.png');

        // AUDIO
        this.load.audio('laserSound', 'assets/Sounds/laser.mp3');
        this.load.audio('explosion', 'assets/Sounds/explosion.mp3');
        this.load.audio('thruster', 'assets/Sounds/thruster.mp3');
        this.load.audio('ship_hit', 'assets/Sounds/hit_ship.mp3');

        // ANIMATIONS
        // starfield sprite sheet
        this.load.spritesheet('starfield', 'assets/Backgrounds/starfield1.png', {
            frameWidth: 1300,
            frameHeight: 720,
            endFrame: 11 // 12 frames
        });

        // Projectile flash sprite sheet
        // 896 total width, 224 * four frames, 116 height
        this.load.spritesheet('flash', 'assets/Animations/LaserEffect.png', {
            frameWidth: 215,
            frameHeight: 105,
            endFrame: 3 // 4 frames, starting on 0, ending on 3
        });

        // Damage animation sprite sheet
        // Dimensions: 624px * 204px (3 frames) = 208 * 204
        this.load.spritesheet('boom', '/assets/Animations/explosion.png', {
            frameWidth: 208,
            frameHeight: 204,
            endframe: 2 // 0 - 2
        });

        // background music 
        this.load.audio('bgm1', 'assets/Music/bgm1.mp3');

        // fonts 
        this.load.bitmapFont("retro_gaming","assets/Fonts/retro_gaming_0.png","assets/Fonts/retro_gaming.fnt");

        this.load.on('complete', () => {
            console.log("Assets loaded, proceeding to load Game mode selection screen");
            this.scene.start("ModeSelectorScreen");
        });
    }

}