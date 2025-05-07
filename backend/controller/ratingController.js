const sequelize = require('../config/database');
const initModels = require('../models/init-models');
const {Rating} = initModels(sequelize);
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');

const getUserRating = catchAsync(async (req, res, next) => {
    const { id_recipe } = req.query;
    const authUser = req.user;
    if (!id_recipe) {
        return next(new CustomError('Missing required fields', 400));
    }
    const foundRating = await Rating.findOne({
        where: {
            id_user: authUser.id_user,
            id_recipe: id_recipe
        }
    });
    if (!foundRating) {
        return res.status(200).json({
            status: 'success',
            rating: null
        });
    }
    return res.status(200).json({
        status: 'success',
        rating: foundRating.value
    });
}
);

const getRecipeRating = catchAsync(async (req, res, next) => {
    const { id_recipe } = req.query;
    if (!id_recipe) {
        return next(new CustomError('Missing required fields', 400));
    }
    const foundRating = await Rating.findAll({
        where: {
            id_recipe: id_recipe
        }
    });
    if (!foundRating) {
        return res.status(200).json({
            status: 'success',
            rating: null
        });
    }
    const rating = foundRating.reduce((acc, curr) => acc + curr.value, 0) / foundRating.length;
    return res.status(200).json({
        status: 'success',
        rating: rating
    });
});
const addRating = catchAsync(async (req, res, next) => {
    const { id_recipe, value } = req.body;
    const authUser = req.user;
    if (!id_recipe || !value || value < 1 || value > 5) {
        return next(new CustomError('Missing required fields', 400));
    }
    const foundRating = await Rating.findOne({
        where: {
            id_user: authUser.id,
            id_recipe: id_recipe
        }
    });
    if (foundRating) {
        foundRating.value = value;
        await foundRating.save();
    } else {
        await Rating.create({
            id_user: authUser.id,
            id_recipe: id_recipe,
            value: value
        });
    }
    return res.status(200).json({
        status: 'success',
        message: 'Rating added successfully'
    });
});
const deleteRating = catchAsync(async (req, res, next) => {
    const { id_recipe } = req.query;
    const authUser = req.user;
    if (!id_recipe) {
        return next(new CustomError('Missing required fields', 400));
    }
    const foundRating = await Rating.findOne({
        where: {
            id_user: authUser.id,
            id_recipe: id_recipe
        }
    });
    if (!foundRating) {
        return res.status(200).json({
            status: 'success',
            message: 'Rating not found'
        });
    }
    await foundRating.destroy();
    return res.status(200).json({
        status: 'success',
        message: 'Rating deleted successfully'
    });
}
);

module.exports = {
    getUserRating,
    getRecipeRating,
    addRating,
    deleteRating
};