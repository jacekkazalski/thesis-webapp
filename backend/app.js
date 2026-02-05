require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./route/authRoute');
const recipeRouter = require('./route/recipeRoute');
const ingredientRouter = require('./route/ingredientRoute');
const dietRouter = require('./route/dietRoute');
const favouriteRouter = require('./route/favouriteRoute');
const ratingRouter = require('./route/ratingRoute');
const userRouter = require('./route/userRoute');
const errorHandler = require('./utils/errorHandler');
const CustomError = require('./utils/customError');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    // 5173 default port for Vite
    // 5174 default port for Vite with https
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use('/images', express.static('images'));
const port = process.env.PORT || 3000;

// Routes
app.use('/api/auth', authRouter)
app.use('/api/recipes', recipeRouter)
app.use('/api/ingredients', ingredientRouter)
app.use('/api/diets', dietRouter)
app.use('/api/favourites', favouriteRouter)
app.use('/api/ratings', ratingRouter)
app.use('/api/users', userRouter)

app.use('*', (req, res, next) => {
    throw new CustomError(`Route ${req.originalUrl} not found`, 404)
})

app.use(errorHandler)
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
