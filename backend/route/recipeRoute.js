const { authenticateToken } = require("../controller/authController");
const {createRecipe, getRecipe, getAllRecipes, toggleFavourite, isFavourtie, isAuthor, deleteRecipe} = require("../controller/recipeController");
const router = require("express").Router();
const upload = require('../config/multerConfig')

router.route('/create').post(authenticateToken, upload.single('image'), createRecipe)
router.route('/recipe').get(getRecipe)
router.route('/').get(getAllRecipes)
router.route('/favourites').post(authenticateToken, toggleFavourite)
router.route('/favourites/check').get(authenticateToken, isFavourtie)
router.route('/author/check').get(authenticateToken, isAuthor)
router.route('/delete').delete(authenticateToken, deleteRecipe)

module.exports = router;