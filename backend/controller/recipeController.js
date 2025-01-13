const recipe = require('../models/recipe');
const ingredient_recipe = require('../models/ingredient_recipe');
const catchAsync = require('../utils/catchAsync');
const CustomError  = require('../utils/customError');

const createRecipe = catchAsync(async (req, res, next) => {
    const body = req.body;
    const user = req.user;
    console.log(user);
    //TODO: Error handling
    const newRecipe = await recipe.create({
        name: body.name,
        instructions: body.instructions,
        added_by: user.id
    });
    console.log(body.ingredients)
    const ingredients = body.ingredients;
    ingredients.forEach(element => {
        ingredient_recipe.create({
            id_ingredient: element.id_ingredient,
            id_recipe: newRecipe.id_recipe,
            quantity: element.quantity
        });
    });

    return res.status(201).json({
        status: 'succes',
        data: newRecipe});
});

module.exports = {createRecipe}