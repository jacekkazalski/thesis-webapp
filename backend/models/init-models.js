var DataTypes = require("sequelize").DataTypes;
var _Category = require("./category");
var _Diet = require("./diet");
var _Favourite = require("./favourite");
var _Ingredient = require("./ingredient");
var _Ingredient_category = require("./ingredient_category");
var _Ingredient_diet = require("./ingredient_diet");
var _Ingredient_recipe = require("./ingredient_recipe");
var _Rating = require("./rating");
var _Recipe = require("./recipe");
var _User = require("./user");
var _User_ingredient = require("./user_ingredient");

function initModels(sequelize) {
  var Category = _Category(sequelize, DataTypes);
  var Diet = _Diet(sequelize, DataTypes);
  var Favourite = _Favourite(sequelize, DataTypes);
  var Ingredient = _Ingredient(sequelize, DataTypes);
  var Ingredient_category = _Ingredient_category(sequelize, DataTypes);
  var Ingredient_diet = _Ingredient_diet(sequelize, DataTypes);
  var Ingredient_recipe = _Ingredient_recipe(sequelize, DataTypes);
  var Rating = _Rating(sequelize, DataTypes);
  var Recipe = _Recipe(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);
  var User_ingredient = _User_ingredient(sequelize, DataTypes);

  Ingredient.belongsToMany(Recipe, { as: 'id_recipe_Recipe_Ingredient_recipes', through: Ingredient_recipe, foreignKey: "id_ingredient", otherKey: "id_recipe" });
  Ingredient.belongsToMany(User, { as: 'id_user_User_User_ingredients', through: User_ingredient, foreignKey: "id_ingredient", otherKey: "id_user" });
  Recipe.belongsToMany(Ingredient, { as: 'id_ingredient_Ingredients', through: Ingredient_recipe, foreignKey: "id_recipe", otherKey: "id_ingredient" });
  Recipe.belongsToMany(User, { as: 'id_user_Users', through: Favourite, foreignKey: "id_recipe", otherKey: "id_user" });
  Recipe.belongsToMany(User, { as: 'id_user_User_Ratings', through: Rating, foreignKey: "id_recipe", otherKey: "id_user" });
  User.belongsToMany(Ingredient, { as: 'id_ingredient_Ingredient_User_ingredients', through: User_ingredient, foreignKey: "id_user", otherKey: "id_ingredient" });
  User.belongsToMany(Recipe, { as: 'id_recipe_Recipes', through: Favourite, foreignKey: "id_user", otherKey: "id_recipe" });
  User.belongsToMany(Recipe, { as: 'id_recipe_Recipe_Ratings', through: Rating, foreignKey: "id_user", otherKey: "id_recipe" });
  Ingredient_recipe.belongsTo(Ingredient, { as: "id_ingredient_Ingredient", foreignKey: "id_ingredient"});
  Ingredient.hasMany(Ingredient_recipe, { as: "Ingredient_recipes", foreignKey: "id_ingredient"});
  User_ingredient.belongsTo(Ingredient, { as: "id_ingredient_Ingredient", foreignKey: "id_ingredient"});
  Ingredient.hasMany(User_ingredient, { as: "User_ingredients", foreignKey: "id_ingredient"});
  Favourite.belongsTo(Recipe, { as: "id_recipe_Recipe", foreignKey: "id_recipe"});
  Recipe.hasMany(Favourite, { as: "Favourites", foreignKey: "id_recipe"});
  Ingredient_recipe.belongsTo(Recipe, { as: "id_recipe_Recipe", foreignKey: "id_recipe"});
  Recipe.hasMany(Ingredient_recipe, { as: "Ingredient_recipes", foreignKey: "id_recipe"});
  Rating.belongsTo(Recipe, { as: "id_recipe_Recipe", foreignKey: "id_recipe"});
  Recipe.hasMany(Rating, { as: "Ratings", foreignKey: "id_recipe"});
  Favourite.belongsTo(User, { as: "id_user_User", foreignKey: "id_user"});
  User.hasMany(Favourite, { as: "Favourites", foreignKey: "id_user"});
  Rating.belongsTo(User, { as: "id_user_User", foreignKey: "id_user"});
  User.hasMany(Rating, { as: "Ratings", foreignKey: "id_user"});
  Recipe.belongsTo(User, { as: "added_by_User", foreignKey: "added_by"});
  User.hasMany(Recipe, { as: "Recipes", foreignKey: "added_by"});
  User_ingredient.belongsTo(User, { as: "id_user_User", foreignKey: "id_user"});
  User.hasMany(User_ingredient, { as: "User_ingredients", foreignKey: "id_user"});
  Ingredient_diet.belongsTo(Ingredient, { as: "id_ingredient_Ingredient", foreignKey: "id_ingredient"});
  Ingredient.hasMany(Ingredient_diet, { as: "Ingredient_diets", foreignKey: "id_ingredient"});
  Ingredient_diet.belongsTo(Diet, { as: "id_diet_Diet", foreignKey: "id_diet"});
  Diet.hasMany(Ingredient_diet, { as: "Ingredient_diets", foreignKey: "id_diet"});

  return {
    Category,
    Diet,
    Favourite,
    Ingredient,
    Ingredient_category,
    Ingredient_diet,
    Ingredient_recipe,
    Rating,
    Recipe,
    User,
    User_ingredient,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
