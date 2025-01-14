const { authenticateToken } = require("../controller/authController");
const {createRecipe, getRecipe, getAllRecipes} = require("../controller/recipeController");
const router = require("express").Router();
const upload = require('../config/multerConfig')

router.route('/create').post(authenticateToken, upload.single('image'), createRecipe)
router.route('/recipe').get(getRecipe)
router.route('/').get(getAllRecipes)

module.exports = router;