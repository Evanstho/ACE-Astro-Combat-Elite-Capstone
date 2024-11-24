## A.C.E - ASTRO COMBAT ELITE
Copyright © 2024 
Created by Jose Baroza-Martinez, Thomas Evans, and Richard Oluyole. All rights reserved.

Step into a world of dynamic space combat where you command a ship, destroy asteroids and engage in epic space battles that’ll have you on the edge of your seat with jaw-dropping graphics and intense multiplayer action. A.C.E is more than just a game. It is a ticket the ultimate cosmic showdown.

https://www.youtube.com/watch?v=cgeTfRbW0wA

## Description

Astro Combat Elite is an HTML5 multiplayer 2D space arcade game where players can engage in decisive 1v1 spaceship battles or try to survive in a perilous asteroid field as long as possible. The game offers an immersive experience featuring fast-paced combat, various ship models, and precise controls using mouse and keyboard controls. The game leverages modern web technologies and a robust server-client architecture to ensure a fair, synchronized, and fluid gameplay experience with an authoritative server model and client-side prediction.

## Main Technologies

Phaser.js was the backbone and centerpiece to the A.C.E project. Phaser.js enabled the creation of various scenes and gave access to various built-in functions to simplify the development process. In both game modes, Phaser.js facilitated the rendering and animation of object sprites and all visual/audio assets. In the single player mode, Phaser's Physics.Arcade system was additionally utilized for collision detection, defining world boundaries, and implementation of the fluid movement physics.

Vite is a build tool and development server used for all frontend testing with the A.C.E project.

Socket.io and its implementation of websockets were used for bi-directional communication between the client and the server during a multiplayer match. The ability to declare socket event handlers with string names that match on both sides of the socket greatly helped to organize the code for multiplayer. Express.js was used as the game server from which running multiplayer games were managed over a websocket connection.


## How-to-start

The best way to run A.C.E is by utilizing Visual Studio Code. The shortcuts used in these instructions are based on the most recent version of Visual Studio Code. To start A.C.E, open the terminal and use ```CTRL+SHIFT+5``` to split the terminal. In the first terminal, ensure that it is in A.C.E’s root folder (```./ACE-Astro-Combat-Elite```) then run the command ```npm run install-all```. This will ensure that all the dependencies are properly installed into the root package.json file and in the backend package.json file. Once the packages have been successfully installed, run the command ```npm run dev```.The game will indicate in the console that it is running on ```localhost:8080```. This indicates that the front end for A.C.E is properly running. Next, in the second terminal run the command ```npm run backend```. A message should appear and will indicate that the logs are being saved into a .txt file(located within the log folder). This means that A.C.E’s back is now connected and will allow A.C.E’s multiplayer option to function correctly.

In order to play the multiplayer aspect of A.C.E, open up two web browsers and navigate to localhost:8080 in both browsers. Select the ```multiplayer``` option in both browsers. Next join one of the available rooms and select the ```same room number``` for both browsers.

Good luck and have fun!

**Controls**

A.C.E utilizes the keyboard and mouse.

## Multiplayer 1v1

Players step into a high-stakes intense 1v1 showdown, spawning  on opposite sides of an arena. Their mission is to destroy the other player for victory. This game mode emphasizes fast-paced, strategic combat where every decision can mean the difference between winning or losing.

**Features**
- Authoritative server model, in which the client sends input to the server and the server sends the information back to all the clients ensures fairness.
- Client-side prediction allows for the client to render inputs immediately, while the server processes the inputs and sends back the game state to all the clients which helps to eliminates a visible delay between player actions even with server intervention.
- Entity Interpolation assists with smoothing out the movement of sprites and combat actions.
- Socket.io and Express was used to verify and synchronize game states between multiple clients and the server to allow for fair gameplay.


## Single Player: Asteroid Shootout

Players find themselves thrust into the heart of a perilous asteroid belt, and their mission is to eliminate as many asteroids as possible while dodging asteroids to keep their ship alive.

**Features**
- Progressive difficulty and dynamically spawning asteroids.
- Timed and scored matches to create a competitive atmosphere.
- Responsive dynamic controls


## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch a development web server |
| `npm run build` | Create a production build in the `dist` folder |
| `npm run install-all` | Install project dependencies in root directory and backend directory |
| `npm run backend` | Launch the backend server and logs information into a backend-logfile|


## Deploying to Production

After you run the `npm run build` command, your code will be built into a single bundle and saved to the `dist` folder, along with any other assets your project imported, or stored in the public assets folder.

In order to deploy your game, you will need to upload *all* of the contents of the `dist` folder to a public facing web server.

## mySQL DB -- Non-Functional

**Requires** mysql DB

1) Setup up db-connector.js file to match the login information on the mysql db

2) ```npm run routes``` in a new terminal to start the mysql server.

## GOOGLE APP ENGINE -- Currently non-functional

**Requires** app.yaml file

1) Check gcloud config list and ensure you have the right config
    ```gcloud config list```

2) Deploy app through google app engine from the folder the .yaml file is located
    ```gcloud deploy```

3) View service
    ```gcloud app browse```
[Google documentation](https://cloud.google.com/appengine/docs/standard/java-gen2/building-app/creating-project) </br>


## Copyright © 2024
A.C.E - Astro Combat Elite was developed as a Capstone project in spring 2024 and is the intellectual property of Jose Baroza-Martinez, Thomas Evans, and Richard Oluyole. All rights reserved.
