import express from 'express';
import { pool } from './db-connector.js';
var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const PORT = 6453 || process.env.PORT;

// UNTESTED - Under contruction

// GET Top 5 1v1 players
app.get('/1v1', function (req, res) {
    let sqlCall = "SELECT name, kill_count FROM Players ORDER BY kill_count DESC LIMIT 5;";

    pool.query(sqlCall, function(error, results){
        if (error) {
            
            console.log(`= ${new Date(Date.now()).toString()} -- ${error}`);
            return res.status(500).send("An error occured while fetching top 1v1 players.");
        }
        
        let players = results;
        console.log(`= ${new Date(Date.now()).toString()} -- Successfully Fetched top 1v1 players`)
        return res.render('1v1', { data: players })
        
    });
});

// GET Top 5 asteroid players
app.get('/asteroid', function (req, res) {
    let sqlCall = "SELECT name, time, asteroid_score FROM Players ORDER BY time DESC LIMIT 5;"

    pool.query(sqlCall, function (error, results) {
        if (error) {
            console.log(`= ${new Date(Date.now()).toString()} -- ${error}`);
            return res.status(500).send("An error occured while fetching top asteroid players");
        }

        let players = results;
        console.log(`= ${new Date(Date.now()).toString()} -- Successfully Fetched top asteroid players`);
        return res.render('asteroid', { data: players });
    });
});

// Insert asteroid player data into db
app.post('/add-asteroid', function (req, res) {
    //capture data and parse it into js object
    let data = req.body;
    
    let playerName = data.name;
    let playerTime = parseInt(data.time); //convert time into int
    let playerScore = parseInt(data.asteroid_score); //convert asteroid_score into int

    console.log(`${playerName}`);
    console.log(`${playerTime}`);
    console.log(`${playerScore}`);

    let sqlCall = `INSERT INTO Players (name, time, asteroid_score) VALUES ('${playerName}', '${playerTime}', '${playerScore}')`
    pool.query(sqlCall, function (error, results) {
        if (error) {
            console.log(`= ${new Date(Date.now()).toString()} -- ${error}`);
            res.status(400).send("An error occured while INSERTING data into asteroid data");
        }
        else {
            res.status(201).send("Data inserted Successfully");
        }     

    });
});

//Insert 1v1 player data for new player
app.post('/add-1v1', function (req, res) {
    let data = req.body;

    let playerName = data.name;
    let playerKillCount = parseInt(data.kill_count); //convert kill_count into int

    let sqlCall = `INSERT INTO Players (name, kill_count) VALUES ('${playerName}', '${playerKillCount}')`
    pool.query(sqlCall, function (error, results) {
        if (error) {
            console.log(`= ${new Date(Date.now()).toString()} -- ${error}`);
            res.status(400).send("An error occured while INSERTING data into 1v1 data");
        }
        else {
            res.send(results);
        }
    });
});

// Update existing 1v1 player
// Issue -- playerid needs to be passed to this function through the data
app.put('/update-1v1', function (req, res, next) {
    let data = req.body

    let playerID = parseInt(data.playerid);
    let playerKillCount = parseInt(data.kill_count);

    let playerUpate = `UPDATE Players SET kill_count = ? WHERE Players.playerid = ?`;
    let selectPlayer = `SELECT kill_count FROM Players WHERE Players.playerid = ?`

    // First get the kill count
    pool.query(selectPlayer, [playerID], function (error, results) {
        if (error) {
            console.log(`= ${new Date(Date.now()).toString()} -- ${error}`);
            res.status(400).send(`An error occured retrieving ${playerID} kill_count`);
        }
        else {
            let retrievedKC = results.kill_count;   //Needs to be verified -- might be in an array
            let newKC = retrievedKC + playerKillCount;

            //Run another query to update the information
            pool.query(playerUpdate, [newKC, playerID], function (error, results) {
                if (error) {
                    console.log(`= ${new Date(Date.now()).toString()} -- ${error}`);
                    res.status(400).send(`An error occured updating ${playerID} kill_count`);
                }
                else {
                    res.status(200).send(`Player kill count for ${playerID} updated correctly`);
                }
            });
        }
    });
}); //end of update function


// LISTENER
app.listen(PORT, function () {
    console.log('Routes started on http:localhost:' + PORT + '; press Ctrl-C to terminate')
});
