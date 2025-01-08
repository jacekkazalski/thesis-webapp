const {createRecipe} = require("../controller/recipeController");
const router = require("express").Router();

router.route('/create').post(createRecipe)

module.exports = router;