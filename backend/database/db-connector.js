// Database connector
// This is the mySQL database connector.
// UNDER CONSTRUCTION
import mySQL from 'mysql';

const URL_INSTANCE = 'URL_INSTANCE_EXAMPLE_URL'  // URL instance placeholder
const DB_USER = 'DB_USER' // Replace with DB User placeholder
const DB_PASS = 'DB_PASS' // DB password placeholder
const DB_NAME = 'DB_NAME' // DB name placeholder

var pool = mySQL.createPool({
    connectionLimit : 10,
    host : URL_INSTANCE,  
    user : DB_USER,  
    password : DB_PASS, 
    database : DB_NAME 
})

// TESTING PURPOSES -- Used to debug connection to DB
// Comment out when not using
// pool.query("INSERT INTO Players (name) VALUES ('connection test')", function (error, results, fields) {
//     if (error) {
//         console.log("error", error);
//     }
//     else {
//         console.log("success");
//     }
// });

// Exports pool to be used in other application
export { pool };