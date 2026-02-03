const sequelize = require('../config/database');
const {literal} = require('sequelize');
const initModels = require('../models/init-models');
const { Favourite, Recipe, User} = initModels(sequelize);
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');

const toggleFavourite = catchAsync(async (req, res, next) => {
    const body = req.body;
    const authUser = req.user;
    // Check if favourite exists
    const existingFavourite = await Favourite.findOne({
        where: {
            id_user: authUser.id,
            id_recipe: body.id_recipe
        }
    });
    if (existingFavourite) {
        // If it exists, delete it
        await Favourite.destroy({
            where: {
                id_user: authUser.id,
                id_recipe: body.id_recipe
            }
        });
        return res.status(200).json({
            status: 'success',
            message: 'Favourite removed',
            isFavourite: false
        });
    }
    // If it doesn't exist, create it
    const newFavourite = await Favourite.create({
        id_user: authUser.id,
        id_recipe: body.id_recipe
    });
    return res.status(201).json({
        status: 'success',
        message: 'Added to favourites ',
        isFavourite: true
    });


});

const isFavourite = catchAsync(async (req, res, next) => {
    const authUser = req.user;
    const { id_recipe } = req.query;
    if (!id_recipe) {
        return next(new CustomError('Missing required fields', 400));
    }
    const favouriteRecipe = await Favourite.findOne({
        where: {
            id_user: authUser.id,
            id_recipe: id_recipe
        }
    });
    if (favouriteRecipe) {
        return res.status(200).json({
            status: 'success',
            isFavourite: true
        });
    } else {
        return res.status(200).json({
            status: 'success',
            isFavourite: false
        });
    }
});
const getFavourites = catchAsync(async (req, res, next) => {
    const { id_user } = req.query;
    if (!id_user) {
        return next(new CustomError('Missing required fields', 400));
    }
    const favouriteRecipeIds = await Favourite.findAll({
        attributes: ['id_recipe'],
        where: { id_user: id_user },
    });
    const recipes = await Recipe.findAll({
        attributes: [
            'id_recipe',
            'name', 
            'image_path',
            [
              literal(`(
                SELECT COALESCE(AVG(value), 0)
                FROM "Rating" rt
                WHERE rt."id_recipe" = "Recipe"."id_recipe"
              )`),
              'rating',
            ],],
        where: {
            id_recipe: favouriteRecipeIds.map(fav => fav.id_recipe)
        },
        include: [
            {
                model: User,
                as: 'added_by_User',
                attributes: ['id_user', 'username']
            }
        ]
    });

    const recipesFormatted = recipes.map(recipe => ({
        id_recipe: recipe.id_recipe,
        name: recipe.name,
        image_url: recipe.image_path ? 
        `${req.protocol}://${req.get('host')}/${recipe.image_path}` : null,
        author: recipe.added_by_User,
        rating: parseFloat(recipe.get('rating')),
    }));
    return res.status(200).json({
        status: 'success',
        data: recipesFormatted
    });
});

module.exports = { toggleFavourite, isFavourite, getFavourites };