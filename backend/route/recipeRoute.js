const { authenticateToken } = require("../controller/authController");
const {createRecipe, getRecipe, getRecipes, isAuthor, deleteRecipe} = require("../controller/recipeController");
const router = require("express").Router();
const upload = require('../config/multerConfig')

router.route('/create').post(authenticateToken, upload.single('image'), createRecipe)
router.route('/recipe').get(getRecipe)
router.route('/').get(getRecipes)
router.route('/author/check').get(authenticateToken, isAuthor)
router.route('/delete').delete(authenticateToken, deleteRecipe)

module.exports = router;