require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./route/authRoute');
const recipeRouter = require('./route/recipeRoute');
const errorHandler = require('./utils/errorHandler');
const CustomError = require('./utils/customError');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors())
const port = process.env.PORT || 3000;

// Routes
app.use('/api/auth', authRouter)
app.use('/api/recipes', recipeRouter)

app.use('*', (req, res, next) => {
    throw new CustomError(`Route ${req.originalUrl} not found`, 404)
})

app.use(errorHandler)
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})