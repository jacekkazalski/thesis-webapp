const { authenticateToken } = require("../controller/authController");
const {createRecipe, getRecipe} = require("../controller/recipeController");
const router = require("express").Router();

router.route('/create').post(authenticateToken, createRecipe)
router.route('/recipe').get(getRecipe)

module.exports = router;