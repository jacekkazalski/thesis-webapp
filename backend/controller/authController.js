const user = require('../db/models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    })
}

const signup = async (req, res, next) => {
    const {username, email, password, confirmPassword} = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields'
        })
    }
    if (password !== confirmPassword) {
        return res.status(400).json({
            status: 'error',
            message: 'Passwords do not match'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await user.create({
        username: username,
        email: email,
        password: hashedPassword,

    })

    if(!newUser) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to create the user'
        })
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
}

const login = async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields'
        })
    }

    const result = await user.findOne({
        where: {email: email},
    })
    if(!result || !await bcrypt.compare(password, result.password) ) {
        return res.status(404).json({
            status: 'error',
            message: 'Invalid login data'
        })
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
}

module.exports = {signup, login}