const { authenticateToken } = require("../controller/authController");
const {createRecipe, getRecipe, getAllRecipes, isAuthor, deleteRecipe, getRecipesByUser} = require("../controller/recipeController");
const router = require("express").Router();
const upload = require('../config/multerConfig')

router.route('/create').post(authenticateToken, upload.single('image'), createRecipe)
router.route('/recipe').get(getRecipe)
router.route('/').get(getAllRecipes)
router.route('/author/check').get(authenticateToken, isAuthor)
router.route('/delete').delete(authenticateToken, deleteRecipe)
router.route('/user').get(getRecipesByUser)

module.exports = router;