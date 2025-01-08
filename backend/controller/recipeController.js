const recipe = require('../models/recipe');
const catchAsync = require('../utils/catchAsync');
const CustomError  = require('../utils/customError');

const createRecipe = catchAsync(async (req, res, next) => {
    const body = req.body;

    const newRecipe = await recipe.create({
        name: body.name,
        instructions: body.instructions,
        added_by: 1
    });

    return res.status(201).json({
        status: 'succes',
        data: newRecipe});
});

module.exports = {createRecipe}