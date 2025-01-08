require('dotenv').config();
const express = require('express');
const authRouter = require('./route/authRoute');
const errorHandler = require('./utils/errorHandler');
const CustomError = require('./utils/customError');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use('/api/auth', authRouter)

app.use('*', (req, res, next) => {
    throw new CustomError(`Route ${req.originalUrl} not found`, 404)
})

app.use(errorHandler)
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})