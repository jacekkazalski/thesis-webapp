const sequelize = require('../config/database');
const { Op, fn, col, literal } = require('sequelize');
const initModels = require('../models/init-models');
const { Recipe, Ingredient, User, Ingredient_recipe, Favourite, Rating, User_ingredient } = initModels(sequelize);
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
    const {
        name,
        instructions,
        ingredients,
    } = req.body;
    const authUser = req.user;
    const imagePath = req.file ? `./images/${req.file.filename}` : null;
    console.log(authUser);

    // Check if parameters aren't empty strings and are present
    if (!name || name.trim() === '' ||
        !instructions || instructions.trim() === '' ||
        !ingredients) {
        return next(new CustomError('Missing required fields', 400));
    }

    const ingredientList = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;

    const newRecipe = await sequelize.transaction(async (t) => {
        const createdRecipe = await Recipe.create({
            name: name,
            instructions: instructions,
            added_by: authUser.id,
            image_path: imagePath
        }, { transaction: t });
        if (!createdRecipe) {
            return next(new CustomError('Recipe could not be created', 500));
        }

        for (const element of ingredientList) {
            // Check if ingredient with given id exists
            const ingredientExists = await Ingredient.findOne({
                where: { id_ingredient: element.id_ingredient },
                transaction: t
            });
            if (!ingredientExists) {
                throw new CustomError(`Ingredient with id ${element.id_ingredient} not found`, 404);
            }
            await Ingredient_recipe.create({
                id_ingredient: element.id_ingredient,
                id_recipe: createdRecipe.id_recipe,
                quantity: element.quantity
            }, { transaction: t });
        }
        return createdRecipe;
    });

    return res.status(201).json({
        status: 'success',
        data: { id_recipe: newRecipe.id_recipe }
    });
});
const updateRecipe = catchAsync(async (req, res, next) => {
    const {
        id_recipe,
        name,
        instructions,
        ingredients,
    } = req.body;
    const authUser = req.user;
    const imagePath = req.file ? `./images/${req.file.filename}` : null;
    // Check if parameters aren't empty strings and are present
    if (!name || name.trim() === '' ||
        !instructions || instructions.trim() === '' ||
        !ingredients) {
        return next(new CustomError('Missing required fields', 400));
    }
    const ingredientList = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    await sequelize.transaction(async (t) => {
        const foundRecipe = await Recipe.findOne({
            where: { id_recipe: id_recipe },
            transaction: t
        });
        if (!foundRecipe) throw new CustomError('Recipe not found', 404);
        // Check if user is author
        if (foundRecipe.added_by !== authUser.id) throw new CustomError('Unauthorized operation', 403);
        await Recipe.update({
            name: name ?? foundRecipe.name,
            instructions: instructions ?? foundRecipe.instructions,
            image_path: imagePath ?? foundRecipe.image_path
        }, {
            where: { id_recipe: id_recipe },
            transaction: t
        });
        await Ingredient_recipe.destroy({ where: { id_recipe: id_recipe }, transaction: t });
        // Create new ingredient_recipe entries
        for (const element of ingredientList) {
            const ingredientExists = await Ingredient.findOne({
                where: { id_ingredient: element.id_ingredient },
                transaction: t
            });
            if (!ingredientExists) {
                throw new CustomError(`Ingredient with id ${element.id_ingredient} not found`, 404);
            }
            await Ingredient_recipe.create({
                id_ingredient: element.id_ingredient,
                id_recipe: id_recipe,
                quantity: element.quantity
            }, { transaction: t });
        }
    });
    return res.status(200).json({
        status: 'success',
        message: 'Recipe updated successfully'
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
    // Check if user is author or moderator
    if (foundRecipe.added_by !== authUser.id && authUser.role !== 'moderator') {
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
    const {
        search: searchQuery,
        ingredient,
        sortBy,
        matchOnly,
        useSaved,
        useDiet,
        page: pageQuery,
        limit: limitQuery,
    } = req.query;

    const authUser = req.user;

    const DEFAULT_LIMIT = 50;
    const MAX_LIMIT = 200;
    const page = Number(pageQuery) > 0 ? Number(pageQuery) : 1;
    let limit = Number(limitQuery) > 0 ? Number(limitQuery) : DEFAULT_LIMIT;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
    const offset = (page - 1) * limit;

    const allowedSortParams = ['newest', 'highest_rated', 'ingredients'];
    const sortParam = allowedSortParams.includes(sortBy) ? sortBy : 'newest';

    const queryIngredients =
        Array.isArray(ingredient) ? ingredient.map(Number) : (ingredient != null ? [Number(ingredient)] : []);
    let ingredients = queryIngredients.filter(Number.isFinite);

    let excludedIngredients = [];
    if (authUser && (useSaved == 1 || useDiet == 1)) {

        const userId = authUser.id_user ?? authUser.id;

        const userIngredients = await User_ingredient.findAll({
            where: { id_user: userId }
        });

        if (useDiet == 1) {
            excludedIngredients = userIngredients
                .filter(ui => ui.is_excluded)
                .map(ui => ui.id_ingredient);
        }

        if (useSaved == 1) {
            const includedIngredients = userIngredients
                .filter(ui => !ui.is_excluded)
                .map(ui => ui.id_ingredient);

            ingredients = [...ingredients, ...includedIngredients];
        }
    }

    ingredients = [...new Set(ingredients.map(Number))];
    const ingListSql = ingredients.length ? ingredients.join(',') : null;

    const whereClause = {};
    if (searchQuery) {
        whereClause.name = { [Op.iLike]: `%${searchQuery}%` };
    }

    if (excludedIngredients.length) {
        whereClause[Op.and] = whereClause[Op.and] || [];
        whereClause[Op.and].push(literal(`NOT EXISTS (
            SELECT 1
            FROM public."Ingredient_recipe" irx
            WHERE irx."id_recipe" = "Recipe"."id_recipe"
            AND irx."id_ingredient" IN (${excludedIngredients.join(',')})
    )`));
    }



    const attributes = [
        'id_recipe',
        'name',
        'image_path',
        [
            literal(`(
        SELECT COALESCE(AVG(rt."value"), 0)
        FROM public."Rating" rt
        WHERE rt."id_recipe" = "Recipe"."id_recipe"
      )`),
            'rating',
        ],
    ];

    if (ingredients.length) {
        attributes.push(
            [
                literal(`(
          SELECT COUNT(*)
          FROM public."Ingredient_recipe" ir
          WHERE ir."id_recipe" = "Recipe"."id_recipe"
            AND ir."id_ingredient" IN (${ingListSql})
        )`),
                'matched_count',
            ],
            [
                literal(`(
          SELECT COUNT(*)
          FROM public."Ingredient_recipe" ir
          WHERE ir."id_recipe" = "Recipe"."id_recipe"
            AND ir."id_ingredient" NOT IN (${ingListSql})
        )`),
                'missing_count',
            ]
        );

    }
    else if (!ingredients.length) {
        attributes.push(
            [literal(`0`), 'matched_count'],
            [
                literal(`(
          SELECT COUNT(*)
          FROM public."Ingredient_recipe" ir
          WHERE ir."id_recipe" = "Recipe"."id_recipe"
        )`),
                'missing_count',
            ]
        );
    }

    const order = [];
    if (sortParam === 'newest') {
        order.push(['id_recipe', 'DESC']);
        order.push([literal(`"rating"`), 'DESC']);
    } else if (sortParam === 'highest_rated') {
        order.push([literal(`"rating"`), 'DESC']);
    } else if (sortParam === 'ingredients' && ingredients.length) {
        order.push([literal(`"missing_count"`), 'ASC']);
        order.push([literal(`"matched_count"`), 'DESC']);
        order.push([literal(`"rating"`), 'DESC']);
    } else {
        order.push(['id_recipe', 'DESC']);
    }
    const recipes = await Recipe.findAll({
        where: whereClause,
        include: [
            {
                model: User,
                as: 'added_by_User',
                attributes: ['username', 'id_user'],
            },
        ],
        attributes,
        limit,
        offset,
        subQuery: false,
        order,
    });

    if (recipes.length === 0) {
        return res.status(200).json({ status: 'success', data: [] });
    }

    const recipesWithDetails = recipes.map(recipe => {

        const matchingIngredients = parseInt(recipe.get('matched_count'));
        const missingIngredients = parseInt(recipe.get('missing_count'));
        const totalIngredients = matchingIngredients + missingIngredients;

        return {
            id_recipe: recipe.id_recipe,
            name: recipe.name,
            image_url: recipe.image_path
                ? `${req.protocol}://${req.get('host')}/${recipe.image_path}`
                : null,
            author: recipe.added_by_User,
            rating: recipe.get('rating') ? parseFloat(recipe.get('rating')) : null,
            matched_ingredients: matchingIngredients,
            total_ingredients: totalIngredients,
            missing_ingredients: missingIngredients,
        };
    });

    let recipesFiltered = recipesWithDetails;
    if (matchOnly == 1 && ingredients.length) {
        recipesFiltered = recipesFiltered.filter(r => r.missing_ingredients === 0);
    }

    return res.status(200).json({
        status: 'success',
        data: recipesFiltered,
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




module.exports = { createRecipe, getRecipe, getRecipes, isAuthor, deleteRecipe, getRandomRecipe, updateRecipe };