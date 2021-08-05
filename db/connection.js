const mysql = require('mysql2');

// Connect to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MYSQL username
        user: 'root',
        // Your MYSQL password
        password: 'password',
        database: 'election'
    },
    console.log('Connected to the election database.')
);



module.exports = db; 