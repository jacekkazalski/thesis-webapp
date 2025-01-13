const { authenticateToken } = require("../controller/authController");
const {createRecipe, getRecipe, getAllRecipes} = require("../controller/recipeController");
const router = require("express").Router();

router.route('/create').post(authenticateToken, createRecipe)
router.route('/recipe').get(getRecipe)
router.route('/').get(getAllRecipes)

module.exports = router;