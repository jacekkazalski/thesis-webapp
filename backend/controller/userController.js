const { where } = require('sequelize');
const sequelize = require('../config/database');
const initModels = require('../models/init-models');
const { User, User_ingredient, Rating, Recipe, Ingredient_recipe, Diet, Ingredient_diet} = initModels(sequelize);
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');


const getUser = catchAsync(async (req, res, next) => {
    const { id_user } = req.query;
    if(!id_user) {
        return next(new CustomError('Missing required fields', 400))

    }
    const foundUser = await User.findOne({
        where: { id_user: id_user },
    });
    if(!foundUser) {
        return next(new CustomError('User not found', 404))
    }
    return res.status(200).json({
        status: 'success',
        id_user: foundUser.id_user,
        username: foundUser.username,
    })
});

const deleteUser = catchAsync(async (req, res, next) => {
  const authUser = req.user;
  console.log(`Deleting user with ID: ${authUser.id}`);

  await sequelize.transaction(async (t) => {
    const user = await User.findOne({ where: { id_user: authUser.id }, transaction: t });

    await User_ingredient.destroy({ where: { id_user: authUser.id }, transaction: t });
    await Rating.destroy({ where: { id_user: authUser.id }, transaction: t });

    await Ingredient_diet.destroy({ where: { id_user: authUser.id }, transaction: t });

    const recipes = await Recipe.findAll({ where: { added_by: authUser.id }, transaction: t });
    for (const recipe of recipes) {
      await Ingredient_recipe.destroy({ where: { id_recipe: recipe.id_recipe }, transaction: t });
    }
    await Recipe.destroy({ where: { added_by: authUser.id }, transaction: t });

    await User.destroy({ where: { id_user: authUser.id }, transaction: t });
  });
  return res.status(200).json({
    status: 'success',
    message: 'User and associated data deleted successfully',
  });
});

const addUserIngredient = catchAsync(async (req, res, next) => {
    const authUser = req.user;
    const { id_ingredient } = req.body;
    const {is_excluded} = req.body;

    if(!id_ingredient || is_excluded === undefined) {
        return next(new CustomError('Missing required fields', 400))
    }
    await User_ingredient.create({
        id_user: authUser.id,
        id_ingredient: id_ingredient,
        is_excluded: is_excluded
    });
    return res.status(201).json({
        status: 'success',
        data: {
            id_user: authUser.id,
            id_ingredient: id_ingredient,
            is_excluded: is_excluded
        }
    });
});

const removeUserIngredient = catchAsync(async (req, res, next) => {
    const authUser = req.user;
    const { id_ingredient } = req.body;
    if(!id_ingredient) {
        return next(new CustomError('Missing required fields', 400))
    }
    await User_ingredient.destroy({
        where: {
            id_user: authUser.id,
            id_ingredient: id_ingredient
        }
    });
    return res.status(200).json({
        status: 'success',
        message: 'Ingredient removed from user successfully'
    });
});

const getUserIngredients = catchAsync(async (req, res, next) => {
    const authUser = req.user;
    const userIngredients = await User_ingredient.findAll({
        where: { id_user: authUser.id },
    });
    const user = await User.findOne({
        where: { id_user: authUser.id },
    });
    const userDiet = await Diet.findOne({
        where: { id_diet: user.id_diet },
    });
    const userDietIngredients = await Ingredient_diet.findAll({
        where: { diet_id: userDiet.id_diet },
    });
    const allIngredients = userIngredients.concat(userDietIngredients.map(ing => ({
        id_ingredient: ing.id_ingredient,
        id_user: authUser.id,
        is_excluded: true
    })));
    return res.status(200).json({
        status: 'success',
        data: allIngredients
    });
});

const addPredefinedDietToUser = catchAsync(async (req, res, next) => {
    const authUser = req.user;
    const {diet_id} = req.body;
    if(!diet_id) {
        return next(new CustomError('Missing required fields', 400))
    }
    await User.update({id_diet: diet_id}, {
        where: {id_user: authUser.id}
    });
    return res.status(200).json({
        status: 'success',
        message: 'Diet added to user successfully'
    });
});
const removePredefinedDietFromUser = catchAsync(async (req, res, next) => {
    const authUser = req.user;
    await User.update({id_diet: null}, {
        where: {id_user: authUser.id}
    });
    return res.status(200).json({
        status: 'success',
        message: 'Diet removed from user successfully'
    });
});
module.exports = {getUser, deleteUser, addUserIngredient, removeUserIngredient, getUserIngredients, addPredefinedDietToUser, removePredefinedDietFromUser}