const sequelize = require('../config/database');
const initModels = require('../models4/init-models');
const { Favourite} = initModels(sequelize);
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

module.exports = { toggleFavourite, isFavourite };