require('dotenv').config();
const express = require('express');
const authRouter = require('./route/authRoute')

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use('/auth', authRouter)

app.use('*', (req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: "Not found"
    })
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.statusMessage || 'Internal Server Error'
    })
})
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})