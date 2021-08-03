const mysql = require('mysql2');
const express = require('express'); 
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');


// express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

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

// Get all candidates
app.get('/api/candidates', (req, res) => {
    const sql =  `SELECT * FROM candidates`;

    // Query request to get all candidates
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'Success',
            data: rows
        });
    });
});


// Get a single candidate 
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    // Query request to get a single candidate by id
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Success!',
            data: row
        });
    });
});


// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates where id = ?`;
    const params = [req.params.id];

    // Query request to delete a candidate 
    db.query(sql , params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found!'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});


app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors});
        return;
    }

    // Query request to create a candidate
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message});
            return;
        }
        res.json({
            message: 'Success!',
            data: body
        });
    });
});







// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});