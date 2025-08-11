const sequelize = require('../config/database');
const initModels = require('../models/init-models');
const { User} = initModels(sequelize);
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');


const getUser = catchAsync(async (req, res, next) => {
    const { id_user } = req.query;
    if(!id_user) {
        return next(new CustomError('Missing required fields', 400))

    }
    const foundUser = await User.findOne({
        where: { id_user: id_user },
    });
    if(!foundUser) {
        return next(new CustomError('User not found', 404))
    }
    return res.status(200).json({
        status: 'success',
        id_user: foundUser.id_user,
        username: foundUser.username,
    })
})

module.exports = {getUser}