const user = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')
const CustomError = require('../utils/customError')

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    })
}

const signup = catchAsync(async (req, res, next) => {
    const {username, email, password, confirmPassword} = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return next(new CustomError('Missing required fields', 400))
    }
    if (password !== confirmPassword) {
        return next(new CustomError('Passwords do not match', 400))
    }
    if(password.length < 8) {
        return next(new CustomError('Password must be at least 8 characters long', 400))
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await user.create({
        username: username,
        email: email,
        password: hashedPassword,

    })

    if(!newUser) {
        return next(new CustomError('User could not be created', 500))
    }

    const token = generateToken({id: newUser.id_user, username: newUser.username})
    return res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
            user: {
                id: newUser.id_user,
                username: newUser.username,
                email: newUser.email,
            },
            token
        }
    })
})

const login = catchAsync( async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new CustomError('Missing required fields', 400))
    }

    const result = await user.findOne({
        where: {email: email},
    })
    if(!result || !await bcrypt.compare(password, result.password) ) {
        return next(new CustomError('Invalid email or password', 401))
    }

    const token = generateToken({
        id: result.id_user,
        username: result.username,
    })

    return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
            user: {
                id: result.id_user,
                username: result.username,
                email: result.email,
            },
            token,
        },
    })
})

module.exports = {signup, login}