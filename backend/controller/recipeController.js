const sequelize = require('../config/database');
const { Op, fn, col, literal } = require('sequelize');
const initModels = require('../models/init-models');
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
    const rating = await Rating.findOne({
        where: { id_recipe: id_recipe },
        attributes: [[fn('AVG', col('value')), 'averageRating']]
    });

    const ratingParameter = rating ? parseFloat(rating.get('averageRating')) : null;
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
        id_recipe: foundRecipe.id_recipe,
        instructions: foundRecipe.instructions,
        image_url: foundRecipe.image_path ? `${req.protocol}://${req.get('host')}/${foundRecipe.image_path}` : null,
        ingredients: ingredientsMapped,
        author: author,
        rating: ratingParameter
    });
});
const getRandomRecipe = catchAsync(async (req, res, next) => {
    const count = await Recipe.count();
    if (count === 0) {
        return next(new CustomError('No recipes found', 404));
    }
    const randomIndex = Math.floor(Math.random() * count);
    const randomRecipe = await Recipe.findOne({
        limit: 1,
        offset: randomIndex,
    });
    if (!randomRecipe) {
        return next(new CustomError('No recipes found', 404));
    }
    return res.status(200).json({
        status: 'success',
        id_recipe: randomRecipe.id_recipe,
    });
})
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
        await Rating.destroy({ where: { id_recipe: id_recipe } });
        await Ingredient_recipe.destroy({ where: { id_recipe: id_recipe }, });
        await Favourite.destroy({ where: { id_recipe: id_recipe } });
        await Recipe.destroy({ where: { id_recipe: id_recipe } });

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
const getRecipes = catchAsync(async (req, res, next) => {
    const searchQuery = req.query.search || null;
    const ingredients = req.query.ingredient ? Array.isArray(req.query.ingredient) ? req.query.ingredient.map(Number) : null : null
    console.log(ingredients)
    //console.log(ingredients);
    // Newest: id_recipe desc, Oldest: id_recipe asc, Highest rating: rating desc, Most ingredients: ingredients desc
    //TODO: Ingredient count is not working
    //TODO: Matching ingredients only
    const allowedSortParams = ['newest', 'highest_rated', 'ingredients'];
    const sortParam = allowedSortParams.includes(req.query.sortBy) ? req.query.sortBy : 'newest';
    const authorUserId = req.query.authorId || null;
    const favUserId = req.query.favId || null;

    let whereClause = {}
    if (searchQuery) {
        whereClause.name = { [Op.iLike]: `%${searchQuery}%` };
    }
    if (authorUserId) {
        whereClause.added_by = authorUserId;
    }
    const includes = [
        {
            model: User,
            as: 'added_by_User',
            attributes: ['username', 'id_user']
        },
        {
            model: Rating,
            as: 'Ratings',
            attributes: [],

        },
    ]
    const group = ['Recipe.id_recipe', 'added_by_User.id_user'];
    // Condition for searching only for recipes added to favourites by a specific user
    if (favUserId) {
        includes.push({
            model: Favourite,
            as: 'Favourites',
            where: {
                id_user: favUserId
            },
            required: true
        })
        group.push('Favourites.id_recipe', 'Favourites.id_user');
    }
    const recipes = await Recipe.findAll({
        logging: console.log,
        where: whereClause,
        include: includes,
        attributes: [
            'id_recipe',
            'name',
            'image_path',
            [fn('AVG', col('Ratings.value')), 'rating'],],

        group: group,
    });

    const recipeIds = recipes.map(r => r.id_recipe);
    const recipe_ingredients = await Ingredient_recipe.findAll({
        where: { id_recipe: recipeIds },
        include: [
            {
                model: Ingredient,
                as: 'id_ingredient_Ingredient',
                attributes: ['id_ingredient', 'name']
            }
        ]
    });
    const recipesWithDetails = recipes.map(recipe => {
        const recipeIngredientList = recipe_ingredients.filter(i => i.id_recipe === recipe.id_recipe)
            .map(i => ({
                id_ingredient: i.id_ingredient_Ingredient.id_ingredient,
                name: i.id_ingredient_Ingredient.name
            }));
        const recipeIngredientIds = recipeIngredientList.map(r => r.id_ingredient)
        const matchingIngredients = ingredients?.filter((id) => recipeIngredientIds.includes(id)).length;
        const totalIngredients = recipeIngredientIds.length;
        const missingIngredients = totalIngredients-matchingIngredients;
        return {
            id_recipe: recipe.id_recipe,
            name: recipe.name,
            image_url: recipe.image_path
                ? `${req.protocol}://${req.get('host')}/${recipe.image_path}` : null,
            author: recipe.added_by_User,
            rating: recipe.get('rating') ? parseFloat(recipe.get('rating')) : null,
            ingredients: recipeIngredientList,
            matched_ingredients: matchingIngredients,
            total_ingredients: totalIngredients,
            missing_ingredients: missingIngredients
        }
    });
    const recipesSorted = recipesWithDetails;
    switch(sortParam) {
        case "newest":
            recipesSorted.sort((a,b) => a.id_recipe-b.id_recipe);
            break;
        case "highest_rated":
            recipesSorted.sort((a,b) => b.rating - a.rating)
            break;
        case "ingredients":
            recipesSorted.sort((a,b) => {
                matchingDiff =  b.matched_ingredients-a.matched_ingredients;
                if (matchingDiff !==0) return matchingDiff;
                return a.missing_ingredients-b.missing_ingredients
            }
            )
    }
    res.status(200).json({
        status: 'success',
        data: recipesSorted
    });
});
const isAuthor = catchAsync(async (req, res, next) => {
    const authUser = req.user;
    const { id_recipe } = req.query;

    if (!id_recipe) {
        return next(new CustomError('Missing required fields', 400));
    }
    // Check if a recipe exists
    const foundRecipe = await Recipe.findOne({
        where: { id_recipe: id_recipe },
    });
    if (!foundRecipe) {
        return next(new CustomError('Recipe not found', 404));
    }
    // Check if the user is the author
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




module.exports = { createRecipe, getRecipe, getRecipes, isAuthor, deleteRecipe, getRandomRecipe };