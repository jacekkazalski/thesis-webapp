const sequelize = require('../config/database');
const initModels = require('../models/init-models');
const { Ingredient, Category } = initModels(sequelize);
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');

const getAllIngredients = catchAsync(async (req, res) => {
    const ingredients = await Ingredient.findAll({
        order: [
            [{ model: Category, as: "id_category_Categories" }, "id_category", "ASC"],
            ["name", "ASC"],
        ],
        include: [{
            model: Category,
            as: 'id_category_Categories',
            attributes: ['id_category', 'name']
        }]
    });

    const formattedIngredients = ingredients.flatMap((ingredient) => {
        const categories = ingredient.id_category_Categories || [];

        return categories.map((category) => ({
            id_ingredient: ingredient.id_ingredient,
            name: ingredient.name,
            category_id: category.id_category,
            category_name: category.name
        }));
    });

    res.status(200).json({
        status: 'success',
        data: formattedIngredients
    });
});

module.exports = { getAllIngredients };
