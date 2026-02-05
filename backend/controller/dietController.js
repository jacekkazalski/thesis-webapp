const sequelize = require('../config/database');
const initModels = require('../models/init-models');
const { Diet, User } = initModels(sequelize);
const catchAsync = require('../utils/catchAsync');

const getAllDiets = catchAsync(async (req, res) => {
    const diets = await Diet.findAll();
    return res.status(200).json({
        status: 'success',
        data: diets
    });
});

const getUserDiet = catchAsync(async (req, res) => {
    const authUser = req.user;
    const user = await User.findOne({
        where: { id_user: authUser.id },
        attributes: ['id_diet'],
    });
    return res.status(200).json({
        status: 'success',
        data: { diet_id: user?.id_diet ?? null }
    });
});

module.exports = { getAllDiets, getUserDiet };
