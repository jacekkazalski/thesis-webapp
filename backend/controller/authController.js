const user = require('../db/models/user')
const bcrypt = require('bcrypt')

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
    return res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: newUser
    })
}

module.exports = {signup}