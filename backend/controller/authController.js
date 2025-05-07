const sequelize = require('../config/database');
const initModels = require('../models4/init-models');
const {User} = initModels(sequelize);
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')
const CustomError = require('../utils/customError')
require('dotenv').config()

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    })
}

const signup = catchAsync(async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return next(new CustomError('Missing required fields', 400))
    }
    if (password !== confirmPassword) {
        return next(new CustomError('Passwords do not match', 400))
    }
    if (password.length < 8) {
        return next(new CustomError('Password must be at least 8 characters long', 400))
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        username: username,
        email: email,
        password: hashedPassword,

    })

    if (!newUser) {
        return next(new CustomError('User could not be created', 500))
    }

    return res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
            user: {
                id: newUser.id_user,
                username: newUser.username,
                email: newUser.email,
            }
        }
    })
})

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new CustomError('Missing required fields', 400))
    }

    const result = await User.findOne({
        where: { email: email },
    })
    if (!result || !await bcrypt.compare(password, result.password)) {
        return next(new CustomError('Invalid email or password', 401))
    }

    const accessToken = jwt.sign(
        { username: result.username , id: result.id_user},
        process.env.ACCESS_TOKEN_SECRET,
        //TODO: change expiresIn to 15m
        { expiresIn: '15m' }
    )
    const refreshToken = jwt.sign(
        { username: result.username, id: result.id_user },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
    // Save refresh token in database
    await result.update({ refresh_token: refreshToken })

    res.cookie('jwt', refreshToken,
        {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'Strict'
        })

    return res.json({ accessToken, username: result.username, email: result.email })
})
const refresh = catchAsync(async (req, res, next) => {
    const cookies = req.cookies
    if(!cookies?.jwt) {
        return next(new CustomError('Unauthorized', 401))
    }
    const refreshToken = cookies.jwt
    const result = await User.findOne({
        where: { refresh_token: refreshToken },
    })
    if(!result) {
        return next(new CustomError('Unauthorized', 401))
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err || user.username !== result.username) {
            return next(new CustomError('Forbidden', 403))
        }
        const accessToken = jwt.sign(
            { username: result.username , id: result.id_user},
            //TODO: change expiresIn to 15m
            process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})

        return res.json({accessToken})
    })
    
})
const logout = catchAsync(async (req, res, next) => {
    const cookies = req.cookies
    if(!cookies?.jwt) {
        return next(new CustomError('No content', 204))
    }
    const refreshToken = cookies.jwt
    // Find refresh token in database
    const result = await User.findOne({
        where: { refresh_token: refreshToken },
    })
    if(!result) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'Strict'
        })
        return next(new CustomError('No content', 204))
    }
    // Delete refresh token from database
    await result.update({refresh_token: null})
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'Strict'
    })
    return res.json({message: 'Logout successful'})
})

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    console.log(req.headers)
    if(!authHeader) {
        return next(new CustomError('Unauthorized', 401))
    }
    const token = authHeader.split(' ')[1]
    console.log('tututut')
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // Invalid/expired access token
        if (err) {
            return next(new CustomError('Forbidden', 403))
        }
        req.user = user
        next()
    })
}

module.exports = { signup, login, authenticateToken, refresh, logout }