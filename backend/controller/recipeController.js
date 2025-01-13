const recipe = require('../models/recipe');
const ingredient_recipe = require('../models/ingredient_recipe');
const ingredient = require('../models/ingredient');
const user = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const CustomError  = require('../utils/customError');

const createRecipe = catchAsync(async (req, res, next) => {
    const body = req.body;
    const authUser = req.user;
    console.log(authUser);
    const newRecipe = await recipe.create({
        name: body.name,
        instructions: body.instructions,
        added_by: authUser.id
    });
    if(!newRecipe){
        return next(new CustomError('Recipe could not be created', 500));
    }
    console.log(body.ingredients)
    const ingredients = body.ingredients;
    for (const element of ingredients) {
        // Check if ingredient with given id exists
        if (await ingredient.findOne({where: {id_ingredient: element.id_ingredient}}) === null) {
            return next(new CustomError('Ingredient does not exist', 404));
        }
        await ingredient_recipe.create({
            id_ingredient: element.id_ingredient,
            id_recipe: newRecipe.id_recipe,
            quantity: element.quantity
        });
    }

    return res.status(201).json({
        status: 'success',
        data: {id_recipe: newRecipe.id_recipe}});
});

const getRecipe = catchAsync(async (req, res, next) => {
    const {id_recipe} = req.query;
    if(!id_recipe){
        return next(new CustomError('Missing required fields', 400));
    }
    const foundRecipe = await recipe.findOne({ 
        where: {id_recipe: id_recipe},
    });
    if(!foundRecipe){
        return next(new CustomError('Recipe not found', 404));
    }
    const author = await user.findOne({ 
        where: {id_user: foundRecipe.added_by}, 
        attributes: ['id_user','username']
    });
    const ingredients = await ingredient_recipe.findAll({ 
        where: {id_recipe: id_recipe},
        include: [ {
            model: ingredient,
            attributes: ['name']
        }]
    });
    console.log(ingredients);

    return res.status(200).json({
        status: 'success',
        data: foundRecipe,
        ingredients: ingredients,
        author: author
    });
});
const getAllRecipes = catchAsync(async (req, res, next) => {
    const recipes = await recipe.findAll({
        include: [{
            model: user, 
            attributes: ['username', 'id_user']}],
        attributes: ['id_recipe', 'name']});
    res.status(200).json({
        status: 'success',
        data: recipes
    });
});

module.exports = {createRecipe, getRecipe, getAllRecipes}