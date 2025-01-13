const ingredient = require('../models/ingredient');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');


const getAllIngredients = catchAsync(async (req, res) => {
    const ingredients = await ingredient.findAll();
    res.status(200).json({
        status: 'success',
        data: ingredients
    });
});

module.exports = {getAllIngredients}