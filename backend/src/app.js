const express = require('express');
const app = express();
app.use(express.json());
const { Pool } = require('pg');
const port = process.env.PORT || 3000;



// Connection testing
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Connected to the database');
    }
    release();
});

app.get("/recipes", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."Recipe"');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})