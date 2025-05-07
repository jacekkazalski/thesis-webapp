const sequelize = require('../config/database');
const initModels = require('../models4/init-models');
const { Recipe, Ingredient, User, Ingredient_recipe, Favourite, Rating } = initModels(sequelize);
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');

const getRecipe = catchAsync(async (req, res, next) => {
    const { id_recipe } = req.query;
    if (!id_recipe) {
        return next(new CustomError('Missing required fields', 400));
    }
    const foundRecipe = await Recipe.findOne({
        where: { id_recipe: id_recipe },
    });
    if (!foundRecipe) {
        return next(new CustomError('Recipe not found', 404));
    }
    const author = await User.findOne({
        where: { id_user: foundRecipe.added_by },
        attributes: ['id_user', 'username']
    });
    const ingredients = await Ingredient_recipe.findAll({
        where: { id_recipe: id_recipe },
        include: [{
            model: Ingredient,
            as: 'id_ingredient_Ingredient',
            attributes: ['name']
        }]
    });
    const ingredientsMapped = ingredients.map(ingredient => {
        return {
            id_ingredient: ingredient.id_ingredient,
            name: ingredient.id_ingredient_Ingredient.name,
            quantity: ingredient.quantity
        }
    });

    return res.status(200).json({
        status: 'success',
        name: foundRecipe.name,
        instructions: foundRecipe.instructions,
        image_url: foundRecipe.image_path ? `${req.protocol}://${req.get('host')}/${foundRecipe.image_path}` : null,
        ingredients: ingredientsMapped,
        author: author
    });
});
const createRecipe = catchAsync(async (req, res, next) => {
    const body = req.body;
    const authUser = req.user;
    const imagePath = req.file ? `./images/${req.file.filename}` : null;
    console.log(authUser);

    // Check if parameters aren't empty strings and are present
    if (!body.name || body.name.trim() === '' ||
        !body.instructions || body.instructions.trim() === '' ||
        !body.ingredients) {
        return next(new CustomError('Missing required fields', 400));
    }
    //TODO: Add transaction
    const newRecipe = await Recipe.create({
        name: body.name,
        instructions: body.instructions,
        added_by: authUser.id,
        image_path: imagePath
    });
    if (!newRecipe) {
        return next(new CustomError('Recipe could not be created', 500));
    }

    // JSON.parse because body.ingredients is a string in formdata
    const ingredients = JSON.parse(body.ingredients);
    for (const element of ingredients) {
        // Check if ingredient with given id exists
        if (await Ingredient.findOne({ where: { id_ingredient: element.id_ingredient } }) === null) {
            return next(new CustomError('Ingredient does not exist', 404));
        }
        await Ingredient_recipe.create({
            id_ingredient: element.id_ingredient,
            id_recipe: newRecipe.id_recipe,
            quantity: element.quantity
        });
    }

    return res.status(201).json({
        status: 'success',
        data: { id_recipe: newRecipe.id_recipe }
    });
});

const deleteRecipe = catchAsync(async (req, res, next) => {
    const { id_recipe } = req.query;
    const authUser = req.user;
    if (!id_recipe) {
        return next(new CustomError('Missing required fields', 400));
    }
    // Check if recipe exists
    const foundRecipe = await Recipe.findOne({
        where: { id_recipe: id_recipe },
    });
    if (!foundRecipe) {
        return next(new CustomError('Recipe not found', 404));
    }
    // Check if user is author
    if (foundRecipe.added_by !== authUser.id) {
        return next(new CustomError('Unauthorized operation', 403));
    }

    // Create a transaction to delete the recipe and its associated data
    const transaction = await Recipe.sequelize.transaction();
    try {
        await Rating.destroy({where: { id_recipe: id_recipe }});
        await Ingredient_recipe.destroy({where: { id_recipe: id_recipe },});
        await Favourite.destroy({ where: { id_recipe: id_recipe } });
        await Recipe.destroy({where: { id_recipe: id_recipe }});

        await transaction.commit();

        return res.status(200).json({
            status: 'success',
            message: 'Recipe deleted successfully'
        });
    } catch (error) {
        await transaction.rollback();
        return next(new CustomError('Recipe could not be deleted', 500));
    }
});
const getAllRecipes = catchAsync(async (req, res, next) => {
    const recipes = await Recipe.findAll({
        include: [{
            model: User,
            as: 'added_by_User',
            attributes: ['username', 'id_user']
        }],
        attributes: ['id_recipe', 'name', 'image_path']
    });

    const recipesWithImage = recipes.map(recipe => {
        return {
            id_recipe: recipe.id_recipe,
            name: recipe.name,
            image_url: recipe.image_path
                ? `${req.protocol}://${req.get('host')}/${recipe.image_path}` : null,
            author: recipe.added_by_User,
        }
    });
    res.status(200).json({
        status: 'success',
        data: recipesWithImage
    });
});
const isAuthor = catchAsync(async (req, res, next) => {
    const authUser = req.user;
    const { id_recipe } = req.query;

    if (!id_recipe) {
        return next(new CustomError('Missing required fields', 400));
    }
    // Check if recipe exists
    const foundRecipe = await Recipe.findOne({
        where: { id_recipe: id_recipe },
    });
    if (!foundRecipe) {
        return next(new CustomError('Recipe not found', 404));
    }
    // Check if user is author
    if (foundRecipe.added_by !== authUser.id) {
        return res.status(200).json({
            status: 'success',
            isAuthor: false
        });
    }
    return res.status(200).json({
        status: 'success',
        isAuthor: true
    });
});

module.exports = { createRecipe, getRecipe, getAllRecipes, isAuthor, deleteRecipe };