const { authenticateToken } = require("../controller/authController");
const {createRecipe} = require("../controller/recipeController");
const router = require("express").Router();

router.route('/create').post(authenticateToken, createRecipe)

module.exports = router;