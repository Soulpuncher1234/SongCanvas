const mysql = require('mysql');

const pool = mysql.createPool({
    host: "34.168.103.146",
    user: "root",
    password: "songFanCanvas",
    port: "3306",
    database: "songCanvas",
    connectionLimit: 20    
})

module.exports = pool;