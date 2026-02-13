const sequelize = require("../config/database");
const { Op, fn, col, literal, QueryTypes } = require("sequelize");
const initModels = require("../models/init-models");
const {
  Recipe,
  Ingredient,
  User,
  Ingredient_recipe,
  Favourite,
  Rating,
  User_ingredient,
  Ingredient_diet,
} = initModels(sequelize);
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/customError");

const getRecipe = catchAsync(async (req, res, next) => {
  const { id_recipe } = req.query;
  if (!id_recipe) {
    return next(new CustomError("Missing required fields", 400));
  }
  const foundRecipe = await Recipe.findOne({
    where: { id_recipe: id_recipe },
  });
  if (!foundRecipe) {
    return next(new CustomError("Recipe not found", 404));
  }
  const author = await User.findOne({
    where: { id_user: foundRecipe.added_by },
    attributes: ["id_user", "username"],
  });
  const rating = await Rating.findOne({
    where: { id_recipe: id_recipe },
    attributes: [[fn("AVG", col("value")), "averageRating"]],
  });

  const ratingParameter = rating
    ? parseFloat(rating.get("averageRating"))
    : null;
  const ingredients = await Ingredient_recipe.findAll({
    where: { id_recipe: id_recipe },
    include: [
      {
        model: Ingredient,
        as: "id_ingredient_Ingredient",
        attributes: ["name"],
      },
    ],
  });
  const ingredientsMapped = ingredients.map((ingredient) => {
    return {
      id_ingredient: ingredient.id_ingredient,
      name: ingredient.id_ingredient_Ingredient.name,
      quantity: ingredient.quantity,
    };
  });

  return res.status(200).json({
    status: "success",
    name: foundRecipe.name,
    id_recipe: foundRecipe.id_recipe,
    instructions: foundRecipe.instructions,
    image_url: foundRecipe.image_path
      ? `${req.protocol}://${req.get("host")}/${foundRecipe.image_path}`
      : null,
    ingredients: ingredientsMapped,
    author: author,
    rating: ratingParameter,
  });
});
const getRandomRecipe = catchAsync(async (req, res, next) => {
  let randomId = null;
  const attempts = 5;

  for (let i = 0; i < attempts; i++) {
    const [rows] = await sequelize.query(`
            SELECT "id_recipe"
            FROM "public"."Recipe" TABLESAMPLE SYSTEM (1)
            LIMIT 1
        `);
    if (rows && rows.length > 0) {
      randomId = rows[0].id_recipe;
      break;
    }
  }

  if (!randomId) {
    const fallback = await Recipe.findOne({
      order: [["id_recipe", "ASC"]],
    });
    if (!fallback) {
      return next(new CustomError("No recipes found", 404));
    }
    randomId = fallback.id_recipe;
  }

  return res.status(200).json({
    status: "success",
    id_recipe: randomId,
  });
});
const createRecipe = catchAsync(async (req, res, next) => {
  const { name, instructions, ingredients } = req.body;
  const authUser = req.user;
  const imagePath = req.file ? `./images/${req.file.filename}` : null;
  console.log(authUser);

  if (
    !name ||
    name.trim() === "" ||
    !instructions ||
    instructions.trim() === "" ||
    !ingredients
  ) {
    return next(new CustomError("Missing required fields", 400));
  }

  const ingredientList =
    typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

  const newRecipe = await sequelize.transaction(async (t) => {
    const createdRecipe = await Recipe.create(
      {
        name: name,
        instructions: instructions,
        added_by: authUser.id,
        image_path: imagePath,
      },
      { transaction: t },
    );
    if (!createdRecipe) {
      return next(new CustomError("Recipe could not be created", 500));
    }

    for (const element of ingredientList) {
      // Check if ingredient with given id exists
      const ingredientExists = await Ingredient.findOne({
        where: { id_ingredient: element.id_ingredient },
        transaction: t,
      });
      if (!ingredientExists) {
        throw new CustomError(
          `Ingredient with id ${element.id_ingredient} not found`,
          404,
        );
      }
      await Ingredient_recipe.create(
        {
          id_ingredient: element.id_ingredient,
          id_recipe: createdRecipe.id_recipe,
          quantity: element.quantity,
        },
        { transaction: t },
      );
    }
    return createdRecipe;
  });

  return res.status(201).json({
    status: "success",
    data: { id_recipe: newRecipe.id_recipe },
  });
});
const updateRecipe = catchAsync(async (req, res, next) => {
  const { id_recipe, name, instructions, ingredients } = req.body;
  const authUser = req.user;
  const imagePath = req.file ? `./images/${req.file.filename}` : null;
  // Check if parameters aren't empty strings and are present
  if (
    !name ||
    name.trim() === "" ||
    !instructions ||
    instructions.trim() === "" ||
    !ingredients
  ) {
    return next(new CustomError("Missing required fields", 400));
  }
  const ingredientList =
    typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
  await sequelize.transaction(async (t) => {
    const foundRecipe = await Recipe.findOne({
      where: { id_recipe: id_recipe },
      transaction: t,
    });
    if (!foundRecipe) throw new CustomError("Recipe not found", 404);
    // Check if user is author
    if (foundRecipe.added_by !== authUser.id)
      throw new CustomError("Unauthorized operation", 403);
    await Recipe.update(
      {
        name: name ?? foundRecipe.name,
        instructions: instructions ?? foundRecipe.instructions,
        image_path: imagePath ?? foundRecipe.image_path,
      },
      {
        where: { id_recipe: id_recipe },
        transaction: t,
      },
    );
    await Ingredient_recipe.destroy({
      where: { id_recipe: id_recipe },
      transaction: t,
    });
    // Create new ingredient_recipe entries
    for (const element of ingredientList) {
      const ingredientExists = await Ingredient.findOne({
        where: { id_ingredient: element.id_ingredient },
        transaction: t,
      });
      if (!ingredientExists) {
        throw new CustomError(
          `Ingredient with id ${element.id_ingredient} not found`,
          404,
        );
      }
      await Ingredient_recipe.create(
        {
          id_ingredient: element.id_ingredient,
          id_recipe: id_recipe,
          quantity: element.quantity,
        },
        { transaction: t },
      );
    }
  });
  return res.status(200).json({
    status: "success",
    message: "Recipe updated successfully",
  });
});

const deleteRecipe = catchAsync(async (req, res, next) => {
  const { id_recipe } = req.query;
  const authUser = req.user;
  if (!id_recipe) {
    return next(new CustomError("Missing required fields", 400));
  }
  // Check if recipe exists
  const foundRecipe = await Recipe.findOne({
    where: { id_recipe: id_recipe },
  });
  if (!foundRecipe) {
    return next(new CustomError("Recipe not found", 404));
  }
  // Check if user is author or moderator
  if (foundRecipe.added_by !== authUser.id && authUser.role !== "moderator") {
    return next(new CustomError("Unauthorized operation", 403));
  }

  // Create a transaction to delete the recipe and its associated data
  const transaction = await Recipe.sequelize.transaction();
  try {
    await Rating.destroy({ where: { id_recipe: id_recipe } });
    await Ingredient_recipe.destroy({ where: { id_recipe: id_recipe } });
    await Favourite.destroy({ where: { id_recipe: id_recipe } });
    await Recipe.destroy({ where: { id_recipe: id_recipe } });

    await transaction.commit();

    return res.status(200).json({
      status: "success",
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    return next(new CustomError("Recipe could not be deleted", 500));
  }
});

const getRecipes = catchAsync(async (req, res, next) => {
  const {
    search,
    ingredient,
    sortBy,
    matchOnly,
    useSaved,
    useDiet,
    page: pageQuery,
    limit: limitQuery,
  } = req.query;

  const authUser = req.user;

  const DEFAULT_LIMIT = 48;
  const MAX_LIMIT = 200;
  const page = Number(pageQuery) > 0 ? Number(pageQuery) : 1;
  let limit = Number(limitQuery) > 0 ? Number(limitQuery) : DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;
  const offset = (page - 1) * limit;

  const allowedSortParams = ["newest", "highest_rated", "ingredients"];
  const sortParam = allowedSortParams.includes(sortBy) ? sortBy : "newest";

  const queryIngredients = Array.isArray(ingredient)
    ? ingredient.map(Number)
    : ingredient != null
      ? [Number(ingredient)]
      : [];
  let ingredients = queryIngredients.filter(Number.isFinite);

  let excludedIngredients = [];
  if (authUser && (useSaved == 1 || useDiet == 1)) {
    const userId = authUser.id_user ?? authUser.id;

    const userIngredients = await User_ingredient.findAll({
      where: { id_user: userId },
    });
    const userDiet = await User.findOne({
      where: { id_user: userId },
      attributes: ["id_diet"],
    });

    if (useDiet == 1) {
      excludedIngredients = userIngredients
        .filter((ui) => ui.is_excluded)
        .map((ui) => ui.id_ingredient);
      if (userDiet && userDiet.id_diet) {
        const dietIngredients = await Ingredient_diet.findAll({
          where: { id_diet: userDiet.id_diet },
        });
        excludedIngredients = [
          ...excludedIngredients,
          ...dietIngredients.map((di) => di.id_ingredient),
        ];
      }
    }

    if (useSaved == 1) {
      const includedIngredients = userIngredients
        .filter((ui) => !ui.is_excluded)
        .map((ui) => ui.id_ingredient);

      ingredients = [...ingredients, ...includedIngredients];
    }
  }

  

  ingredients = [...new Set(ingredients.map(Number))];
  excludedIngredients = [...new Set(excludedIngredients.map(Number))];
  const searchQuery = search ? search.trim() : "";
  const searchPattern = searchQuery ? `%${searchQuery}%` : null;


  const useCandidateFiltering = ingredients.length > 0;
  const candidateCte = ` 
    candidates AS (
      SELECT DISTINCT ir.id_recipe
      FROM public."Ingredient_recipe" ir
      WHERE ir.id_ingredient = ANY($1::int[])
    )
  `;
  const exludeCte = `
    excluded AS (
      SELECT DISTINCT irx.id_recipe
      FROM public."Ingredient_recipe" irx
      WHERE irx.id_ingredient = ANY($2::int[])
    )
  `;

  const withCte = useCandidateFiltering
  ? `WITH ${candidateCte}, ${exludeCte}`
  : `WITH ${exludeCte}`;
  const joinClause = useCandidateFiltering
    ? `JOIN candidates c ON r.id_recipe = c.id_recipe`
    : "";

  const whereClause = `
    WHERE e.id_recipe IS NULL
    AND ($3::text IS NULL OR r.name ILIKE $3)
  `;
  const orderBy =
    sortParam === "highest_rated"
      ? `ORDER BY rating DESC, r.id_recipe DESC`
      : sortParam === "ingredients" && useCandidateFiltering
        ? `ORDER BY matched_count DESC, total_count ASC, r.id_recipe DESC`
        : `ORDER BY r.id_recipe DESC`;
  
  const binds = [
    ingredients.length ? ingredients : [],
    excludedIngredients.length ? excludedIngredients : [],
    searchPattern,
    limit,
    offset,
  ]

  const sql = `
    ${withCte}
    , ir_aggr AS (
      SELECT
        ir.id_recipe,
        COUNT(ir.id_ingredient) AS total_count,
        COUNT(*) FILTER (WHERE ir.id_ingredient = ANY($1::int[])) AS matched_count
      FROM public."Ingredient_recipe" ir
      ${useCandidateFiltering ? `JOIN candidates c ON ir.id_recipe = c.id_recipe` : ``}
      GROUP BY ir.id_recipe
      ),
      rt_aggr AS (
        SELECT
          rt.id_recipe,
          COALESCE(AVG(rt.value), 0) AS rating
        FROM public."Rating" rt
        ${useCandidateFiltering ? `JOIN candidates c ON rt.id_recipe = c.id_recipe` : ``}
        GROUP BY rt.id_recipe
      ) 
      SELECT
        r.id_recipe,
        r.name,
        r.image_path,
        ir_aggr.total_count AS total_count,
        ir_aggr.matched_count AS matched_count,
        rt_aggr.rating AS rating
      FROM public."Recipe" r
      ${joinClause}
      LEFT JOIN excluded e ON e.id_recipe = r.id_recipe
      LEFT JOIN ir_aggr ON ir_aggr.id_recipe = r.id_recipe
      LEFT JOIN rt_aggr ON rt_aggr.id_recipe = r.id_recipe
      ${whereClause}
      ${orderBy}
      LIMIT $4 OFFSET $5`
  

  const recipes = await sequelize.query(sql, {type: QueryTypes.SELECT, bind: binds})
  const recipesFormatted = recipes.map((recipe) => {
    return {
      id_recipe: recipe.id_recipe,
      name: recipe.name,
      image_url: recipe.image_path
        ? `${req.protocol}://${req.get("host")}/${recipe.image_path}`
        : null,
      rating: Number(Number(recipe.rating).toFixed(2)) ?? 0,
      matched_ingredients: Number(recipe.matched_count) ?? 0,
      total_ingredients: Number(recipe.total_count) ?? 0,
    };
  });

  return res.status(200).json({
    status: "success",
    data: recipesFormatted,
  });
});

const isAuthor = catchAsync(async (req, res, next) => {
  const authUser = req.user;
  const { id_recipe } = req.query;

  if (!id_recipe) {
    return next(new CustomError("Missing required fields", 400));
  }
  // Check if a recipe exists
  const foundRecipe = await Recipe.findOne({
    where: { id_recipe: id_recipe },
  });
  if (!foundRecipe) {
    return next(new CustomError("Recipe not found", 404));
  }
  // Check if the user is the author
  if (foundRecipe.added_by !== authUser.id) {
    return res.status(200).json({
      status: "success",
      isAuthor: false,
    });
  }
  return res.status(200).json({
    status: "success",
    isAuthor: true,
  });
});

module.exports = {
  createRecipe,
  getRecipe,
  getRecipes,
  isAuthor,
  deleteRecipe,
  getRandomRecipe,
  updateRecipe,
};
