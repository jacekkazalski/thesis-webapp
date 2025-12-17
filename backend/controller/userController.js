const { where } = require('sequelize');
const sequelize = require('../config/database');
const initModels = require('../models/init-models');
const { User, User_ingredient, Rating, Recipe, Ingredient_recipe, Diet, Ingredient_diet} = initModels(sequelize);
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');
const diet = require('../models/diet');


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

const addUserIngredients = catchAsync(async (req, res, next) => {
    const authUser = req.user;
    const { ingredient } = req.query;
    const {is_excluded} = req.query;
    let ingredients;
    if (Array.isArray(ingredient)) {
        ingredients = ingredient.map(Number);
    } else if (ingredient) {
        ingredients = [Number(ingredient)];
    } else {
        ingredients = null;
    }

    if(!ingredients || is_excluded === undefined) {
        return next(new CustomError('Missing required fields', 400))
    }
    for (const element of ingredients) {
    await User_ingredient.create({
        id_user: authUser.id,
        id_ingredient: element,
        is_excluded: is_excluded
    });
}
    return res.status(201).json({
        status: 'success',
        data: {
            id_user: authUser.id,
            id_ingredient: ingredients,
            is_excluded: is_excluded
        }
    });
});

const removeUserIngredient = catchAsync(async (req, res, next) => {
    const authUser = req.user;
    const { ingredient } = req.query;
    const ingredients = 
    Array.isArray(ingredient) && ingredient.length ? ingredient.map(Number) : null;
    for (const id_ingredient of ingredients) {

    await User_ingredient.destroy({
        where: {
            id_user: authUser.id,
            id_ingredient: id_ingredient
        }
    });
}
    return res.status(200).json({
        status: 'success',
        message: 'Ingredients removed from user successfully'
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
    let userDietIngredients = [];
    try {
        const userDiet = await Diet.findOne({
        where: { id_diet: user.id_diet },
    });
        userDietIngredients = await Ingredient_diet.findAll({
        where: { diet_id: userDiet.id_diet },
    });
    
}
    catch (error) {
        console.log('No diet assigned to user or error fetching diet ingredients');
    }
    
    const allIngredients = userIngredients.concat(userDietIngredients.map(ing => ({
        id_ingredient: ing.id_ingredient,
        id_user: authUser.id,
        is_excluded: true
    })));
    let dietIngredients = allIngredients.filter(ing => ing.is_excluded === true);
    let pantryIngredients = allIngredients.filter(ing => ing.is_excluded === false);
    return res.status(200).json({
        status: 'success',
        data: {
            diet_ingredients: dietIngredients,
            pantry_ingredients: pantryIngredients
        }
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
module.exports = {getUser, deleteUser, addUserIngredient: addUserIngredients, removeUserIngredient, getUserIngredients, addPredefinedDietToUser, removePredefinedDietFromUser}