const sequelize = require('../config/database');
const initModels = require('../models/init-models');
const { Ingredient} = initModels(sequelize);
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');


const getAllIngredients = catchAsync(async (req, res) => {
    const ingredients = await Ingredient.findAll();
    res.status(200).json({
        status: 'success',
        data: ingredients
    });
});

module.exports = {getAllIngredients}