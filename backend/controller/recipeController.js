const recipe = require('../models/recipe');
const ingredient_recipe = require('../models/ingredient_recipe');
const ingredient = require('../models/ingredient');
const user = require('../models/user');
const favourite = require('../models/favourite');
const catchAsync = require('../utils/catchAsync');
const CustomError  = require('../utils/customError');

const createRecipe = catchAsync(async (req, res, next) => {
    const body = req.body;
    const authUser = req.user;
    const imagePath = req.file ? `./images/${req.file.filename}` : null;
    console.log(authUser);
    if(!body.name || body.name.trim() === '' || 
        !body.instructions || body.instructions.trim() === '' || 
        !body.ingredients){
        return next(new CustomError('Missing required fields', 400));
    }
    //TODO: Add transaction
    const newRecipe = await recipe.create({
        name: body.name,
        instructions: body.instructions,
        added_by: authUser.id,
        image_path: imagePath
    });
    if(!newRecipe){
        return next(new CustomError('Recipe could not be created', 500));
    }

    // JSON.parse because body.ingredients is a string in formdata
    const ingredients = JSON.parse(body.ingredients);
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
    const ingredientsMapped = ingredients.map(ingredient => {
        return {
            id_ingredient: ingredient.id_ingredient,
            name: ingredient.Ingredient.name,
            quantity: ingredient.quantity
        }
    })
    console.log(ingredients);

    return res.status(200).json({
        status: 'success',
        name: foundRecipe.name,
        instructions: foundRecipe.instructions,
        image_url: foundRecipe.image_path ? `${req.protocol}://${req.get('host')}/${foundRecipe.image_path}` : null,
        ingredients: ingredientsMapped,
        author: author
    });
});
const getAllRecipes = catchAsync(async (req, res, next) => {
    const recipes = await recipe.findAll({
        include: [{
            model: user, 
            attributes: ['username', 'id_user']}],
        attributes: ['id_recipe', 'name', 'image_path']});

    const recipesWithImage = recipes.map(recipe => {
        return {
            id_recipe: recipe.id_recipe,
            name: recipe.name,
            image_url: recipe.image_path 
            ? `${req.protocol}://${req.get('host')}/${recipe.image_path}` : null,
            author: recipe.User
            }
    });
    res.status(200).json({
        status: 'success',
        data: recipesWithImage
    });
});
const addToFavourites = catchAsync(async (req, res, next) => {
    const body = req.body;
    const authUser = req.user;
    const newFavourite = await favourite.create({
        id_user: authUser.id,
        id_recipe: body.id_recipe
    });
    res.status(201).json({
        status: 'success',
        data: newFavourite
    });
});
const removeFromFavourites = catchAsync(async (req, res, next) => {
    const body = req.body;
    const authUser = req.user;
    await favourite.destroy({
        where: {
            id_user: authUser.id,
            id_recipe: body.id_recipe
        }
    });
});

module.exports = {createRecipe, getRecipe, getAllRecipes, addToFavourites, removeFromFavourites};