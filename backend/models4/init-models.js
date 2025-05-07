var DataTypes = require("sequelize").DataTypes;
var _Favourite = require("./favourite");
var _Ingredient = require("./ingredient");
var _Ingredient_recipe = require("./ingredient_recipe");
var _Rating = require("./rating");
var _Recipe = require("./recipe");
var _SequelizeMeta = require("./sequelize_meta");
var _User = require("./user");

function initModels(sequelize) {
  var Favourite = _Favourite(sequelize, DataTypes);
  var Ingredient = _Ingredient(sequelize, DataTypes);
  var Ingredient_recipe = _Ingredient_recipe(sequelize, DataTypes);
  var Rating = _Rating(sequelize, DataTypes);
  var Recipe = _Recipe(sequelize, DataTypes);
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  Ingredient.belongsToMany(Recipe, { as: 'id_recipe_Recipe_Ingredient_recipes', through: Ingredient_recipe, foreignKey: "id_ingredient", otherKey: "id_recipe" });
  Recipe.belongsToMany(Ingredient, { as: 'id_ingredient_Ingredients', through: Ingredient_recipe, foreignKey: "id_recipe", otherKey: "id_ingredient" });
  Recipe.belongsToMany(User, { as: 'id_user_Users', through: Favourite, foreignKey: "id_recipe", otherKey: "id_user" });
  Recipe.belongsToMany(User, { as: 'id_user_User_Ratings', through: Rating, foreignKey: "id_recipe", otherKey: "id_user" });
  User.belongsToMany(Recipe, { as: 'id_recipe_Recipes', through: Favourite, foreignKey: "id_user", otherKey: "id_recipe" });
  User.belongsToMany(Recipe, { as: 'id_recipe_Recipe_Ratings', through: Rating, foreignKey: "id_user", otherKey: "id_recipe" });
  Ingredient_recipe.belongsTo(Ingredient, { as: "id_ingredient_Ingredient", foreignKey: "id_ingredient"});
  Ingredient.hasMany(Ingredient_recipe, { as: "Ingredient_recipes", foreignKey: "id_ingredient"});
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

  return {
    Favourite,
    Ingredient,
    Ingredient_recipe,
    Rating,
    Recipe,
    SequelizeMeta,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
